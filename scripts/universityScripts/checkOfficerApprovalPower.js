const Officer = artifacts.require("Officer");
const Applicant = artifacts.require("Applicant");
const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
  try {
    // Get the deployed instances of Officer, Applicant, and Admissions contracts
    const officerInstance = await Officer.deployed();
    const admissionsInstance = await Admissions.deployed();

    // Deploy a new Applicant contract that is not assigned to any officer
    const unauthorizedApplicantInstance = await Applicant.new(admissionsInstance.address);

    // Attempt to approve an unauthorized applicant
    try {
      await officerInstance.acceptApplicant(unauthorizedApplicantInstance.address);
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
