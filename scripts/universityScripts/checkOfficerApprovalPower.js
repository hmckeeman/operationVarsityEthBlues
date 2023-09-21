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

    // Attempt to approve an unauthorized applicant (address 0x000000000000000)
    try {
      await officerInstance.approveApplicant("0x0000000000000000000000000000000000000000");
      console.log("Test failed: Officer was able to approve an unauthorized applicant.");
    } catch (error) {
      // Check that the error message confirms unauthorized access
      if (error.message.includes("You can only decide applications of applicants you have been assigned to")) {
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
