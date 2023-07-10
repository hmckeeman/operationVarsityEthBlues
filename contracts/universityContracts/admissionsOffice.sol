// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdmissionsOffice {
    address[] private applicants;
    address[] private acceptedStudents;
    address[] private approvedAdmissionsOfficers;
    uint256 private maxStudents;

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

    function getApplicants() external view returns (uint256, address[] memory) {
        return (applicants.length, applicants);
    }

    function getAcceptedStudents() external view returns (uint256, address[] memory) {
        return (acceptedStudents.length, acceptedStudents);
    }

    function getAdmissionsOfficers() external view returns (uint256, address[] memory) {
        return (approvedAdmissionsOfficers.length, approvedAdmissionsOfficers);
    }

    function addApplicant(address applicant) external {
        applicants.push(applicant);
    }

    function approveAdmissionsOfficer(address officer) external onlyAdmissionsOfficer {
        approvedAdmissionsOfficers.push(officer);
    }

    function assignAdmissionsOfficer() external onlyAdmissionsOfficer {
        require(applicants.length > 0, "No applicants registered");

        // Generate a random index for the applicant and admissions officer
        uint256 randomApplicantIndex = getRandomIndex(applicants.length);
        uint256 randomOfficerIndex = getRandomIndex(approvedAdmissionsOfficers.length);

        // Retrieve the randomly selected applicant and admissions officer
        address selectedApplicant = applicants[randomApplicantIndex];
        address selectedOfficer = approvedAdmissionsOfficers[randomOfficerIndex];

        // Remove the selected applicant from the array of applicants
        removeApplicant(randomApplicantIndex);

        // Add the selected applicant to the array of accepted students
        acceptedStudents.push(selectedApplicant);

        // Assign the selected officer's address to the applicant
        emit AdmissionsOfficerAssigned(selectedApplicant, selectedOfficer);
    }

    function removeApplicant(uint256 index) internal {
        if (index >= applicants.length) return;

        for (uint256 i = index; i < applicants.length - 1; i++) {
            applicants[i] = applicants[i + 1];
        }
        applicants.pop();
    }

    function getRandomIndex(uint256 length) internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % length;
        return seed;
    }
}
