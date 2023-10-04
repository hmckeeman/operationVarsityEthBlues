// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "admissions.sol";

contract Applicant {
    address public admissionsContract;
    address public applicant;
    bool public decisionReceived;
    string public admissionDecision;
    address private contractDeployer;
    address private officerContract;

    modifier onlyAuthorized() {
        require(msg.sender == contractDeployer || msg.sender == officerContract, "Only the contract deployer or the approved officer can call this function");
        _;
    }

    constructor(address _admissions) {
        contractDeployer = msg.sender;
        admissionsContract = _admissions;
        applicant = address(this);
        Admissions(admissionsContract).addApplicant(applicant);
    }

    function getAssignedOfficer() external view onlyAuthorized returns (address) {
        return Admissions(admissionsContract).getAdmissionsOfficerForApplicant(applicant);
    }

    function isApplicantRegistered() external view onlyAuthorized returns (bool) {
        return Admissions(admissionsContract).isApplicant(applicant);
    }

    function receiveDecision(string calldata decision) external onlyAuthorized {
        require(!decisionReceived, "Decision has already been received");
        decisionReceived = true;
        admissionDecision = decision;
    }

    function grantOfficerApproval(address _officerContract) external onlyAuthorized {
        officerContract = _officerContract;
    }

    function acceptOffer() external {
        require(decisionReceived, "Decision not received yet");
        require(bytes(admissionDecision).length > 0, "Admission decision not available");
        require(keccak256(bytes(admissionDecision)) == keccak256("accepted"), "You can only accept the offer if you have been accepted");

        // Add the applicant to the newStudents array in the Admissions contract
        Admissions(admissionsContract).addNewStudent(address(this));

        // Remove the applicant from the acceptApplicants array in the Admissions contract
        Admissions(admissionsContract).removeAcceptedApplicant(address(this));

        // Decrease the maxStudents count in the Admissions contract
        Admissions(admissionsContract).decreaseMaxStudents();
    }

}