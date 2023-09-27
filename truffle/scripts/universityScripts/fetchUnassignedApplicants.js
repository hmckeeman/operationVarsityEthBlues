const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Admissions contract instance
        const admissionsInstance = await Admissions.deployed();
        console.log("Fetching unassigned applicants from Admissions contract...");

        // Call the function to get unassigned applicant addresses and their count
        const result = await admissionsInstance.getUnassignedApplicants();
        const count = result['0'].toNumber();
        const unassignedApplicants = result['1'];

        if (count > 0) {
            console.log("Number of unassigned applicants:", count);
            console.log("Addresses of unassigned applicants:");
            unassignedApplicants.forEach((applicant, index) => {
                console.log(`${index + 1}. ${applicant}`);
            });
        } else {
            console.log("All applicants have been assigned.");
        }

    } catch (error) {
        console.error("Error fetching unassigned applicants:", error);
    }

    callback();  // Ensure the script exits
};
