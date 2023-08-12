require('dotenv').config(); // Load environment variables from .env file

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('../build/contracts/Admissions.json'); // Make sure the path is correct

const provider = new HDWalletProvider({
  mnemonic: process.env.MNEMONIC,
  providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account:', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to:', result.options.address);
};

deploy();
