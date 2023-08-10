// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract Admissions is VRFConsumerBaseV2, ConfirmedOwner {

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    address[] private unassignedApplicants;
    address[] private assignedApplicants;
    address[] private approvedAdmissionsOfficers;
    address[] private newStudents;
    address[] private acceptedApplicants;
    address[] private waitlistedApplicants;
    uint256 private maxStudents;
    uint256 private lastAssignedOfficerIndex;
    uint256 private acceptedStudentCount;

    mapping(uint256 => uint256) private requestIdToPayment;
    mapping(uint256 => uint256[]) private requestIdToRandomWords;
    mapping(uint256 => bool) private requestIdToFulfilled;
    mapping(address => address) private applicantToOfficer;
    mapping(address => uint8) private registeredAddresses;
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    uint16 private requestConfirmations = 3;
    uint32 private numWords = 2;
    uint256 public lastRequestId;
    uint64 s_subscriptionId;
    uint256[] public requestIds;

    address private vrfCoordinatorAddress = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
    uint64 private subscriptionId;

    bytes32 private keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint32 private callbackGasLimit = 100000;

    VRFCoordinatorV2Interface private vrfCoordinator;

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords, uint256 payment);
    event AdmissionsOfficerAssigned(address indexed student, address indexed officer);

    constructor(
        uint256 _maxStudents,
        uint64 _subscriptionId
    )
        VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
        );
        s_subscriptionId = _subscriptionId;
        maxStudents = _maxStudents;
    }

    modifier onlyAdmissionsOfficer() {
        require(isAdmissionsOfficer(msg.sender) || msg.sender == owner(), "Only approved admissions officers or owner can call this function");
        _;
    }

    function approveAdmissionsOfficer(address officer) external onlyAdmissionsOfficer {
        require(registeredAddresses[officer] == 0, "Address is already registered");
        approvedAdmissionsOfficers.push(officer);
        registeredAddresses[officer] = 2; // Set the role of the address to admissions officer (value 2)
    }

    function isAdmissionsOfficer(address officer) public view returns (bool) {
        return registeredAddresses[officer] == 2; // Check if the address has the role of an admissions officer (value 2)
    }

    function isApplicant(address account) public view returns (bool) {
        return registeredAddresses[account] == 1; // Check if the address has the role of an applicant (value 1)
    }

    function getUnassignedApplicants() external view returns (uint256, address[] memory) {
        return (unassignedApplicants.length, unassignedApplicants);
    }

    function getAssignedApplicants() external view returns (uint256, address[] memory) {
        return (assignedApplicants.length, assignedApplicants);
    }

    function getAdmissionsOfficers() external view returns (uint256, address[] memory) {
        return (approvedAdmissionsOfficers.length, approvedAdmissionsOfficers);
    }

    function getNewStudents() external view returns (uint256, address[] memory) {
        return (newStudents.length, newStudents);
    }

    function getWaitlistedApplicants() external view returns (uint256, address[] memory) {
        return (waitlistedApplicants.length, waitlistedApplicants);
    }

    function getAcceptedApplicants () external view returns (uint256, address [] memory) {
        return (acceptedApplicants.length, acceptedApplicants);
    }

    function getAssignedOfficer(address applicant) external view returns (address) {
        return applicantToOfficer[applicant];
    }

    function getApplicantsForOfficer(address officer) external view returns (address[] memory, uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < assignedApplicants.length; i++) {
            if (applicantToOfficer[assignedApplicants[i]] == officer) {
                count++;
            }
        }

        address[] memory applicants = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < assignedApplicants.length; i++) {
            if (applicantToOfficer[assignedApplicants[i]] == officer) {
                applicants[index] = assignedApplicants[i];
                index++;
            }
        }

        return (applicants, count);
    }

    function addApplicant(address applicant) external {
        require(registeredAddresses[applicant] == 0, "Address is already registered");
        unassignedApplicants.push(applicant);
        registeredAddresses[applicant] = 1; // Set the role of the address to applicant (value 1)
    }

    function decreaseMaxStudents() external {
        require(maxStudents > 0, "Cannot decrease maxStudents below 0");
        maxStudents--;
    }

    function addAcceptedApplicant(address applicant) public {
        acceptedApplicants.push(applicant);
    }

    function addWaitlistedApplicant(address applicant) public {
        waitlistedApplicants.push(applicant);
    }

    function addNewStudent(address applicant) external {
        require(applicantToOfficer[applicant] != address(0), "Applicant has not been assigned to an officer");
        newStudents.push(applicant);
    }

    function removeApplicant(address[] storage array, uint256 index) internal {
        if (index >= array.length) return;

        for (uint256 i = index; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        array.pop();
    }

    function removeAcceptedApplicant(address applicant) external {
        for (uint256 i = 0; i < acceptedApplicants.length; i++) {
            if (acceptedApplicants[i] == applicant) {
                removeApplicant(acceptedApplicants, i);
                return;
            }
        }
    }

    function removeAssignedApplicant(address applicant) external {
        for (uint256 i = 0; i < assignedApplicants.length; i++) {
            if (assignedApplicants[i] == applicant) {
                removeApplicant(assignedApplicants, i);
                return;
            }
        }
    }

    function assignAdmissionsOfficer() external payable onlyAdmissionsOfficer {
        require(unassignedApplicants.length > 0, "No unassigned applicants left");
        require(newStudents.length < maxStudents, "Maximum number of students already reached");

        // Request randomness for officer assignment
        uint256 requestId = requestRandomWords();
        requestIdToPayment[requestId] = msg.value; // Store the sent Ether as payment
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
    }

    function requestRandomWords()internal onlyOwner returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(requestIdToPayment[_requestId] > 0, "Request not found");
        requestIdToFulfilled[_requestId] = true;
        requestIdToRandomWords[_requestId] = _randomWords;

        uint256 totalOfficers = approvedAdmissionsOfficers.length;
        uint256 totalApplicants = unassignedApplicants.length;

        // Calculate the number of applicants per officer
        uint256 applicantsPerOfficer = totalApplicants / totalOfficers;
        uint256 remainingApplicants = totalApplicants % totalOfficers;

        // Assign applicants to the officers
        for (uint256 i = 0; i < totalApplicants; i++) {
            if (i >= totalOfficers) {
                // All officers have been assigned, break the loop
                break;
            }

            // Calculate the number of applicants to assign to this officer
            uint256 count = applicantsPerOfficer;
            if (remainingApplicants > 0) {
                count += 1;
                remainingApplicants -= 1;
            }

            // Get the index of the next officer to assign
            uint256 officerIndex = (lastAssignedOfficerIndex + 1) % totalOfficers;

            // Assign applicants to the current officer
            for (uint256 j = 0; j < count; j++) {
                if (unassignedApplicants.length == 0) {
                    // No unassigned applicants left, break the loop
                    break;
                }

                // Use randomness to select an index for the unassigned applicants
                uint256 randomIndex = _randomWords[j] % unassignedApplicants.length;
                address selectedApplicant = unassignedApplicants[randomIndex];

                // Assign the selected applicant to the current officer
                applicantToOfficer[selectedApplicant] = approvedAdmissionsOfficers[officerIndex];
                assignedApplicants.push(selectedApplicant);

                // Remove the assigned applicant from the unassigned applicants list
                removeApplicant(unassignedApplicants, randomIndex);

                // Emit the event
                emit AdmissionsOfficerAssigned(selectedApplicant, approvedAdmissionsOfficers[officerIndex]);

                // Update the last assigned officer index
                lastAssignedOfficerIndex = officerIndex;

                // Increment the officer index for the next iteration
                officerIndex = (officerIndex + 1) % totalOfficers;
            }
        }

    // Clear requestIdToPayment and requestIdToFulfilled mappings for the fulfilled request
    delete requestIdToPayment[_requestId];
    delete requestIdToFulfilled[_requestId];
    delete requestIdToRandomWords[_requestId];
}

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (
            uint256 paid,
            bool fulfilled,
            uint256[] memory randomWords
        )
    {
        require(requestIdToPayment[_requestId] > 0, "Request not found");
        return (
            requestIdToPayment[_requestId],
            requestIdToFulfilled[_requestId],
            requestIdToRandomWords[_requestId]
        );
    }
}