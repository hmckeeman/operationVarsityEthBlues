const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        const admissions = await Admissions.deployed();

        // Check the number of unassigned applicants before the assignment
        let {0: unassignedBefore} = await admissions.getUnassignedApplicants();
        console.log(`Number of unassigned applicants before assignment: ${unassignedBefore}`);

        // Assign admissions officers to the unassigned applicants
        await admissions.assignAdmissionsOfficer();

        // Check the number of unassigned applicants after the assignment
        let {0: unassignedAfter} = await admissions.getUnassignedApplicants();
        console.log(`Number of unassigned applicants after assignment: ${unassignedAfter}`);

        // Log difference
        console.log(`Number of applicants assigned: ${unassignedBefore - unassignedAfter}`);

        // Get list of approved officers
        const {1: officers} = await admissions.getAdmissionsOfficers();

        // For each officer, fetch and display their assigned applicants
        for (const officer of officers) {
            const {0: officerApplicants, 1: count} = await admissions.getApplicantsForOfficer(officer);
            console.log(`Officer ${officer} has ${count} assigned applicants:`);
            officerApplicants.forEach(applicant => {
                console.log(`- ${applicant}`);
            });
            console.log("----------");  // Separate the lists for readability
        }

        callback();
    } catch (error) {
        console.error("Error assigning officers or fetching data:", error);
        callback(error);
    }
};
