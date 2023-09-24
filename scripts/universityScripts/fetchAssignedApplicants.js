const Admissions = artifacts.require("Admissions");

module.exports = async function (callback) {
  try {
    const admissionsInstance = await Admissions.deployed();

    // Get the list of approved officers
    const { 1: officers } = await admissionsInstance.getAdmissionsOfficers();

    for (const officer of officers) {
      const { 0: officerApplicants, 1: count } = await admissionsInstance.getApplicantsForOfficer(officer);

      console.log(`Assigned applicants to Officer at ${officer}:`);
      if (count === 0) {
        console.log("No assigned applicants.");
      } else {
        officerApplicants.forEach(async (applicant) => {
          const assignedOfficer = await admissionsInstance.getAdmissionsOfficerForApplicant(applicant);
          console.log(`- Applicant: ${applicant}, Assigned Officer: ${assignedOfficer}`);
        });
      }
      console.log("----------"); // Separate the lists for readability
    }

    callback();
  } catch (error) {
    console.error("Error fetching assigned applicants:", error);
    callback(error);
  }
};
