const Admissions = artifacts.require("Admissions");
const fs = require('fs');

module.exports = async function(callback) {
    try {
        // Fetch the accounts from the Ethereum node (even though it's not being used in the current context)
        const accounts = await web3.eth.getAccounts();

        console.log("==============================================");
        console.log("FETCHING ACCEPTED APPLICANTS FROM ADMISSIONS CONTRACT");
        console.log("==============================================\n");

        // Fetch the deployed Admissions contract instance
        console.log("[1/3] Fetching Admissions contract instance...");
        const admissionsInstance = await Admissions.deployed();
        console.log(`[SUCCESS] Admissions Contract Address: ${admissionsInstance.address}\n`);

        // Fetch accepted applicants
        console.log("[2/3] Fetching accepted applicants...");
        const result = await admissionsInstance.getAcceptedApplicants();
        const acceptedApplicantCount = result['0'].toNumber(); // Converting BN to a regular number
        const acceptedApplicantAddresses = result['1'];
        console.log(`[SUCCESS] Total Accepted Applicants: ${acceptedApplicantCount}`);
        console.log("Accepted Applicant Addresses:", acceptedApplicantAddresses.join(", "), "\n");

        // If you still wish to save to a file, you can do it here.
        console.log("[3/3] Saving accepted applicant addresses to JSON file...");
        fs.writeFileSync('acceptedApplicantAddresses.json', JSON.stringify(acceptedApplicantAddresses));
        console.log("[SUCCESS] Data saved to acceptedApplicantAddresses.json.\n");

        console.log("==============================================");
        console.log("SCRIPT EXECUTION COMPLETE");
        console.log("==============================================");

        callback();  // Exit the script successfully

    } catch (error) {
        console.error("[ERROR] Fetching accepted applicants:", error);
        callback(error);  // Exit the script with an error state
    }
};
