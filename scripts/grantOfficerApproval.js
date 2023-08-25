const Applicant = artifacts.require("Applicant");
const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Applicant and Admissions contract instances
        const applicantInstance = await Applicant.deployed();
        const admissionsInstance = await Admissions.deployed();

        console.log("Fetching the assigned officer's address...");

        // Fetching the assigned officer's address for the Applicant
        const officerAddress = await admissionsInstance.getAdmissionsOfficerForApplicant(applicantInstance.address);
        
        if (officerAddress == '0x0000000000000000000000000000000000000000') {
            console.error("No officer has been assigned to this applicant yet.");
            callback();
            return;
        }

        console.log("Granting officer approval...");

        // Calling the function to grant the officer approval
        await applicantInstance.grantOfficerApproval(officerAddress);

        console.log("\n-----------------------------");
        console.log("Applicant Contract Address:", applicantInstance.address);
        console.log("Officer Address:", officerAddress);
        console.log("Approval granted!");
        console.log("-----------------------------\n");

        callback();
    } catch (error) {
        console.error("Error granting officer approval:", error);
        callback(error);
    }
};
