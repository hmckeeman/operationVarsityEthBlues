const fs = require('fs');
const Officer = artifacts.require("Officer");

module.exports = async function(callback) {
  try {
    // Load the deployed Officer contract instance
    const officerAddresses = JSON.parse(fs.readFileSync('deployedOfficerAddresses.json', 'utf8'));
    const officerAddress = officerAddresses[0]; // Assuming you have only one Officer contract deployed
    const officerInstance = await Officer.at(officerAddress);

    // Get the assigned applicants
    const assignedApplicantsObject = await officerInstance.getAssignedApplicants();
    const assignedApplicants = assignedApplicantsObject[0];

    console.log(`Assigned applicants to Officer at ${officerAddress}:`);
    for (let applicant of assignedApplicants) {
      console.log(applicant);
    }

    // Pass in the deployer's address as the sender
    const deployerAddress = '0x5B2a641c999deA0Ad8138a86c34521049356A5cA';

    // Attempt to approve an unauthorized applicant (address 0x000000000000000)
    try {
      await officerInstance.acceptApplicant("0x0000000000000000000000000000000000000000", { from: deployerAddress });
      console.log("Test failed: Officer was able to approve an unauthorized applicant.");
    } catch (error) {
      console.log("Error message:", error.message); // Log the full error message
      // Check if the error message includes the word "revert"
      if (error.message.includes("revert")) {
        console.log("Test passed: Officer cannot approve an unauthorized applicant.");
      } else {
        console.error("Test error:", error);
      }
    }

    callback();
  } catch (error) {
    console.error("Script error:", error);
    callback(error);
  }
};
