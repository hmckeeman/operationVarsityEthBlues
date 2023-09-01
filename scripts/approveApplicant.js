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

        // Use the first Officer address as an example
        const officerAddress = deployedOfficerAddresses[0];
        console.log("Using Officer at address: ", officerAddress);

        // Use Truffle's "at" function to get an instance of the deployed contract at the specific address
        const officerInstance = await Officer.at(officerAddress);
        console.log("Officer instance: ", officerInstance);

        for (const applicantAddress of deployedApplicantAddresses) {
            // Invoke the "acceptApplicant" method of the deployed Officer contract
            console.log(`Approving applicant at address ${applicantAddress}...`);
            const txReceipt = await officerInstance.acceptApplicant(applicantAddress, { from: accounts[0] });
            console.log(`Transaction receipt for Applicant ${applicantAddress}: `, txReceipt);
        }

        console.log("Finished approving applicants.");
        callback(); // Exit the script successfully
    } catch (error) {
        console.error("Error in approving applicant: ", error);
        callback(error); // Exit the script with an error state
    }
};
