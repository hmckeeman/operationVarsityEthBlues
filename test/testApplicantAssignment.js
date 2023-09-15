const Admissions = artifacts.require("Admissions");

contract("Applicant Assignment Test", (accounts) => {

  it("checks if all applicants have been assigned an admissions officer", async () => {
    const admissionsInstance = await Admissions.deployed();

    // Assuming you've added applicants and officers in a previous test or setup
    const totalApplicants = (await admissionsInstance.getUnassignedApplicants())[1].length + (await admissionsInstance.getAssignedApplicants())[1].length;
    const assignedApplicants = (await admissionsInstance.getAssignedApplicants())[1].length;

    assert.equal(totalApplicants, assignedApplicants, "Not all applicants were assigned");
  });

});
