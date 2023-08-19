const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Admissions contract
        const admissions = await Admissions.deployed();
        
        // Fetch the deployed Officer contract
        const officer = await Officer.deployed();

        // Approve the Officer contract address in the Admissions contract
        await admissions.approveAdmissionOfficer(officer.address);

        console.log(`Officer contract at address ${officer.address} has been approved in the Admissions contract.`);
        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
};
