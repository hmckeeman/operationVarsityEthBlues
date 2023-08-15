const Admissions = artifacts.require("Admissions"); // Adjust the contract name if necessary

module.exports = async function(deployer, network, accounts) {
  const deployerAddress = accounts[0];
  console.log("Deploying from:", deployerAddress);
  console.log("Deploying with maxStudents:", 1000);
  try {
    await deployer.deploy(Admissions, 1000, { from: deployerAddress });
    console.log("Deployment successful");
  } catch (error) {
    console.log("Deployment failed:", error);
  }
};




//truffle compile
//truffle develop
//truffle migrate --reset



