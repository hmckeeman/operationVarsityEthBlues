// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../applicantContracts/application.sol";

contract Officer is IERC721Receiver {
    struct ApplicantData {
        string name;
        string university;
        string ipfsLink;
    }

    address private officer;
    address private admissionsContract;
    uint256 private totalAssignedApplicants;
    mapping(uint256 => address) private tokenIdToApplicant;
    mapping(address => ApplicantData) private applications;

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
        applications[from] = ApplicantData(applicant.name, applicant.university, applicant.ipfsLink);

        totalAssignedApplicants++;
        return this.onERC721Received.selector;
    }

    function getAssignedApplicants() onlyOfficer external view returns(address[] memory) {
        (uint256 count, address[] memory assignedApplicants) = IAdmissions(admissionsContract).getAssignedApplicants();
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = assignedApplicants[i];
        }
        return result;
    }

    function viewApplication(address applicant) onlyOfficer external view returns (string memory, string memory, string memory) {
        ApplicantData storage applicantData = applications[applicant];
        if (bytes(applicantData.name).length != 0) {
            return (
                applicantData.name,
                applicantData.university,
                applicantData.ipfsLink
            );
        } else {
            return ("", "", "Application not received");
        }
    }
}

interface IAdmissions {
    function getAssignedApplicants() external view returns (uint256, address[] memory);
}
