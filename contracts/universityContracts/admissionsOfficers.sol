// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../applicantContracts/application.sol";

contract AdmissionsOfficer is IERC721Receiver {

    // Map tokenIds to Applications
    mapping (uint256 => StudentApp.Application) private applications;
    
    function onERC721Received(address, address, uint256 tokenId, bytes calldata) 
        override external returns(bytes4) {
        
        StudentApp studentApp = StudentApp(msg.sender); // Assuming the NFT contract is the sender
        applications[tokenId] = studentApp.getApplication(tokenId);

        return this.onERC721Received.selector;
    }
    
    function viewApplication(uint256 tokenId) external view returns (StudentApp.Application memory) {
        return applications[tokenId];
    }
}
