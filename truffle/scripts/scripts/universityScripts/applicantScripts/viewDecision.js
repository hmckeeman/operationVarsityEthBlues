const fs = require('fs');
const path = require('path');
const Applicant = artifacts.require("Applicant"); // Importing your Applicant contract

module.exports = async function(callback) {
  try {
    // Load the addresses from the JSON file
    const deployedApplicantAddressesPath = path.join(__dirname, '../../deployedApplicantAddresses.json');
    const deployedApplicantAddresses = JSON.parse(fs.readFileSync(deployedApplicantAddressesPath, 'utf8'));

    // Get the last address from the list
    const applicantAddress = "0x154165aCabfC425376EeD39cF3858b340d73313e"; //deployedApplicantAddresses[deployedApplicantAddresses.length - 1];

    console.log("==============================================");
    console.log("VIEWING ADMISSION DECISION FOR APPLICANT:", applicantAddress);
    console.log("==============================================");

    // Fetch the Applicant contract instance
    console.log("[1/3] Fetching Applicant contract instance...");
    const applicantInstance = await Applicant.at(applicantAddress);

    // Check if decision has been made
    console.log("[2/3] Checking decision status...");
    const hasDecisionBeenMade = await applicantInstance.decisionReceived.call();

    if(!hasDecisionBeenMade) {
      console.log("Admission Decision for Applicant: Decision not yet made");
    } else {
      // Fetch the admission decision for the applicant
      console.log("[3/3] Fetching admission decision...");
      const decision = await applicantInstance.admissionDecision.call();
      console.log("Admission Decision for Applicant:", decision);
    }

    callback(); // This will indicate that the script has completed its execution.
  } catch (error) {
    console.error(error);
    callback(error); // If there's an error, send it to truffle.
  }
};
