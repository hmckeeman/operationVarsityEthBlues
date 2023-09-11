const Admissions = artifacts.require("Admissions"); // Adjust the contract name if necessary
const accounts = await web3.eth.getAccounts();

const maxStudents = 1000; // Replace with your desired initial value
const admissionsInstance = await Admissions.new(maxStudents, { from: accounts[0] });

const unassignedApplicantsCount = await admissionsInstance.getUnassignedApplicantsCount();
console.log("Unassigned Applicants Count:", unassignedApplicantsCount.toNumber());
