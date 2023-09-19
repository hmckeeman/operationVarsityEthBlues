const AdmissionsContract = artifacts.require("Admissions");
const fs = require('fs');
const path = require('path');

module.exports = async (callback) => {
  try {
    console.log("Starting the script...");

    // Load contract instance
    console.log("Loading Admissions contract instance...");
    const admissionsInstance = await AdmissionsContract.deployed();
    console.log("Contract instance loaded successfully.");

    // Load deployed addresses from JSON files
    const applicantFilePath = path.join(__dirname, '..', 'deployedApplicantAddresses.json');
    const officerFilePath = path.join(__dirname, '..', 'deployedOfficerAddresses.json');
    const applicantAddresses = JSON.parse(fs.readFileSync(applicantFilePath));
    const officerAddresses = JSON.parse(fs.readFileSync(officerFilePath));

    // Log roles for each address
    for (let address of applicantAddresses) {
      if (officerAddresses.includes(address)) {
        console.log(`Address ${address} is both an applicant and an officer`);
      } else {
        console.log(`Address ${address} is an applicant`);
      }
    }

    for (let address of officerAddresses) {
      if (!applicantAddresses.includes(address)) {
        console.log(`Address ${address} is an officer`);
      }
    }

    console.log("Script execution completed.");

  } catch (error) {
    console.error("Error encountered:", error);
  }
  callback();
};
