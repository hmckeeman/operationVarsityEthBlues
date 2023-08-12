const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('../build/contracts/Admissions.json'); // Update the path accordingly

// Configure your provider
const provider = new HDWalletProvider({
  mnemonic: 'your mnemonic here',
  providerOrUrl: 'your provider URL here'
});
// Create a web3 instance
const web3 = new Web3(provider);

// Define deployment function
async function deployAdmissions() {
  const accounts = await web3.eth.getAccounts();

  console.log('Deploying from account:', accounts[0]);

  const contract = new web3.eth.Contract(abi);

  const deployTx = contract.deploy({
    data: evm.bytecode.object,
    arguments: [
      // Provide constructor arguments here if needed
      // e.g., maxStudents, subscriptionId
    ],
  });

  const deployReceipt = await deployTx.send({
    from: accounts[0],
    gas: '5000000', // Adjust gas limit as needed
  });

  console.log('Admissions contract deployed at address:', deployReceipt.options.address);
}

deployAdmissions();
