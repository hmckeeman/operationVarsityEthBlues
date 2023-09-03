const fs = require('fs');
const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(deployer, network, accounts) {
  const deployerAddress = accounts[0];
  const numberOfOfficers = 3; // This should be less than or equal to accounts.length - 1

  if (numberOfOfficers >= accounts.length) {
    throw new Error("Not enough accounts to deploy officers");
  }

  const deployedOfficerAddresses = []; // Array to hold deployed Officer addresses
  
  await deployer.deploy(Admissions, 1000, { from: deployerAddress });
  const admissionsInstance = await Admissions.deployed();

  for (let i = 0; i < numberOfOfficers; i++) {
    const officerAccount = accounts[i + 1]; // Use a different account for each Officer
    await deployer.deploy(Officer, admissionsInstance.address, { from: officerAccount });
    const officerInstance = await Officer.deployed();
    deployedOfficerAddresses.push(officerInstance.address); // Add deployed Officer address to the array

    // Log the deployed Officer's address and the account that deployed it
    console.log(`Officer ${i + 1} deployed with the address: ${officerInstance.address} by the account: ${officerAccount}`);
  }

  // Write the deployed Officer addresses to a JSON file
  fs.writeFileSync('deployedOfficerAddresses.json', JSON.stringify(deployedOfficerAddresses));
};
