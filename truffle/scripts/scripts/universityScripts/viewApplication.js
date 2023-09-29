const AdmissionsContract = artifacts.require("Admissions");
const OfficerContract = artifacts.require("Officer");

module.exports = async function(callback) {
    try {
        // 1. Fetch deployed contracts
        const admissions = await AdmissionsContract.deployed();
        const officer = await OfficerContract.deployed();

        // 2. Log deployed addresses
        console.log("Officer Contract Address:", officer.address);
        console.log("Admissions Contract Address:", admissions.address);

        // 3. Fetch applicants assigned to the officer
        let officerData = await officer.getAssignedApplicants();
        let admissionsData = await admissions.getApplicantsForOfficer(officer.address);

        let officerApplicants = officerData['0'];
        let admissionsApplicants = admissionsData['0'];

        console.log("Applicants assigned from Officer Contract:", officerApplicants, officerApplicants.length);
        console.log("Applicants assigned from Admissions Contract:", admissionsApplicants, admissionsApplicants.length);

        // 4. Fetch application details for each applicant
        for (const applicantAddress of officerApplicants) {
            const applicationData = await officer.viewApplicant(applicantAddress);
            console.log(`Application details for applicant ${applicantAddress}:`);
            console.log("Name:", applicationData[0]);
            console.log("University:", applicationData[1]);
            console.log("IPFS Link:", applicationData[2]);
            console.log("Decision Made:", applicationData[3]);
            console.log("Decision:", applicationData[4]);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }

    callback();
};
