const fs = require('fs');

module.exports = async function(callback) {
  try {
    // Use Truffle's native "artifacts" object to get the deployed contract instances
    const Officer = artifacts.require("Officer");

    // Get a list of all available accounts
    const accounts = await web3.eth.getAccounts();

    // Read the deployed Officer addresses from the JSON file
    const deployedOfficerAddresses = JSON.parse(fs.readFileSync('deployedOfficerAddresses.json', 'utf8'));

    // Use the first Officer address as an example
    const officerAddress = deployedOfficerAddresses[0];

    // Use Truffle's "at" function to get an instance of the deployed contract at the specific address
    const officerInstance = await Officer.at(officerAddress);

    const applicantAddress = "0xYourApplicantContractAddressHere"; // Replace this with the actual address

    // Invoke the "acceptApplicant" method of the deployed Officer contract
    const txReceipt = await officerInstance.acceptApplicant(applicantAddress, { from: accounts[0] });
    console.log("Transaction receipt: ", txReceipt);
    
    callback(); // Exit the script successfully
  } catch (error) {
    console.error("Error in approving applicant: ", error);
    callback(error); // Exit the script with an error state
  }
};
