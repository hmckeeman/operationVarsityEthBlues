// Import the necessary Foundry modules
const { deploy, getContractAddress, getSigners } = require('foundry-deploy');

// Import the Admissions contract
const Admissions = require('../path-to-your-contract/Admissions.sol');

// Define the deployment function
async function main() {
  const [deployer] = await getSigners();
  
  // Deploy the Admissions contract
  const admissions = await deploy('Admissions', {
    from: deployer,
    args: [100], // Pass the constructor argument if required
  });

  // Get the deployed contract's address
  const admissionsAddress = getContractAddress(admissions);

  console.log(`Admissions contract deployed at address: ${admissionsAddress}`);
}

// Run the deployment function
main().catch((error) => {
  console.error('Error deploying Admissions contract:', error);
  process.exit(1);
});
