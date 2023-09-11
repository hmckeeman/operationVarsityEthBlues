const Admissions = artifacts.require("Admissions");
const fs = require('fs');

module.exports = async function(callback) {
    try {
        // Fetch the accounts from the Ethereum node (even though it's not being used in the current context)
        const accounts = await web3.eth.getAccounts();

        console.log("==============================================");
        console.log("FETCHING WAITLISTED APPLICANTS FROM ADMISSIONS CONTRACT");
        console.log("==============================================\n");

        // Fetch the deployed Admissions contract instance
        console.log("[1/3] Fetching Admissions contract instance...");
        const admissionsInstance = await Admissions.deployed();
        console.log(`[SUCCESS] Admissions Contract Address: ${admissionsInstance.address}\n`);

        // Fetch waitlisted applicants
        console.log("[2/3] Fetching waitlisted applicants...");
        const result = await admissionsInstance.getWaitlistedApplicants();
        const waitlistedApplicantCount = result['0'].toNumber(); // Converting BN to a regular number
        const waitlistedApplicantAddresses = result['1'];
        console.log(`[SUCCESS] Total Waitlisted Applicants: ${waitlistedApplicantCount}`);
        console.log("Waitlisted Applicant Addresses:", waitlistedApplicantAddresses.join(", "), "\n");

        // Save the waitlisted applicant addresses to a JSON file
        console.log("[3/3] Saving waitlisted applicant addresses to JSON file...");
        fs.writeFileSync('waitlistedApplicantAddresses.json', JSON.stringify(waitlistedApplicantAddresses));
        console.log("[SUCCESS] Data saved to waitlistedApplicantAddresses.json.\n");

        console.log("==============================================");
        console.log("SCRIPT EXECUTION COMPLETE");
        console.log("==============================================");

        callback();  // Exit the script successfully

    } catch (error) {
        console.error("[ERROR] Fetching waitlisted applicants:", error);
        callback(error);  // Exit the script with an error state
    }
};
