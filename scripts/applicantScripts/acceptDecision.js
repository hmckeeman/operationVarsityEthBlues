const fs = require('fs');
const path = require('path');
const Applicant = artifacts.require("Applicant");

module.exports = async function(callback) {
    try {
        // Load the addresses from the JSON file
        const deployedApplicantAddressesPath = path.join(__dirname, '../../deployedApplicantAddresses.json');
        const deployedApplicantAddresses = JSON.parse(fs.readFileSync(deployedApplicantAddressesPath, 'utf8'));

        // Get the last address from the list (or whichever applicant you want to work with)
        const applicantAddress = deployedApplicantAddresses[deployedApplicantAddresses.length - 1];

        console.log("==============================================");
        console.log("ACCEPTING OFFER FOR APPLICANT:", applicantAddress);
        console.log("==============================================");

        // Fetch the Applicant contract instance
        console.log("[1/3] Fetching Applicant contract instance...");
        const applicantInstance = await Applicant.at(applicantAddress);

        // Check if decision has been made and is 'accepted'
        console.log("[2/3] Verifying admission decision...");
        const hasDecisionBeenMade = await applicantInstance.decisionReceived.call();
        const decision = await applicantInstance.admissionDecision.call();

        if (!hasDecisionBeenMade || decision !== "accepted") {
            console.log("Applicant has either not received a decision or has not been accepted. Cannot accept offer.");
            callback();
            return;
        }

        // Accept the offer
        console.log("[3/3] Accepting the offer...");
        await applicantInstance.acceptOffer();

        console.log("Offer has been successfully accepted!");

        callback();
    } catch (error) {
        console.error(error);
        callback(error);  // If there's an error, send it to truffle.
    }
};
