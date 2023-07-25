// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../universityContracts/admissions.sol";

contract Register {
    address public admissionsOffice;
    address public applicant;

    constructor(address _admissions) {
        admissionsOffice = _admissions;
        applicant = msg.sender;

        // Add the applicant to the unassignedApplicants array in the Admissions contract
        Admissions(admissionsOffice).addApplicant(applicant);
    }

    modifier onlyApplicant() {
        require(msg.sender == applicant, "Only the applicant can call this function");
        _;
    }

    function getAssignedOfficer() external view onlyApplicant returns (address) {
        // Retrieve the assigned officer for the contract deployer (applicant)
        return Admissions(admissionsOffice).getAssignedOfficer(applicant);
    }

    function isApplicantRegistered() external view returns (bool) {
        // Check if the applicant is registered (present in either unassignedApplicants or assignedApplicants)
        return Admissions(admissionsOffice).isApplicantRegistered(applicant);
    }
}
