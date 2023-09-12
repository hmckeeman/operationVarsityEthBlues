const Admissions = artifacts.require("Admissions");

module.exports = async function(callback) {
    try {
        // Fetch the deployed Admissions contract instance
        const admissionsInstance = await Admissions.deployed();

        // Fetch new students from the Admissions contract
        const newStudentsData = await admissionsInstance.getNewStudents();
        const newStudentsCount = newStudentsData[0]; // Fetch the count from the returned tuple
        const newStudents = newStudentsData[1]; // Fetch the array from the returned tuple
        
        if (newStudents.length === 0) {
            console.log("No new students have been added yet.");
            callback();
            return;
        }

        console.log(`Total number of new students: ${newStudentsCount}`);

        console.log("Fetching new students...");
        newStudents.forEach(student => {
            console.log(`New Student Address: ${student}`);
        });

        console.log("\n-----------------------------");
        console.log("Fetched all new students successfully!");
        console.log("-----------------------------\n");

        callback();
    } catch (error) {
        console.error("Error fetching the new students:", error);
        callback(error);
    }
};
