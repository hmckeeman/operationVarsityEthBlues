const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Admissions contract
        const admissions = await Admissions.deployed();
        
        // Fetch the deployed Officer contract
        const officer = await Officer.deployed();

        // Approve the Officer contract address in the Admissions contract
        await admissions.approveOfficer(officer.address);

        console.log(`Officer contract at address ${officer.address} has been approved in the Admissions contract.`);
        callback(0);
    } catch (error) {
        console.error("An error occurred:", error);
        callback(1);
    }
    
};


// truffle exec scripts/approveOfficer.js