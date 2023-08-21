const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        const admissionsInstance = await Admissions.deployed();
        console.log("Fetching approved officers from Admissions contract...");
        const result = await admissionsInstance.getAdmissionsOfficers();
        console.log("Direct result:", result);

        const count = result['0'].toNumber();
        const officers = result['1'];

        if (count > 0) {
            console.log("Number of approved admissions officers:", count);
            console.log("Addresses of approved admissions officers:");
            officers.forEach((officer, index) => {
                console.log(`${index + 1}. ${officer}`);
            });
        } else {
            console.log("No admissions officers have been approved yet.");
        }

    } catch (error) {
        console.error("Error fetching approved officers:", error);
    }

    callback();  // This ensures the script exits
};
