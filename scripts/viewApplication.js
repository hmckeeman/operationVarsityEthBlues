const Officer = artifacts.require("Officer");
const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Instantiate the Officer contract
        const officerInstance = await Officer.deployed();
        console.log("\nOfficer Contract Address:", officerInstance.address);

        // Instantiate the Admissions contract
        const admissionsInstance = await Admissions.deployed();
        console.log("\nAdmissions Contract Address:", admissionsInstance.address);

        // Fetch the assigned applicants from the Admissions contract
        const result = await admissionsInstance.getApplicantsForOfficer(officerInstance.address);
        const assignedFromAdmissions = result['0'];
        console.log("\nAssigned applicants from Admissions:", assignedFromAdmissions);

        if (!assignedFromAdmissions || assignedFromAdmissions.length === 0) {
            console.log("\nNo applicants assigned from Admissions contract.");
            return; // If there are no assigned applicants, we can exit early.
        }

        // Display the data for each assigned applicant
        console.log("\nFetching data for assigned applicants...");
        for (let applicantAddress of assignedFromAdmissions) {
            const [name, university, ipfsLink, decisionMade, decision] = await officerInstance.viewApplicant(applicantAddress);
            console.log(`\nApplicant Address: ${applicantAddress}`);
            console.log(`Name: ${name}`);
            console.log(`University: ${university}`);
            console.log(`IPFS Link: ${ipfsLink}`);
            if (decisionMade) {
                console.log(`Decision: ${decision}`);
            } else {
                console.log("Decision not made yet.");
            }
        }

    } catch (error) {
        console.error("\nError encountered:", error);
    }

    callback();
};
