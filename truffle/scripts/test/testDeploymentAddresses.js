const Admissions = artifacts.require("Admissions");

const fs = require('fs');

// Importing the JSON files with the addresses.
const deployedOfficerAddresses = require('../deployedOfficerAddresses.json');
const deployedApplicantAddresses = require('../deployedApplicantAddresses.json');

contract("Deployment Addresses Test", (accounts) => {
  
  it("checks if all contracts were deployed by different accounts", async () => {
    const admissionsInstance = await Admissions.deployed();

    // Retrieve deployer of Admissions contract
    const admissionsDeployer = await admissionsInstance.getDeployer();

    // Check if deployer address is in one of the accounts
    assert(accounts.includes(admissionsDeployer), "Admissions contract was not deployed by one of the accounts");

    // Check uniqueness among all deployed addresses:
    const allDeployedAddresses = [...deployedOfficerAddresses, ...deployedApplicantAddresses, admissionsDeployer];
    const uniqueAddresses = [...new Set(allDeployedAddresses)];

    assert.equal(allDeployedAddresses.length, uniqueAddresses.length, "All contracts were not deployed by unique accounts");
  });
  
});

