const Admissions = artifacts.require("Admissions");
const fs = require('fs');

module.exports = async function(callback) {
    try {
        // Fetch the accounts from the Ethereum node (even though it's not being used in the current context)
        const accounts = await web3.eth.getAccounts();

        console.log("==============================================");
        console.log("FETCHING DENIED APPLICANTS FROM ADMISSIONS CONTRACT");
        console.log("==============================================\n");

        // Fetch the deployed Admissions contract instance
        console.log("[1/3] Fetching Admissions contract instance...");
        const admissionsInstance = await Admissions.deployed();
        console.log(`[SUCCESS] Admissions Contract Address: ${admissionsInstance.address}\n`);

        // Fetch denied applicants
        console.log("[2/3] Fetching denied applicants...");
        const result = await admissionsInstance.getDeniedApplicants();
        const deniedApplicantCount = result['0'].toNumber(); // Converting BN to a regular number
        const deniedApplicantAddresses = result['1'];
        console.log(`[SUCCESS] Total Denied Applicants: ${deniedApplicantCount}`);
        console.log("Denied Applicant Addresses:", deniedApplicantAddresses.join(", "), "\n");

        // Save the denied applicant addresses to a JSON file
        console.log("[3/3] Saving denied applicant addresses to JSON file...");
        fs.writeFileSync('deniedApplicantAddresses.json', JSON.stringify(deniedApplicantAddresses));
        console.log("[SUCCESS] Data saved to deniedApplicantAddresses.json.\n");

        console.log("==============================================");
        console.log("SCRIPT EXECUTION COMPLETE");
        console.log("==============================================");

        callback();  // Exit the script successfully

    } catch (error) {
        console.error("[ERROR] Fetching denied applicants:", error);
        callback(error);  // Exit the script with an error state
    }
};
