const Web3 = require('web3');
const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(deployer, network, accounts) {
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // Replace with your web3 provider if different
  const deployerAddress = accounts[0];
  
  // Deploy the Admissions contract first
  console.log("Deploying Admissions contract from:", deployerAddress);
  console.log("Deploying with maxStudents:", 1000);
  
  let admissionsInstance;
  try {
    await deployer.deploy(Admissions, 1000, { from: deployerAddress });
    admissionsInstance = await Admissions.deployed();
    console.log("Admissions Deployment successful");
  } catch (error) {
    console.log("Admissions Deployment failed:", error);
    return;
  }
  
  // Define the number of Officer contracts you want to deploy
  const numberOfOfficers = 3;
  
  for (let i = 0; i < numberOfOfficers; i++) {
    try {
      // Deploy each Officer contract instance
      const officerDeployResult = await deployer.deploy(Officer, admissionsInstance.address, { from: deployerAddress });
      const officerInstance = await Officer.deployed();
      
      console.log(`Officer ${i + 1} Deployment successful`);

      // Listen to the OfficerDeployed event
      const officerDeployedEvent = officerInstance.contract.getPastEvents("OfficerDeployed", {
        fromBlock: 0,
        toBlock: "latest"
      }, (error, events) => {
        if (error) console.error('Error in OfficerDeployed event:', error);
        else {
          // Do something with the event data, e.g., log or store it
          console.log('Received OfficerDeployed event:', events);
        }
      });
      
    } catch (error) {
      console.log(`Officer ${i + 1} Deployment failed:`, error);
    }
  }
};
