const Application = artifacts.require("Application");

module.exports = async function(callback) {
    try {
        const applicantName = "John Doe"; // Replace with real name
        const universityName = "MIT"; // Replace with real university name
        const ipfsLink = "QmXYZ..."; // Replace with the real IPFS link

        // Fetch the deployed Application contract instance
        const applicationInstance = await Application.deployed();

        console.log("Deploying application...");

        // Calling the function to create the application
        await applicationInstance.createApplication(applicantName, universityName, ipfsLink);
        
        // Fetching the recently created token ID 
        const tokenIdBN = await applicationInstance.getCurrentTokenId();
        const tokenId = tokenIdBN.toNumber() > 0 ? tokenIdBN.sub(new web3.utils.BN(1)) : tokenIdBN;

        // Fetching the application details using the token ID
        const applicationData = await applicationInstance.getApplication(tokenId); // This line was missing

        const admissionsAddress = await applicationInstance.getAdmissionsContractAddress();
        const applicantAddress = await applicationInstance.getApplicantContractAddress();

        console.log("\n-----------------------------");
        console.log("Application Contract Address:", applicationInstance.address);
        console.log("Admissions Contract Address:", admissionsAddress);
        console.log("Applicant Contract Address:", applicantAddress);
        console.log("Applicant Name:", applicationData.name);
        console.log("University Name:", applicationData.university);
        console.log("IPFS Link:", applicationData.ipfsLink);
        console.log("Token ID of Application:", tokenId.toString());
        console.log("-----------------------------\n");
        callback();
    } catch (error) {
        console.error("Error deploying application:", error);
        callback(error);
    }
};