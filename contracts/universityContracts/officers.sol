// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../applicantContracts/application.sol";
import "../universityContracts/admissions.sol";
import "../applicantContracts/applicant.sol"; // Import the Applicant contract

contract Officer is IERC721Receiver {
    struct ApplicantData {
        string name;
        string university;
        string ipfsLink;
        bool decisionMade;
        string decision;
    }

    address private officer;
    address private admissionsContract;
    uint256 private totalAssignedApplicants;
    address private deployer;
    mapping(address => ApplicantData) private applicantsData;
    mapping(address => address) private applicantToOfficer;
    address[] private assignedApplicants; // Array to track assigned applicants

    // Modifier to allow only the contract deployer to call the standardized functions
    modifier onlyAuthorized() {
        require(msg.sender == deployer, "Only the contract deployer can call this function");
        _;
    }

    constructor(address _admissionsContract) {
        deployer = msg.sender;
        admissionsContract = _admissionsContract;
        
        // Register the officer upon deployment
        Admissions(admissionsContract).registerOfficer(address(this));
    }

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) external override returns (bytes4) {
        require(totalAssignedApplicants < type(uint256).max, "Maximum number of applicants reached");

        Application applicationContract = Application(msg.sender);
        Application.ApplicantData memory applicant = applicationContract.getApplication(tokenId);

        applicantsData[from] = ApplicantData(applicant.name, applicant.university, applicant.ipfsLink, false, "");

        totalAssignedApplicants++;
        return this.onERC721Received.selector;
    }

    function getAssignedApplicants() external view returns (address[] memory, uint256) {
        return Admissions(admissionsContract).getApplicantsForOfficer(address(this));
    }

    function viewApplicant(address applicantContract) external view returns (string memory, string memory, string memory, bool, string memory) {
        require(isApplicantAssigned(applicantContract), "You can only view applications of applicants you have been assigned to");

        ApplicantData memory applicantData = applicantsData[applicantContract];
        if (bytes(applicantData.name).length != 0) {
            return (
                applicantData.name,
                applicantData.university,
                applicantData.ipfsLink,
                applicantData.decisionMade,
                applicantData.decision
            );
        } else {
            return ("", "", "Application not received", false, "");
        }
    }

    function makeDecision(address applicantContract, string memory decision) internal {
        require(isApplicantAssigned(applicantContract), "You can only approve applications of applicants you have been assigned to");
        require(bytes(decision).length > 0, "Decision cannot be empty");
        ApplicantData storage applicantData = applicantsData[applicantContract];
        require(!applicantData.decisionMade, "Decision already made for this applicant");
        applicantData.decisionMade = true;
        applicantData.decision = decision;

        // Update the decision in the Applicant contract
        Applicant(applicantContract).receiveDecision(decision);

        // Update the admissions contract based on the decision
        if (keccak256(bytes(decision)) == keccak256(bytes("accepted"))) {
            Admissions(admissionsContract).addAcceptedApplicant(applicantContract);
        } else if (keccak256(bytes(decision)) == keccak256(bytes("waitlisted"))) {
            Admissions(admissionsContract).addWaitlistedApplicant(applicantContract);
        }

        // Remove the applicant's address from the officer's assigned applicants list
        Admissions(admissionsContract).removeAssignedApplicant(address(this), applicantContract);
    }

    function isApplicantAssigned(address applicantContract) internal view returns (bool) {
        (address[] memory applicantsForOfficer, ) = Admissions(admissionsContract).getApplicantsForOfficer(address(this));
        for (uint256 i = 0; i < applicantsForOfficer.length; i++) {
            if (applicantsForOfficer[i] == applicantContract) {
                return true;
            }
        }
        return false;
    }

    // Standardized functions for making admission decisions
    function acceptApplicant(address applicantContract) external onlyAuthorized {
        makeDecision(applicantContract, "accepted");
    }

    function denyApplicant(address applicantContract) external onlyAuthorized {
        makeDecision(applicantContract, "denied");
    }

    function waitlistApplicant(address applicantContract) external onlyAuthorized {
        makeDecision(applicantContract, "waitlisted");
    }

}
