const Application = artifacts.require("Application");

module.exports = async function(callback) {
    try {
        const applicantName = "John Doe"; // Replace with real name
        const universityName = "MIT"; // Replace with real university name
        const ipfsLink = "QmXYZ..."; // Replace with the real IPFS link

        // Fetch the deployed Application contract instance
        const applicationInstance = await Application.deployed();

        console.log("Deploying application...");
        await applicationInstance.createApplication(applicantName, universityName, ipfsLink);
        console.log("Application deployed!");

        callback();
    } catch (error) {
        console.error("Error deploying application:", error);
        callback(error);
    }
};
