const AdmissionsContract = artifacts.require("Admissions");
const fs = require('fs');

module.exports = async (callback) => {
  try {
    console.log("Starting the script...");

    // Load contract instance
    console.log("Loading Admissions contract instance...");
    const admissionsInstance = await AdmissionsContract.deployed();
    console.log("Contract instance loaded successfully.");

    // Load deployed addresses from JSON files
    const applicantFilePath = 'deployedApplicantAddresses.json'; // Modify the path if needed
    const officerFilePath = 'deployedOfficerAddresses.json'; // Modify the path if needed
    
    if (!fs.existsSync(applicantFilePath) || !fs.existsSync(officerFilePath)) {
      console.error("JSON files not found in the main project directory.");
      return callback();
    }

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
