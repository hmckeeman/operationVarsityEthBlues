// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../universityContracts/admissionsOfficers.sol";

contract StudentApp is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public admissionsOfficer;

    struct Application {
        string name;
        string university;
        string ipfsHash;
    }

    mapping(uint256 => Application) private _applications;

    constructor(address _admissionsOfficer) ERC721("Application", "APP") {
        admissionsOfficer = _admissionsOfficer;
    }

    function createApplication(string memory name, string memory university, string memory ipfsHash) external returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _mint(msg.sender, tokenId);

        Application storage newApplication = _applications[tokenId];
        newApplication.name = name;
        newApplication.university = university;
        newApplication.ipfsHash = ipfsHash;

        return tokenId;
    }

    function transferApplicationToAdmissionsOfficer(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT application");
        require(admissionsOfficer != address(0), "Admissions officer address is not set");

        safeTransferFrom(msg.sender, admissionsOfficer, tokenId);
    }

    function getApplication(uint256 tokenId) external view returns (Application memory) {
        return _applications[tokenId];
    }
}
