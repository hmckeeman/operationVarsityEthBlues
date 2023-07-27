// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../universityContracts/admissions.sol";

contract Register {
    address public admissionsOffice;
    address public applicant;
    address public registerAddress;
    bool public decisionReceived; // New variable to track decision status
    string public admissionDecision; // New variable to store the admission decision

    constructor(address _admissions) {
        admissionsOffice = _admissions;
        applicant = address(this);

        Admissions(admissionsOffice).addApplicant(applicant);
    }

    modifier onlyApplicant() {
        require(msg.sender == registerAddress, "Only the applicant can call this function");
        _;
    }

    function getAssignedOfficer() external view onlyApplicant returns (address) {
        return Admissions(admissionsOffice).getAssignedOfficer(registerAddress);
    }

    function isApplicantRegistered() external view returns (bool) {
        return Admissions(admissionsOffice).isApplicantRegistered(registerAddress);
    }

    function receiveDecision(string calldata decision) external onlyApplicant {
        require(!decisionReceived, "Decision has already been received");
        decisionReceived = true;
        admissionDecision = decision;
    }
}
