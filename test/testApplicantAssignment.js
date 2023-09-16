const Admissions = artifacts.require("Admissions");
const applicantAddresses = require('../deployedApplicantAddresses.json');  // Update the path if needed
const officerAddresses = require('../deployedOfficerAddresses.json'); // Load the officer addresses

contract('Admissions Contract Test', (accounts) => {
    let admissionsContract;

    before(async () => {
        admissionsContract = await Admissions.deployed();
    });

    it('should have assigned all applicants from the JSON to an officer', async () => {
        for (const applicant of applicantAddresses) {
            const assignedOfficer = await admissionsContract.getAssignedOfficer(applicant); // Using getAssignedOfficer instead of getAdmissionsOfficerForApplicant
            
            // Check if there's an officer assigned
            assert.notEqual(assignedOfficer, '0x0000000000000000000000000000000000000000', `No officer assigned for applicant: ${applicant}`);
            
            // Check if the assigned officer is in the list of deployed officers
            assert(officerAddresses.includes(assignedOfficer), `Applicant at ${applicant} was assigned to an unknown officer: ${assignedOfficer}`);
        }
    });
});
