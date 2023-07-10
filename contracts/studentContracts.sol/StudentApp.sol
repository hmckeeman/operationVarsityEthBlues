// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StudentApp is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Application {
        string name;
        string university;
        string ipfsHash;
    }

    mapping(uint256 => Application) private _applications;

    constructor() ERC721("StudentApp", "ADMISSION") {}

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

    function getApplication(uint256 tokenId) external view returns (Application memory) {
        return _applications[tokenId];
    }
}
