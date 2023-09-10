const fs = require('fs');

module.exports = async function(callback) {
    try {
        const Officer = artifacts.require("Officer");
        const accounts = await web3.eth.getAccounts();

        // Read only the necessary addresses from JSON files
        const deployedOfficerAddresses = JSON.parse(fs.readFileSync('deployedOfficerAddresses.json', 'utf8'));
        const deployedApplicantAddresses = JSON.parse(fs.readFileSync('deployedApplicantAddresses.json', 'utf8'));

        const officerAddress = "0xb876571A61a78A8F864EEA0a95d5C48f918C01C0";  
        const specificApplicantAddress = deployedApplicantAddresses[deployedApplicantAddresses.length - 1];
        const deployerAccount = "0xa88575615763225b1246660B6E51D786a6C6E421";

        const accountToUse = accounts.find(account => account.toLowerCase() === deployerAccount.toLowerCase());

        if (!accountToUse) {
            throw new Error(`Deployer account ${deployerAccount} not found among available accounts`);
        }

        const officerInstance = await Officer.at(officerAddress);

        console.log("========= Deny Applicant Script =========");
        console.log(`Officer Address: ${officerAddress}`);
        console.log(`Applicant Address: ${specificApplicantAddress}`);
        console.log(`Deployer Account: ${accountToUse}`);
        console.log("========================================");

        console.log(`\nDenying applicant at address ${specificApplicantAddress}...`);

        const txReceipt = await officerInstance.denyApplicant(specificApplicantAddress, { from: accountToUse });

        console.log("\n========== Transaction Details ============");
        console.log(`Transaction Hash: ${txReceipt.tx}`);
        console.log(`Block Number: ${txReceipt.receipt.blockNumber}`);
        console.log(`Gas Used: ${txReceipt.receipt.gasUsed}`);
        console.log(`Status: ${txReceipt.receipt.status ? 'Successful' : 'Failed'}`);
        console.log("==========================================");

        console.log("\nFinished denying applicant.");
        callback();
    } catch (error) {
        console.error("Error in denying applicant: ", error);
        callback(error);
    }
};
