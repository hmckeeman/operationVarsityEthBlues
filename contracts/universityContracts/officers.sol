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
    mapping(uint256 => address) private tokenIdToApplicant;
    mapping(address => ApplicantData) private applications;
    mapping(address => uint256) private applicantContractToTokenId; // Mapping to store the token ID based on the applicant contract address


    modifier onlyOfficer() {
        require(msg.sender == officer, "Only the officer can call this function");
        _;
    }

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) external override returns (bytes4) {
        require(totalAssignedApplicants < type(uint256).max, "Maximum number of applicants reached");
        tokenIdToApplicant[tokenId] = from;

        Application applicationContract = Application(msg.sender);
        Application.ApplicantData memory applicant = applicationContract.getApplication(tokenId);

        applications[from] = ApplicantData(applicant.name, applicant.university, applicant.ipfsLink, false, "");
        applicantContractToTokenId[from] = tokenId; // Save the token ID based on the applicant contract address

        totalAssignedApplicants++;
        return this.onERC721Received.selector;
    }

    function getAssignedApplicants() onlyOfficer external view returns (address[] memory) {
        (uint256 count, address[] memory assignedApplicants) = Admissions(admissionsContract).getAssignedApplicants();
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = assignedApplicants[i];
        }
        return result;
    }

    function viewApplication(address applicantContract) onlyOfficer external view returns (string memory, string memory, string memory, bool, string memory) {
        uint256 tokenId = applicantContractToTokenId[applicantContract]; // Get the token ID from the mapping
        address applicant = tokenIdToApplicant[tokenId]; // Get the applicant's address from the token ID mapping
        ApplicantData storage applicantData = applications[applicant];
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

    function makeDecision(address applicant, string calldata decision) onlyOfficer external {
        require(bytes(decision).length > 0, "Decision cannot be empty");
        ApplicantData storage applicantData = applications[applicant];
        require(!applicantData.decisionMade, "Decision already made for this applicant");
        applicantData.decisionMade = true;
        applicantData.decision = decision;

        uint256 tokenId = applicantContractToTokenId[applicant];
        require(tokenId != 0, "Token ID not found for the applicant");
        address applicationContractAddress = tokenIdToApplicant[tokenId];
        require(applicationContractAddress != address(0), "Applicant contract not found for the applicant");
        Applicant(applicationContractAddress).receiveDecision(decision); // Call the receiveDecision function of the Applicant contract
    }
}
