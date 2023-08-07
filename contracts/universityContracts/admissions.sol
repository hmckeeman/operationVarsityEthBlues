// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admissions {

    address private deployer;
    address[] private unassignedApplicants;
    address[] private assignedApplicants;
    address[] private approvedAdmissionsOfficers;
    address[] private newStudents; // New array to store addresses of accepted students
    address[] private acceptedApplicants;
    address[] private waitlistedApplicants; // New array to store addresses of waitlisted applicants
    uint256 private maxStudents;
    uint256 private lastAssignedOfficerIndex;
    uint256 private acceptedStudentCount; // New variable to keep track of accepted students

    mapping(address => address) private applicantToOfficer;
    mapping(address => uint8) private registeredAddresses; // Combined mapping to track registered addresses and their roles

    modifier onlyAdmissionsOfficer() {
        require(isAdmissionsOfficer(msg.sender) || msg.sender == deployer, "Only approved admissions officers or deployer can call this function");
        _;
    }

    event AdmissionsOfficerAssigned(address indexed student, address indexed officer);

    constructor(uint256 _maxStudents) {
        maxStudents = _maxStudents;
        deployer = msg.sender;
        // Note: The deployer is no longer automatically added as an approved officer
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

    function assignAdmissionsOfficer() external onlyAdmissionsOfficer {
        require(unassignedApplicants.length > 0, "No unassigned applicants left");
        require(newStudents.length < maxStudents, "Maximum number of students already reached");

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

                uint256 randomIndex = getRandomIndex(unassignedApplicants.length);
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
    }

    function getRandomIndex(uint256 length) internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % length;
        return seed;
    }
}
