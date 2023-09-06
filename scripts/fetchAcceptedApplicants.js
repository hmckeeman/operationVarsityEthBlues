const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Fetch the accounts from the Ethereum node
        const accounts = await web3.eth.getAccounts();

        // Fetch the deployed Admissions contract instance
        console.log("Fetching Admissions contract instance...");
        const admissionsInstance = await Admissions.deployed();
        console.log("Fetched. Admissions Contract Address:", admissionsInstance.address);

        // Fetch accepted applicants
        console.log("Fetching accepted applicants...");
        const result = await admissionsInstance.getAcceptedApplicants();
        console.log("Result from getAcceptedApplicants: ", result);

        const acceptedApplicantCount = result['0'].toNumber(); // Converting BN to a regular number
        const acceptedApplicantAddresses = result['1'];

        console.log(`Number of accepted applicants: ${acceptedApplicantCount}`);
        console.log("Accepted applicant addresses: ", acceptedApplicantAddresses);

        // If you still wish to save to a file, you can do it here.
        fs.writeFileSync('acceptedApplicantAddresses.json', JSON.stringify(acceptedApplicantAddresses));

        callback();  // Exit the script successfully

    } catch (error) {
        console.error("Error fetching accepted applicants: ", error);
        callback(error);  // Exit the script with an error state
    }
};
