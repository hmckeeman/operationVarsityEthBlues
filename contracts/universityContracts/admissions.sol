// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admissions {

    address private deployer;
    address[] private unassignedApplicants;
    address[] private assignedApplicants;
    address[] private approvedAdmissionsOfficers;
    address[] private newStudents;
    address[] private acceptedApplicants;
    address[] private waitlistedApplicants;
    uint256 private maxStudents;
    
    mapping(address => address) private applicantToOfficer;
    mapping(address => uint8) private registeredAddresses;
    mapping(address => address[]) private officerToApplicants;

    modifier onlyAdmissionsOfficer() {
        require(isAdmissionsOfficer(msg.sender) || msg.sender == deployer, "Only approved admissions officers or deployer can call this function");
        _;
    }

    event AdmissionsOfficerAssigned(address indexed applicant, address indexed officer);

    constructor(uint256 _maxStudents) {
        maxStudents = _maxStudents;
        deployer = msg.sender;
    }

    function approveOfficer(address officer) external onlyAdmissionsOfficer {
        require(registeredAddresses[officer] == 0, "Address is already registered");
        approvedAdmissionsOfficers.push(officer);
        registeredAddresses[officer] = 2;
    }

    function isAdmissionsOfficer(address officer) public view returns (bool) {
        return registeredAddresses[officer] == 2;
    }

    function isApplicant(address account) public view returns (bool) {
        return registeredAddresses[account] == 1;
    }

    function getMaxStudents() public view returns (uint256) {
        return maxStudents;
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

    function getAcceptedApplicants () external view returns (uint256, address [] memory) {
        return (acceptedApplicants.length, acceptedApplicants);
    }

    function getWaitlistedApplicants() external view returns (uint256, address[] memory) {
        return (waitlistedApplicants.length, waitlistedApplicants);
    }
    
    function getAdmissionsOfficerForApplicant(address applicant) public view returns (address) {
        return applicantToOfficer[applicant];
    }

    function getApplicantsForOfficer(address officerAddress) public view returns (address[] memory, uint256) {
        address[] memory applicants = officerToApplicants[officerAddress];
        return (applicants, applicants.length);
    }

    function addApplicant(address applicant) external {
        require(registeredAddresses[applicant] == 0, "Address is already registered");
        unassignedApplicants.push(applicant);
        registeredAddresses[applicant] = 1;
    }

    function addAcceptedApplicant(address applicant) public onlyAdmissionsOfficer {
        acceptedApplicants.push(applicant);
    }

    function addWaitlistedApplicant(address applicant) public onlyAdmissionsOfficer {
        waitlistedApplicants.push(applicant);
    }

    function addNewStudent(address applicant) external {
        require(applicantToOfficer[applicant] != address(0), "Applicant has not been assigned to an officer");
        require(isAcceptedApplicant(applicant), "Applicant has not been accepted");
        newStudents.push(applicant);
    }

    function assignAdmissionsOfficer() external onlyAdmissionsOfficer {
        require(unassignedApplicants.length > 0, "No unassigned applicants left");
        require(newStudents.length < maxStudents, "Maximum number of students already reached");
        require(approvedAdmissionsOfficers.length > 0, "No admissions officers to assign");

        // Step 1: Randomly shuffle the officers
        for (uint256 i = 0; i < approvedAdmissionsOfficers.length; i++) {
            uint256 randomIndex = getRandomIndex(approvedAdmissionsOfficers.length);
            // Swap
            address temp = approvedAdmissionsOfficers[i];
            approvedAdmissionsOfficers[i] = approvedAdmissionsOfficers[randomIndex];
            approvedAdmissionsOfficers[randomIndex] = temp;
        }

        // Step 2: Assign applicants in a round-robin fashion
        uint256 officerIndex = 0;
        while (unassignedApplicants.length > 0) {
            address applicant = unassignedApplicants[unassignedApplicants.length - 1];
            address officer = approvedAdmissionsOfficers[officerIndex];

            assignApplicantToOfficer(applicant, officer);
            removeApplicant(unassignedApplicants, unassignedApplicants.length - 1);

            // Move to the next officer, wrap around if necessary
            officerIndex = (officerIndex + 1) % approvedAdmissionsOfficers.length;
        }
    }

    function assignApplicantToOfficer(address applicant, address officer) internal {
        applicantToOfficer[applicant] = officer;
        assignedApplicants.push(applicant);
        
        // Add the applicant to the list of applicants for this officer
        officerToApplicants[officer].push(applicant);
        
        emit AdmissionsOfficerAssigned(applicant, officer);
    }

    function removeApplicant(address[] storage array, uint256 index) internal {
        require(index < array.length, "Index out of bounds");
        array[index] = array[array.length - 1];
        array.pop();
    }

    function removeAcceptedApplicant(address applicant) external {
        for (uint i = 0; i < acceptedApplicants.length; i++) {
            if (acceptedApplicants[i] == applicant) {
                removeApplicant(acceptedApplicants, i);
                break;
            }
        }
    }

    function removeAssignedApplicant(address officerAddress, address applicantAddress) public {
        // Get the list of applicants for the given officer
        address[] storage applicants = officerToApplicants[officerAddress];

        // Find the index of the applicant to be removed
        uint256 indexToRemove = applicants.length;
        for (uint256 i = 0; i < applicants.length; i++) {
            if (applicants[i] == applicantAddress) {
                indexToRemove = i;
                break;
            }
        }

        // Ensure that the applicant was found in the array
        require(indexToRemove < applicants.length, "Applicant not found");

        // Remove the applicant from the array by moving the last element
        // to the index to remove, and then decreasing the array size
        applicants[indexToRemove] = applicants[applicants.length - 1];
        applicants.pop();
    }

    function decreaseMaxStudents() external {
        require(maxStudents > 0, "Max students already at zero");
        maxStudents -= 1;
    }

    function getRandomIndex(uint256 length) internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % length;
        return seed;
    }

    function getRandomOfficer() internal view returns (address) {
        uint randomIndex = getRandomIndex(approvedAdmissionsOfficers.length);
        return approvedAdmissionsOfficers[randomIndex];
    }

    function isAcceptedApplicant(address applicant) internal view returns (bool) {
        for (uint256 i = 0; i < acceptedApplicants.length; i++) {
            if (acceptedApplicants[i] == applicant) {
                return true;
            }
        }
        return false;
    }
}