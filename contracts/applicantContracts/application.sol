// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Application is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct ApplicantData {
        string name;
        string university;
        string ipfsLink;
    }

    mapping(uint256 => ApplicantData) private _applications;

    constructor() ERC721("Application", "APP") {}

    function createApplication(string memory name, string memory university, string memory ipfsLink) external {
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _tokenIds.increment();

        ApplicantData memory newApplication = ApplicantData(name, university, ipfsLink);
        _applications[tokenId] = newApplication;
    }

    function transferApplicationToOfficerContract(address officerContract, uint256 tokenId) external {
        // Make sure the officer contract is approved to receive the NFT
        approve(officerContract, tokenId);

        // Transfer the NFT to the officer contract
        safeTransferFrom(msg.sender, officerContract, tokenId);
    }

    function getApplication(uint256 tokenId) external view returns (ApplicantData memory) {
        return _applications[tokenId];
    }
}
