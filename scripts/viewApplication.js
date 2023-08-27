const Officer = artifacts.require("Officer");

module.exports = async function(callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        const officerAccount = accounts[0]; // adjust this if the officer is using a different account

        // Instantiate the Officer contract
        const officerInstance = await Officer.deployed();
        console.log("Officer Contract Address:", officerInstance.address);

        // This assumes that you want to view the application for the first applicant.
        // You may want to adjust this if you're viewing a different applicant.
        // Remember, the "applicantContract" here refers to the address of the specific applicant.
        const applicantContract = accounts[1]; // adjust this to the appropriate applicant's contract address

        console.log("Fetching application for Applicant Address:", applicantContract);

        // Use the viewApplicant function
        const [name, university, ipfsLink, decisionMade, decision] = await officerInstance.viewApplicant(applicantContract);

        // Display the applicant's data
        console.log("\nApplicant Data:");
        console.log("Name:", name);
        console.log("University:", university);
        console.log("IPFS Link:", ipfsLink);
        if(decisionMade) {
            console.log("Decision:", decision);
        } else {
            console.log("Decision has not been made yet.");
        }

    } catch (error) {
        console.error("Error encountered:", error);
    }

    callback();
};
