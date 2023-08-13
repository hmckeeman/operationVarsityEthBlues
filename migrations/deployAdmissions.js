const Admissions = artifacts.require("Admissions"); // Adjust the contract name if necessary

module.exports = function (deployer) {
  deployer.deploy(Admissions, 1000); // Use the desired initial value for maxStudents
};
