const Admissions = artifacts.require("Admissions");
const Applicant = artifacts.require("Applicant");

module.exports = async function(deployer, network, accounts) {
  // Fetch the deployed Admissions contract
  const admissions = await Admissions.deployed();

  // Number of instances you want to deploy
  const numberOfInstances = 5;

  // An array to keep track of the deployed addresses
  let deployedAddresses = [];

  for (let i = 0; i < numberOfInstances; i++) {
    // Deploy the Applicant contract and pass the address of the Admissions contract as a constructor parameter
    await deployer.deploy(Applicant, admissions.address);
    deployedAddresses.push(Applicant.address);

    console.log(`Applicant ${i + 1} deployed with the address:`, Applicant.address);
  }

  console.log("All Applicants deployed. Addresses:", deployedAddresses);
};
