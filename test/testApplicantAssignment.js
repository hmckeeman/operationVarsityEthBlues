const Admissions = artifacts.require("Admissions");
const fs = require('fs');
const path = require('path');

contract("Admissions Contract Test", (accounts) => {
    let admissionsInstance;

    before(async () => {
        admissionsInstance = await Admissions.deployed();
    });

    it("should have assigned all applicants from the JSON to an officer", async () => {
        // 1. Load the applicant addresses from deployedApplicantAddresses.json
        const filePath = path.join(__dirname, '..', 'deployedApplicantAddresses.json');
        const rawData = fs.readFileSync(filePath);
        const deployedApplicants = JSON.parse(rawData);

        // 2. For each applicant address, call getAdmissionsOfficerForApplicant
        for(let i = 0; i < deployedApplicants.length; i++) {
            let officerAddress = await admissionsInstance.getAdmissionsOfficerForApplicant(deployedApplicants[i]);
            
            // 3. If any applicant address does not have an assigned officer address, assert fail.
            assert.notStrictEqual(officerAddress, '0x0000000000000000000000000000000000000000', `Applicant at address ${deployedApplicants[i]} is not assigned to any officer.`);
        }
    });
});
