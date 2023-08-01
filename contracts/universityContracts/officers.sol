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
    address private deployer; // New variable to store the deployer's address
    mapping(address => ApplicantData) private applicantsData;

    constructor(address _admissionsContract) {
        deployer = msg.sender; // Set the deployer address when deploying the contract
        admissionsContract = _admissionsContract;
    }

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) external override returns (bytes4) {
        require(totalAssignedApplicants < type(uint256).max, "Maximum number of applicants reached");

        Application applicationContract = Application(msg.sender);
        Application.ApplicantData memory applicant = applicationContract.getApplication(tokenId);

        applicantsData[from] = ApplicantData(applicant.name, applicant.university, applicant.ipfsLink, false, "");

        totalAssignedApplicants++;
        return this.onERC721Received.selector;
    }

    function getAssignedApplicants() external view returns (address[] memory) {
        address[] memory applicantsForOfficer = Admissions(admissionsContract).getApplicantsForOfficer(address(this));
        return applicantsForOfficer;
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

    function makeDecision(address applicantContract, string calldata decision) external {
        require(isApplicantAssigned(applicantContract), "You can only approve applications of applicants you have been assigned to");
        require(bytes(decision).length > 0, "Decision cannot be empty");

        ApplicantData storage applicantData = applicantsData[applicantContract];
        require(!applicantData.decisionMade, "Decision already made for this applicant");
        applicantData.decisionMade = true;
        applicantData.decision = decision;

        Applicant(applicantContract).receiveDecision(decision); // Call the receiveDecision function of the Applicant contract
    }

    function isApplicantAssigned(address applicantContract) internal view returns (bool) {
        address[] memory applicantsForOfficer = Admissions(admissionsContract).getApplicantsForOfficer(address(this));
        for (uint256 i = 0; i < applicantsForOfficer.length; i++) {
            if (applicantsForOfficer[i] == applicantContract) {
                return true;
            }
        }
        return false;
    }
}
