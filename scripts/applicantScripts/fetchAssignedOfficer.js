const fs = require('fs');
const path = require('path');
const Applicant = artifacts.require("Applicant"); // assuming you have an Applicant contract

module.exports = async function(callback) {
  try {
    // Load the addresses from the JSON file
    const deployedApplicantAddressesPath = path.join(__dirname, '../../deployedApplicantAddresses.json');
    const deployedApplicantAddresses = JSON.parse(fs.readFileSync(deployedApplicantAddressesPath, 'utf8'));

    // Get the last address from the list
    const applicantAddress = deployedApplicantAddresses[deployedApplicantAddresses.length - 1];

    console.log("==============================================");
    console.log("FETCHING ASSIGNED OFFICER FOR APPLICANT:", applicantAddress);
    console.log("==============================================");

    // Fetch the Applicant contract instance
    console.log("[1/3] Fetching Applicant contract instance...");
    const applicantInstance = await Applicant.at(applicantAddress);


    const officer = await applicantInstance.getAssignedOfficer();
    console.log("Assigned Officer:", officer);

    callback(); // This will indicate that the script has completed its execution.
  } catch (error) {
    console.error(error);
    callback(error); // If there's an error, send it to truffle.
  }
};
