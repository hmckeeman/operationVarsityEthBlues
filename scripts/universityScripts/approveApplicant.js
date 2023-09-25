const fs = require('fs');

module.exports = async function(callback) {
    try {
        const Officer = artifacts.require("Officer");
        const accounts = await web3.eth.getAccounts();

        // Read only the necessary addresses from JSON files
        const deployedOfficerAddresses = JSON.parse(fs.readFileSync('deployedOfficerAddresses.json', 'utf8'));
        const deployedApplicantAddresses = JSON.parse(fs.readFileSync('deployedApplicantAddresses.json', 'utf8'));

        const officerAddress = "0x0f21e609c9F147871568A8636Fd1Be13E36b20fe";
        const specificApplicantAddress = deployedApplicantAddresses[deployedApplicantAddresses.length - 1];
        const deployerAccount = "0x93a2109C4C2AeE626722CCEC9138929d94774407";

        const accountToUse = accounts.find(account => account.toLowerCase() === deployerAccount.toLowerCase());

        if (!accountToUse) {
            throw new Error(`Deployer account ${deployerAccount} not found among available accounts`);
        }

        const officerInstance = await Officer.at(officerAddress);

        console.log("========= Approve Applicant Script =========");
        console.log(`Officer Address: ${officerAddress}`);
        console.log(`Applicant Address: ${specificApplicantAddress}`);
        console.log(`Deployer Account: ${accountToUse}`);
        console.log("===========================================");

        console.log(`\nApproving applicant at address ${specificApplicantAddress}...`);

        const txReceipt = await officerInstance.acceptApplicant(specificApplicantAddress, { from: accountToUse });

        console.log("\n========== Transaction Details ============");
        console.log(`Transaction Hash: ${txReceipt.tx}`);
        console.log(`Block Number: ${txReceipt.receipt.blockNumber}`);
        console.log(`Gas Used: ${txReceipt.receipt.gasUsed}`);
        console.log(`Status: ${txReceipt.receipt.status ? 'Successful' : 'Failed'}`);
        console.log("==========================================");

        console.log("\nFinished approving applicant.");
        callback();
    } catch (error) {
        console.error("Error in approving applicant: ", error);
        callback(error);
    }
};
