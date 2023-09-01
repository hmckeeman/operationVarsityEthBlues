const fs = require('fs');
const Application = artifacts.require("Application");

module.exports = async function(callback) {
    try {
        // Predefined data for the application
        const applicantName = "John Doe"; // Replace with real name
        const universityName = "MIT"; // Replace with real university name
        const ipfsLink = "QmXYZ..."; // Replace with the real IPFS link

        // Fetch the deployed Application contract instance
        const applicationInstance = await Application.deployed();

        // Call the function to create the application
        console.log("Creating application...");
        await applicationInstance.createApplication(applicantName, universityName, ipfsLink);

        // Fetch the recently created token ID
        const tokenIdBN = await applicationInstance.getCurrentTokenId();
        const tokenId = tokenIdBN.toNumber() > 0 ? tokenIdBN.sub(new web3.utils.BN(1)) : tokenIdBN;

        // Fetch the application details using the token ID
        const applicationData = await applicationInstance.getApplication(tokenId);

        // Fetch other necessary data
        const admissionsAddress = await applicationInstance.getAdmissionsContractAddress();
        const applicantAddress = await applicationInstance.getApplicantContractAddress();

        // Save the application's address to a JSON file
        const applicationAddress = applicationInstance.address;
        let deployedApplicantAddresses = [];

        if (fs.existsSync('deployedApplicantAddresses.json')) {
            deployedApplicantAddresses = JSON.parse(fs.readFileSync('deployedApplicantAddresses.json', 'utf8'));
        }

        deployedApplicantAddresses.push(applicationAddress);
        fs.writeFileSync('deployedApplicantAddresses.json', JSON.stringify(deployedApplicantAddresses));

        // Log the relevant information
        console.log("\n-----------------------------");
        console.log("Application Contract Address:", applicationAddress);
        console.log("Admissions Contract Address:", admissionsAddress);
        console.log("Applicant Contract Address:", applicantAddress);
        console.log("Applicant Name:", applicationData.name);
        console.log("University Name:", applicationData.university);
        console.log("IPFS Link:", applicationData.ipfsLink);
        console.log("Token ID of Application:", tokenId.toString());
        console.log("-----------------------------\n");

        // Finish the script
        callback();
    } catch (error) {
        console.error("Error creating application:", error);
        callback(error);
    }
};
