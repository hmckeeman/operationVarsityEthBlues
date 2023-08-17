const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(deployer, network, accounts) {
  const deployerAddress = accounts[0];
  
  // Deploy the Admissions contract first
  console.log("Deploying Admissions contract from:", deployerAddress);
  console.log("Deploying with maxStudents:", 1000);
  
  try {
    await deployer.deploy(Admissions, 1000, { from: deployerAddress });
    console.log("Admissions Deployment successful");
  } catch (error) {
    console.log("Admissions Deployment failed:", error);
    return; // Exit the script if the deployment failed
  }
  
  // Get the deployed Admissions contract
  const admissionsInstance = await Admissions.deployed();
  
  // Deploy the Officer contract next, passing in the Admissions contract's address
  console.log("Deploying Officer contract with Admissions contract address:", admissionsInstance.address);
  
  try {
    await deployer.deploy(Officer, admissionsInstance.address, { from: deployerAddress });
    console.log("Officer Deployment successful");
  } catch (error) {
    console.log("Officer Deployment failed:", error);
  }
};
