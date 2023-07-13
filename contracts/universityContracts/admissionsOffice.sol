// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdmissionsOffice {
    address[] private unassignedApplicants;
    address[] private assignedApplicants;
    address[] private acceptedStudents;
    address[] private approvedAdmissionsOfficers;
    uint256 private maxStudents;

    mapping(address => address) private applicantToOfficer; // Mapping to store assigned officer's address for each student

    receive() external payable {
        // No logic required in the fallback function
    }

    constructor(uint256 _maxStudents) {
        maxStudents = _maxStudents;
        // Approve deployer of admissionsOffice contract
        approvedAdmissionsOfficers.push(msg.sender);
    }

    modifier onlyAdmissionsOfficer() {
        require(isAdmissionsOfficer(msg.sender), "Only approved admissions officers can call this function");
        _;
    }

    event AdmissionsOfficerAssigned(address indexed student, address indexed officer);

    function isAdmissionsOfficer(address officer) public view returns (bool) {
        for (uint256 i = 0; i < approvedAdmissionsOfficers.length; i++) {
            if (approvedAdmissionsOfficers[i] == officer) {
                return true;
            }
        }
        return false;
    }

    function getUnassignedApplicants() external view returns (uint256, address[] memory) {
        return (unassignedApplicants.length, unassignedApplicants);
    }

    function getAssignedApplicants() external view returns (uint256, address[] memory) {
    return (assignedApplicants.length, assignedApplicants);
    }

    function getAcceptedStudents() external view returns (uint256, address[] memory) {
        return (acceptedStudents.length, acceptedStudents);
    }

    function getAdmissionsOfficers() external view returns (uint256, address[] memory) {
        return (approvedAdmissionsOfficers.length, approvedAdmissionsOfficers);
    }

    function addApplicant(address applicant) external {
        unassignedApplicants.push(applicant);
    }

    function approveAdmissionsOfficer(address officer) external onlyAdmissionsOfficer {
        approvedAdmissionsOfficers.push(officer);
    }

    function assignAdmissionsOfficer() external onlyAdmissionsOfficer {
        require(unassignedApplicants.length > 0, "No unassigned applicants left");
        require(acceptedStudents.length < maxStudents, "Maximum number of students already reached");

        // Iterate through admissions officers and assign a random unassigned applicant
        for (uint256 i = 0; i < approvedAdmissionsOfficers.length; i++) {
            if (unassignedApplicants.length == 0) {
                // No unassigned applicants left, break the loop
                break;
            }

            uint256 randomIndex = getRandomIndex(unassignedApplicants.length);
            address selectedApplicant = unassignedApplicants[randomIndex];

            // Check if the applicant has already been assigned an officer
            if (applicantToOfficer[selectedApplicant] == address(0)) {
                // Assign the selected applicant to the current officer
                applicantToOfficer[selectedApplicant] = approvedAdmissionsOfficers[i];
                assignedApplicants.push(selectedApplicant);

                // Remove the assigned applicant from the unassigned applicants list
                removeApplicant(randomIndex);

                // Emit the event
                emit AdmissionsOfficerAssigned(selectedApplicant, approvedAdmissionsOfficers[i]);
            }
        }
    }

    function removeApplicant(uint256 index) internal {
        if (index >= unassignedApplicants.length) return;

        for (uint256 i = index; i < unassignedApplicants.length - 1; i++) {
            unassignedApplicants[i] = unassignedApplicants[i + 1];
        }
        unassignedApplicants.pop();
    }

    function getRandomIndex(uint256 length) internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % length;
        return seed;
    }

    function getAssignedOfficer(address applicant) public view returns (address) {
        return applicantToOfficer[applicant];
    }

    function getApplicantsForOfficer(address officer) external view returns (uint256, address[] memory) {
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

        return (count, applicants);
    }
}