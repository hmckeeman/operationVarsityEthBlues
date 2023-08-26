const Application = artifacts.require("Application");
const Admissions = artifacts.require("Admissions");
const Officer = artifacts.require("Officer");

module.exports = async function(callback) {
    try {
        console.log("Fetching Application contract instance...");
        const applicationInstance = await Application.deployed();
        console.log("Fetched. Application Contract Address:", applicationInstance.address);

        console.log("Fetching the associated Applicant Contract...");
        const applicantContractAddress = await applicationInstance.getApplicantContractAddress();
        console.log("Fetched. Applicant Contract Address:", applicantContractAddress);

        console.log("Fetching Admissions contract instance...");
        const admissionsInstance = await Admissions.deployed();
        console.log("Fetched. Admissions Contract Address:", admissionsInstance.address);

        console.log("Fetching officer address for the application...");
        const officerAddress = await admissionsInstance.getAdmissionsOfficerForApplicant(applicantContractAddress);
        console.log("Fetched. Officer Address for the application:", officerAddress);

        if (officerAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("Invalid Officer Address retrieved.");
        }
        
        console.log("Fetching Officer contract instance using the fetched Officer Address...");
        const officerInstance = await Officer.at(officerAddress);
        console.log("Fetched. Officer Contract Instance ready.");
        
        // For the purpose of this script, I'm assuming you want to transfer the first application.
        // Adjust the number below if you need a different tokenId.
        console.log("Fetching current Token ID for the application...");
        const tokenId = await applicationInstance.getCurrentTokenId();
        console.log(`Fetched. Current Application Token ID: ${tokenId}`);
        
        console.log(`Initiating the transfer of Application with token ID ${tokenId} to officer at address ${officerAddress}...`);
        await applicationInstance.transferApplicationToOfficerContract(officerAddress, tokenId, { from: accounts[0] });
        console.log(`Application with token ID ${tokenId} has been transferred to officer at address ${officerAddress}.`);
        

    } catch (error) {
        console.error("Error encountered:", error);
    }

    callback();
};
