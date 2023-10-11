// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/src/Test.sol";
import "../src/admissions.sol"; // Update the import path to your Admissions contract

contract AdmissionsTest is Test {

    Admissions admissions;

    function setUp() public {
        admissions = deployContract(Admissions, 100); // Deploy the Admissions contract with a maximum of 100 students
    }

    function testNameIsSpacebear() public {
        bool isOfficer = admissions.isAdmissionsOfficer(msg.sender);
        assertTrue(isOfficer, "Should be a registered officer");
    }
}
