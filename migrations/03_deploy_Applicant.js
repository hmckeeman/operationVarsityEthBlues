const Admissions = artifacts.require("Admissions");
const Applicant = artifacts.require("Applicant");

module.exports = async function(deployer, network, accounts) {
  // Fetch the deployed Admissions contract
  const admissions = await Admissions.deployed();

  // The address of the Admissions contract is passed as a constructor parameter
  // to the Applicant contract
  await deployer.deploy(Applicant, admissions.address);

  console.log("Applicant deployed with the address:", Applicant.address);
};
