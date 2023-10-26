// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "./Application.sol";

contract ApplicationScript is Script {
    function setUp() public {}

    function run() public {
        // Deploy the Application contract
        Application application = new Application(msg.sender, msg.sender);
        
        // Create an ApplicantData struct
        Application.ApplicantData memory newApplicant = Application.ApplicantData(
            "John Doe",
            "MIT",
            "https://ipfs.io/ipfs/bafybeihloosz2khq3qvqqy75hblmnwdsoe5zufotapameko76ea6v5m7oi/universityApp.jpg"
        );

        // Create an application using the provided data
        application.createApplication(newApplicant.name, newApplicant.university, newApplicant.ipfsLink);

        // Perform any additional setup or interactions with the deployed contract here
    }
}
