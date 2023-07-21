// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../universityContracts/admissions.sol";

contract Register {
    address payable public admissionsOffice;
    address public applicant;

    constructor(address payable _admissions) {
        admissionsOffice = _admissions;
        applicant = msg.sender;
    }

    modifier onlyApplicant() {
        require(msg.sender == applicant, "Only the applicant can call this function");
        _;
    }

    function registerWithAdmissions() external payable {
        require(admissionsOffice != address(0), "AdmissionsOffice address not set");
        require(msg.value >= 10 wei, "Insufficient payment");

        (bool success, ) = admissionsOffice.call{value: 10 wei}("");
        require(success, "ETH transfer to AdmissionsOffice failed");

        Admissions(admissionsOffice).addApplicant(applicant);
    }

    function getAssignedOfficer() external view onlyApplicant returns (address) {
        // Retrieve the assigned officer for the contract deployer (applicant)
        return Admissions(admissionsOffice).getAssignedOfficer(applicant);
    }

    function isApplicantRegistered() external view returns (bool) {
        // Check if the applicant is registered (present in unassignedApplicants)
        return Admissions(admissionsOffice).isApplicantRegistered(applicant);
    }
}
