// Import necessary dependencies for writing tests
//import "@foundry-sh/core";
//import "hardhat/console.sol"; // Import console for debugging
pragma solidity ^0.8.17;
// Import the contract you want to test
import "../src/admissions.sol";

contract AdmissionsTest {
    Admissions admissions;

    // Deploy the contract before running tests
    function beforeEach() public {
        admissions = deploy(Admissions, 100); // Deploy the Admissions contract with a maximum of 100 students
    }

    // Write a simple test case
    function testRegisterOfficer() public {
        // Call the registerOfficer function from the Admissions contract
        // Note: You should have the logic to approve the sender as an officer
        admissions.registerOfficer(address(this));

        // Check if the sender has been registered as an officer
        bool isOfficer = admissions.isAdmissionsOfficer(address(this));
        assertTrue(isOfficer, "Should be a registered officer");
    }
}
