const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        const admissionsInstance = await Admissions.deployed();
        console.log("Admissions contract instance fetched.");

        console.log("Fetching approved officers from Admissions contract...");
        const officersData = await admissionsInstance.getAdmissionsOfficers();
        console.log("Raw return from getAdmissionsOfficers:", officersData);

        if (officersData && officersData[1] && officersData[1].length > 0) {
            const count = officersData[0].toNumber();
            const officers = officersData[1];

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

    callback();
};
