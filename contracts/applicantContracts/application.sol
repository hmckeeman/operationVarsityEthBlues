// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../universityContracts/admissions.sol";

contract Application is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct ApplicantData {
        string name;
        string university;
        string ipfsLink;
    }

    mapping(uint256 => ApplicantData) private _applications;
    address private applicantContract; // Address of the applicant contract
    address private admissionsContract; // Address of the admissions contract

    constructor(address _applicantContract, address _admissionsContract) ERC721("Application", "APP") {
        applicantContract = _applicantContract;
        admissionsContract = _admissionsContract;

    }

    // Override _msgSender() to return the applicant contract address as the sender
    function _msgSender() internal view override returns (address) {
        return applicantContract;
    }

    function createApplication(string memory name, string memory university, string memory ipfsLink) external {
        uint256 tokenId = _tokenIds.current();

        // Transfer ownership to the applicant contract
        _mint(applicantContract, tokenId);

        // Increment token ID after minting to avoid conflicts
        _tokenIds.increment();

        ApplicantData memory newApplication = ApplicantData(name, university, ipfsLink);
        _applications[tokenId] = newApplication;
    }


    function transferApplicationToOfficerContract(address officerContract, uint256 tokenId) external {
        //require(ownerOf(tokenId) == applicantContract, "You can only transfer your own application");
        
        address assignedOfficer = Admissions(admissionsContract).getAssignedOfficer(applicantContract);
        require(assignedOfficer == officerContract, "You can only send your application to your assigned officer");

        // Make sure the applicant contract is approved to send this application to the officer contract
        approve(officerContract, tokenId);

        // Transfer the NFT to the officer contract
        safeTransferFrom(applicantContract, officerContract, tokenId);
    }

    function getApplication(uint256 tokenId) external view returns (ApplicantData memory) {
        require(_exists(tokenId), "Application not found");
        return _applications[tokenId];
    }
}
