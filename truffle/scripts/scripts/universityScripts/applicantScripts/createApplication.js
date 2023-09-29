const fs = require('fs');
const Application = artifacts.require("Application");

module.exports = async function(callback) {
    try {
        const applicantName = "John Doe";
        const universityName = "MIT";
        const ipfsLink = "https://ipfs.io/ipfs/bafybeihloosz2khq3qvqqy75hblmnwdsoe5zufotapameko76ea6v5m7oi/universityApp.jpg";

        const applicationInstance = await Application.deployed();
        console.log("Creating application...");
        await applicationInstance.createApplication(applicantName, universityName, ipfsLink);

        const tokenIdBN = await applicationInstance.getCurrentTokenId();
        const tokenId = tokenIdBN.toNumber() > 0 ? tokenIdBN.sub(new web3.utils.BN(1)) : tokenIdBN;

        const applicationData = await applicationInstance.getApplication(tokenId);

        const admissionsAddress = await applicationInstance.getAdmissionsContractAddress();
        const applicantAddress = await applicationInstance.getApplicantContractAddress();
        const applicationAddress = applicationInstance.address;

        // Replace the entire content of the JSON file with the new application address.
        fs.writeFileSync('deployedApplicationAddresses.json', JSON.stringify([applicationAddress]));

        console.log("\n-----------------------------");
        console.log("Application Contract Address:", applicationAddress);
        console.log("Admissions Contract Address:", admissionsAddress);
        console.log("Applicant Contract Address:", applicantAddress);
        console.log("Applicant Name:", applicationData.name);
        console.log("University Name:", applicationData.university);
        console.log("IPFS Link:", applicationData.ipfsLink);
        console.log("Token ID of Application:", tokenId.toString());
        console.log("-----------------------------\n");

        callback();
    } catch (error) {
        console.error("Error creating application:", error);
        callback(error);
    }
};
