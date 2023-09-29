const AdmissionsContract = artifacts.require("Admissions");
const fs = require('fs');
const path = require('path');

function normalizeAddress(address) {
  return address.toLowerCase();
}

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
    
    const applicantAddresses = JSON.parse(fs.readFileSync(applicantFilePath)).map(normalizeAddress);
    const officerAddresses = JSON.parse(fs.readFileSync(officerFilePath)).map(normalizeAddress);

    console.log("Loaded applicant addresses:");
    console.log(applicantAddresses);
    
    console.log("Loaded officer addresses:");
    console.log(officerAddresses);

    // Log roles for each applicant
    for (let address of applicantAddresses) {
      const isOfficer = officerAddresses.includes(address);
      const assignedOfficer = await admissionsInstance.getAdmissionsOfficerForApplicant(address);

      if (isOfficer) {
        console.log(`Address ${address} is both an applicant and an officer`);
      } else if (assignedOfficer !== '0x0000000000000000000000000000000000000000') {
        console.log(`Address ${address} is an applicant and has been assigned to an officer: ${assignedOfficer}`);
      } else {
        console.log(`Address ${address} is an applicant and has not been assigned to an officer`);
      }
    }

    console.log("Script execution completed.");

  } catch (error) {
    console.error("Error encountered:", error);
  }
  callback();
};
