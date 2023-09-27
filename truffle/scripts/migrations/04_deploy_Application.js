const Admissions = artifacts.require("Admissions");
const Applicant = artifacts.require("Applicant");
const Application = artifacts.require("Application");

module.exports = async function(deployer, network, accounts) {
  // Fetch the deployed Admissions contract
  const admissions = await Admissions.deployed();

  // Fetch the deployed Applicant contract
  const applicant = await Applicant.deployed();

  // The addresses of the Applicant and Admissions contracts are passed as constructor parameters
  // to the Application contract
  await deployer.deploy(Application, applicant.address, admissions.address);

  console.log("Application deployed with the address:", Application.address);
};
