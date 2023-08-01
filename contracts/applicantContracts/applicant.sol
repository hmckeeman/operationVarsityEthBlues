// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../universityContracts/admissions.sol";

contract Applicant {
    address public admissionsOffice;
    address public applicant;
    bool public decisionReceived; // New variable to track decision status
    string public admissionDecision; // New variable to store the admission decision
    address private contractDeployer; // State variable to store the contract deployer's address
    address private officerContract; // New variable to store the officer contract address

    modifier onlyOwner() {
        require(msg.sender == contractDeployer, "Only the contract deployer can call this function");
        _;
    }

    constructor(address _admissions) {
        contractDeployer = msg.sender; // Set the contract deployer's address
        admissionsOffice = _admissions;
        applicant = address(this); // Set applicant to the address of the caller (the deployer of the contract)

        Admissions(admissionsOffice).addApplicant(applicant);
    }

    function getAssignedOfficer() external view onlyOwner returns (address) {
        return Admissions(admissionsOffice).getAssignedOfficer(applicant);
    }

    function isApplicantRegistered() external view onlyOwner returns (bool) {
        return Admissions(admissionsOffice).isApplicant(applicant);
    }

    function receiveDecision(string calldata decision) external {
        require(msg.sender == officerContract, "Only the approved officer can call this function");
        require(!decisionReceived, "Decision has already been received");
        decisionReceived = true;
        admissionDecision = decision;
    }

    function grantOfficerApproval(address _officerContract) external onlyOwner {
        officerContract = _officerContract;
    }
}
