const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('../build/contracts/Admissions.json');

require('dotenv').config();

const mnemonic = process.env.MNEMONIC;
const ganacheUrl = 'http://localhost:8545'; // Change to the correct Ganache URL

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonic
  },
  providerOrUrl: ganacheUrl
});

const web3 = new Web3(provider);

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('Deploying from account:', accounts[0]);

    const contract = new web3.eth.Contract(abi);

    const result = await contract
      .deploy({
        data: evm.bytecode.object,
        arguments: [1000] // Replace with constructor arguments if needed
      })
      .send({
        gas: '5000000',
        from: accounts[0]
      });

    console.log('Contract deployed to:', result.options.address);
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
})();
