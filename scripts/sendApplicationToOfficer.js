const Application = artifacts.require("Application");
const Officer = artifacts.require("Officer"); // Assuming you have an Officer contract
const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Get accounts
        const accounts = await web3.eth.getAccounts();

        // Get contract instances
        const applicationInstance = await Application.deployed();
        const admissionsInstance = await Admissions.deployed();

        // Get tokenID - For simplicity, let's assume you want to send the application with tokenID = 1
        const tokenId = 1;

        // Get the assigned officer for this application
        const officerAddress = await admissionsInstance.getAdmissionsOfficerForApplicant(applicationInstance.address);
        
        // This assumes that there is an Officer contract at the returned address.
        // If there isn't, this line will throw an error.
        const officerInstance = await Officer.at(officerAddress);

        // Now, let's send the application to the officer
        const tx = await applicationInstance.transferApplicationToOfficerContract(officerInstance.address, tokenId, { from: accounts[0] });
        console.log("Transaction hash:", tx.tx);

        callback();  // Complete the script successfully
    } catch (error) {
        console.error("Error sending application:", error);
        callback(error);  // Finish the script with an error
    }
};
