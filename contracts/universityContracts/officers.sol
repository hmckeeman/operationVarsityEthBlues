// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../applicantContracts/application.sol";
import "../universityContracts/admissions.sol"; // Import the Admissions contract
import "../applicantContracts/register.sol"; // Import the Register contract


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
    mapping(address => address) private registerToApplicant; // Mapping to store the applicant's address based on their Register contract address

    constructor(address _admissionsContract) {
        officer = msg.sender;
        admissionsContract = _admissionsContract;
    }

    modifier onlyOfficer() {
        require(msg.sender == officer, "Only the officer can call this function");
        _;
    }

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) 
        override external returns (bytes4) {

        require(totalAssignedApplicants < type(uint256).max, "Maximum number of applicants reached");
        tokenIdToApplicant[tokenId] = from;

        // Get the application contract instance
        Application applicationContract = Application(msg.sender);
        // Get the application details using the tokenId
        Application.Applicant memory applicant = applicationContract.getApplication(tokenId);

        // Store the application data
        applications[from] = ApplicantData(applicant.name, applicant.university, applicant.ipfsLink, false, "");
        // Store the mapping of Register contract address to applicant address
        registerToApplicant[from] = from;

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

    function viewApplication(address applicant) onlyOfficer external view returns (string memory, string memory, string memory, bool, string memory) {
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

        // Relay the decision back to the applicant's Register contract
        address registerAddress = registerToApplicant[applicant];
        require(registerAddress != address(0), "Register contract not found for the applicant");
        Register(registerAddress).receiveDecision(decision);
    }
}
