const Applicant = artifacts.require("Applicant");
const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Admissions contract instance
        const admissionsInstance = await Admissions.deployed();
        
        // Fetch all assigned applicants
        const assignedApplicantsData = await admissionsInstance.getAssignedApplicants();
        const assignedApplicants = assignedApplicantsData[1];
        
        if (assignedApplicants.length === 0) {
            console.log("No applicants have been assigned yet.");
            callback();
            return;
        }
        
        console.log("Approving officers for all assigned applicants...");

        for (let i = 0; i < assignedApplicants.length; i++) {
            const applicantAddress = assignedApplicants[i];
            
            const officerAddress = await admissionsInstance.getAdmissionsOfficerForApplicant(applicantAddress);
            
            if (officerAddress != '0x0000000000000000000000000000000000000000') {
                // Fetch the specific Applicant contract instance
                const applicantInstance = await Applicant.at(applicantAddress);

                // Grant approval to the assigned officer
                await applicantInstance.grantOfficerApproval(officerAddress);
                
                console.log(`Officer ${officerAddress} approved for Applicant ${applicantAddress}`);
            } else {
                console.log(`Applicant ${applicantAddress} has not been assigned to any officer.`);
            }
        }

        console.log("\n-----------------------------");
        console.log("Approval process completed for all assigned applicants!");
        console.log("-----------------------------\n");

        callback();
    } catch (error) {
        console.error("Error in the approval process:", error);
        callback(error);
    }
};
