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
        assertEq(application.ownerOf(tokenId), msg.sender);
    }

    function testTransferApplicationToOfficerContract() public {
        address officerContract = address(0xAddressOfOfficerContract);
        uint256 tokenId = application.getCurrentTokenId();
        application.createApplication("Jane Smith", "Top University", "ipfs://link-to-application-data");
        application.transferApplicationToOfficerContract(officerContract, tokenId);
        assertEq(application.ownerOf(tokenId), officerContract);
    }

    function testGetApplicationData() public {
        uint256 tokenId = application.getCurrentTokenId();
        application.createApplication("Alice Johnson", "Another University", "ipfs://link-to-application-data");
        Application.ApplicantData memory data = application.getApplication(tokenId);
        assertEq(data.name, "Alice Johnson");
        assertEq(data.university, "Another University");
    }
}
