const Admissions = artifacts.require("Admissions");
const Officers = artifacts.require("Officers");
const Applicant = artifacts.require("Applicant");

contract("Deployment Addresses Test", (accounts) => {
    let admissions, officersInstances = [], applicantInstances = [];

    before(async () => {
        // Get the deployed instance of Admissions
        admissions = await Admissions.deployed();
        
        // Assuming there's a way to distinguish or fetch the deployed instances of Officers and Applicant contracts
        // Here's a hypothetical way to do it:

        // Get the deployed instances of Officers
        for(let i = 0; i < 3; i++) {
            const officer = await Officers.at(addressOfTheOfficerInstance[i]); // You need to provide the address of each Officer instance
            officersInstances.push(officer);
        }

        // Get the deployed instances of Applicant
        for(let j = 0; j < 4; j++) {
            const applicant = await Applicant.at(addressOfTheApplicantInstance[j]); // You need to provide the address of each Applicant instance
            applicantInstances.push(applicant);
        }
    });

    it("checks if all contracts were deployed by different accounts", async () => {
        const deployerAddresses = [];

        // Get the deployer address for Admissions
        const admissionsDeployer = await admissions.owner(); 
        deployerAddresses.push(admissionsDeployer);

        // Get deployer addresses for all Officer instances
        for(const officer of officersInstances) {
            const officerDeployer = await officer.owner();
            deployerAddresses.push(officerDeployer);
        }

        // Get deployer addresses for all Applicant instances
        for(const applicant of applicantInstances) {
            const applicantDeployer = await applicant.owner();
            deployerAddresses.push(applicantDeployer);
        }

        // Check for unique deployer addresses
        const uniqueAddresses = [...new Set(deployerAddresses)];
        assert.equal(uniqueAddresses.length, deployerAddresses.length, "Not all contracts were deployed by unique accounts");
    });
});
