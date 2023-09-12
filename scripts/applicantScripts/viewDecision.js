const fs = require('fs');
const path = require('path');
const Applicant = artifacts.require("Applicant"); // Importing your Applicant contract

module.exports = async function(callback) {
  try {
    // Load the addresses from the JSON file
    const deployedApplicantAddressesPath = path.join(__dirname, '../../deployedApplicantAddresses.json');
    const deployedApplicantAddresses = JSON.parse(fs.readFileSync(deployedApplicantAddressesPath, 'utf8'));

    // Get the last address from the list
    const applicantAddress = deployedApplicantAddresses[deployedApplicantAddresses.length - 1];

    console.log("==============================================");
    console.log("VIEWING ADMISSION DECISION FOR APPLICANT:", applicantAddress);
    console.log("==============================================");

    // Fetch the Applicant contract instance
    console.log("[1/2] Fetching Applicant contract instance...");
    const applicantInstance = await Applicant.at(applicantAddress);

    // Fetch the admission decision for the applicant
    console.log("[2/2] Fetching admission decision...");
    const decision = await applicantInstance.admissionDecision.call();

    console.log("Admission Decision for Applicant:", decision);

    callback(); // This will indicate that the script has completed its execution.
  } catch (error) {
    console.error(error);
    callback(error); // If there's an error, send it to truffle.
  }
};
