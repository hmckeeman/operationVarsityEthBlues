const AdmissionsContract = artifacts.require("Admissions");

module.exports = async (callback) => {
  try {
    console.log("Starting the script...");

    // Load contract instance
    console.log("Loading Admissions contract instance...");
    const admissionsInstance = await AdmissionsContract.deployed();
    console.log("Contract instance loaded successfully.");

    // Use your logic to fetch officer assignments, etc.
    console.log("Fetching assigned applicants...");
    const result = await admissionsInstance.getAssignedApplicants(); // Replace with your actual function
    
    const numberOfApplicants = result[0].toNumber();
    const assignedOfficers = result[1];

    console.log(`Total number of applicants: ${numberOfApplicants}`);
    console.log("Assigned applicants:", assignedOfficers);

    if (numberOfApplicants === assignedOfficers.length) {
      console.log("All applicants have been successfully assigned an officer.");
    } else {
      console.error(`Mismatch: Expected ${numberOfApplicants} assignments but got ${assignedOfficers.length}.`);
    }

    console.log("Script execution completed.");

  } catch (error) {
    console.error("Error encountered:", error);
  }
  callback();
};
