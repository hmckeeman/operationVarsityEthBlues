// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Application.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ApplicationTest is Test {

    Application application;

    function setUp() public {
        application = new Application(msg.sender, msg.sender);
    }

    function testCreateApplication() public {
        uint256 tokenId = application.getCurrentTokenId();
        application.createApplication("John Doe", "Best University", "ipfs://link-to-application-data");
        assertTrue(application.ownerOf(tokenId) == msg.sender, "Application ownership test failed.");
    }

    function testTransferApplicationToOfficerContract() public {
        address officerContract = address(0xAddressOfOfficerContract);
        uint256 tokenId = application.getCurrentTokenId();
        application.createApplication("Jane Smith", "Top University", "ipfs://link-to-application-data");
        application.transferApplicationToOfficerContract(officerContract, tokenId);
        assertTrue(application.ownerOf(tokenId) == officerContract, "Transfer application to officer contract test failed.");
    }

    function testGetApplicationData() public {
        uint256 tokenId = application.getCurrentTokenId();
        application.createApplication("Alice Johnson", "Another University", "ipfs://link-to-application-data");
        Application.ApplicantData memory data = application.getApplication(tokenId);
        assertTrue(keccak256(abi.encodePacked(data.name)) == keccak256(abi.encodePacked("Alice Johnson")), "Get application data test failed.");
    }
}
