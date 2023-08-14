const Admissions = artifacts.require("Admissions"); // Adjust the contract name if necessary

module.exports = function(deployer, network, accounts) {
  const deployerAddress = accounts[0]; // Assuming deployer is the first account
  deployer.deploy(Admissions, 1000, { from: deployerAddress });
};



//truffle compile
//truffle migrate --reset



