const OfficerContract = artifacts.require("Officer");

module.exports = async function(callback) {
    try {
        // Initialize contract
        const officerContract = await OfficerContract.at("Your_Officier_Contract_Address_Here");

        // Accept applicant
        const applicantAddress = "Applicant_Address_Here";
        await officerContract.acceptApplicant(applicantAddress);

        // View application details if needed
        const applicationDetails = await officerContract.viewApplicant(applicantAddress);
        console.log("Application details:", applicationDetails);

    } catch (error) {
        console.error(error);
    }
    callback();
};
