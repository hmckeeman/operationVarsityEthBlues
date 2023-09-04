const fs = require('fs');

module.exports = async function(callback) {
    try {
        console.log("Starting to approve applicants.");

        // Use Truffle's native "artifacts" object to get the deployed contract instances
        const Officer = artifacts.require("Officer");

        // Get a list of all available accounts
        const accounts = await web3.eth.getAccounts();
        console.log("Accounts: ", accounts);

        // Read the deployed Officer addresses from the JSON file
        const deployedOfficerAddresses = JSON.parse(fs.readFileSync('deployedOfficerAddresses.json', 'utf8'));
        console.log("Deployed Officer Addresses: ", deployedOfficerAddresses);

        // Read the deployed Applicant addresses from the JSON file
        const deployedApplicantAddresses = JSON.parse(fs.readFileSync('deployedApplicantAddresses.json', 'utf8'));
        console.log("Deployed Applicant Addresses: ", deployedApplicantAddresses);

        // Using the specified Officer address
        const officerAddress = "0x875625D126619c6842B6e10f3EaDdCa357110759";  // You can read this dynamically too, if needed
        console.log("Using Officer at address: ", officerAddress);

        // Search for the deployerAccount in the available accounts
        const deployerAccount = "0x93a2109C4C2AeE626722CCEC9138929d94774407";  // You can read this dynamically too, if needed
        const accountToUse = accounts.find(account => account.toLowerCase() === deployerAccount.toLowerCase());

        if (!accountToUse) {
            throw new Error(`Deployer account ${deployerAccount} not found among available accounts`);
        }
        console.log(`Using deployer account: ${accountToUse}`);

        // Use Truffle's "at" function to get an instance of the deployed contract at the specific address
        const officerInstance = await Officer.at(officerAddress);
        console.log("Officer instance: ", officerInstance);

        // Loop through each deployed Applicant address to approve them
        for (const applicantAddress of deployedApplicantAddresses) {
            console.log(`Approving applicant at address ${applicantAddress}...`);
            const txReceipt = await officerInstance.acceptApplicant(applicantAddress, { from: accountToUse });
            console.log(`Transaction receipt for Applicant ${applicantAddress}: `, txReceipt);
        }

        console.log("Finished approving applicants.");
        callback();  // Exit the script successfully
    } catch (error) {
        console.error("Error in approving applicant: ", error);
        callback(error);  // Exit the script with an error state
    }
};
