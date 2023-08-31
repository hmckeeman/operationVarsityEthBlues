const fs = require('fs');
const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(deployer, network, accounts) {
  const deployerAddress = accounts[0];
  const numberOfOfficers = 3;
  const deployedOfficerAddresses = []; // Array to hold deployed Officer addresses
  
  await deployer.deploy(Admissions, 1000, { from: deployerAddress });
  const admissionsInstance = await Admissions.deployed();

  for (let i = 0; i < numberOfOfficers; i++) {
    await deployer.deploy(Officer, admissionsInstance.address, { from: deployerAddress });
    const officerInstance = await Officer.deployed();
    deployedOfficerAddresses.push(officerInstance.address); // Add deployed Officer address to the array
  }

  // Write the deployed Officer addresses to a JSON file
  fs.writeFileSync('deployedOfficerAddresses.json', JSON.stringify(deployedOfficerAddresses));
};
