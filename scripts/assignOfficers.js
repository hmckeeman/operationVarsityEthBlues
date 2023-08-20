const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Admissions contract instance
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

        callback();
    } catch (error) {
        console.error(error);
        callback(error);
    }
};



//truffle exec scripts/assignOfficers.js
