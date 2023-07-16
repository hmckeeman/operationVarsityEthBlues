// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AdmissionsOfficer is IERC721Receiver {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum Decision { Pending, Accepted, Denied, Waitlisted }

    struct Application {
        string name;
        string university;
        string ipfsHash;
        Decision decision;
    }

    mapping(uint256 => Application) private _applications;

    constructor() {}

    function reviewApplication(uint256 tokenId, Decision decision) external {
        // You can implement the logic for reviewing the application here
        // For this example, we just store the decision in the contract
        _applications[tokenId].decision = decision;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata /* data */)
        external
        override
        returns (bytes4)
    {
        // Implement logic for handling the received NFT here
        // For example, you can mint an ERC721 token to the AdmissionsOfficer contract
        // or just store the tokenId for later processing
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // You can mint a new ERC721 token here with the newTokenId as per your requirement
        // Alternatively, you can store the tokenId in the contract and process it later.

        // Return the ERC721_RECEIVED selector
        return IERC721Receiver.onERC721Received.selector;
    }

}
