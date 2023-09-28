// Import the necessary modules
const { deployments } = require("foundry-truffle");

// Define the migration
module.exports = async function () {
  // Deploy the Admissions contract with a constructor argument (e.g., maxStudents)
  await deployments.deploy("Admissions", {
    args: [100], // Specify the constructor argument (e.g., maxStudents)
    log: true,   // Enable logging to see deployment details
  });
};
