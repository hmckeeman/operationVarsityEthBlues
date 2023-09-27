const Admissions = artifacts.require("Admissions");
const Applicant = artifacts.require("Applicant");
const fs = require('fs');  // Include the File System module

module.exports = async function(deployer, network, accounts) {
  // Fetch the deployed Admissions contract
  const admissions = await Admissions.deployed();

  // Number of instances you want to deploy
  const numberOfInstances = 4;

  // Initialize a fresh array to keep track of the deployed addresses
  let deployedAddresses = [];

  for (let i = 0; i < numberOfInstances; i++) {
    // Deploy the Applicant contract and pass the address of the Admissions contract as a constructor parameter
    await deployer.deploy(Applicant, admissions.address);
    
    // Push the newly deployed address into the array
    deployedAddresses.push(Applicant.address);

    console.log(`Applicant ${i + 1} deployed with the address:`, Applicant.address);
  }

  // Log the deployed addresses before saving, just for double-checking
  console.log("Deployed addresses before saving:", deployedAddresses);

  // Save the deployed addresses to a JSON file
  fs.writeFileSync('deployedApplicantAddresses.json', JSON.stringify(deployedAddresses, null, 2));

  console.log("All Applicants deployed. Addresses saved to deployedApplicantAddresses.json");
};
