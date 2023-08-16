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
    address private deployer;
    address private applicantContract;
    address private admissionsContract;

    constructor(address _applicantContract, address _admissionsContract) ERC721("Application", "APP") {
        deployer = msg.sender;
        applicantContract = _applicantContract;
        admissionsContract = _admissionsContract;
    }

    function _msgSender() internal view override returns (address) {
        return applicantContract;
    }

    function createApplication(string memory name, string memory university, string memory ipfsLink) external {
        uint256 tokenId = _tokenIds.current();
        _mint(applicantContract, tokenId);
        _tokenIds.increment();

        ApplicantData memory newApplication = ApplicantData(name, university, ipfsLink);
        _applications[tokenId] = newApplication;
    }

    function transferApplicationToOfficerContract(address officerContract, uint256 tokenId) external {
        require(_exists(tokenId), "Application not found");
        address owner = ownerOf(tokenId);
        require(owner == deployer || owner == applicantContract, "Only the contract deployer or authorized applicant contract can call this function");

        address assignedOfficer = Admissions(admissionsContract).getAdmissionsOfficerForApplicant(applicantContract);
        require(assignedOfficer == officerContract, "You can only send your application to your assigned officer");

        approve(officerContract, tokenId);
        safeTransferFrom(applicantContract, officerContract, tokenId);
    }

    function getApplication(uint256 tokenId) external view returns (ApplicantData memory) {
        require(_exists(tokenId), "Application not found");
        return _applications[tokenId];
    }
}
