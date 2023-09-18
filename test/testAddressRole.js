const AdmissionsContract = artifacts.require("Admissions");

contract("AdmissionsContract", (accounts) => {
  let admissionsInstance;

  before(async () => {
    admissionsInstance = await AdmissionsContract.deployed();
  });

  it("should ensure no address is both an officer and an applicant", async () => {
    const applicants = await admissionsInstance.getAllApplicants();
    const officers = await admissionsInstance.getAllOfficers();

    for (let address of applicants) {
      assert.isNotOk(officers.includes(address), `Address ${address} is both an applicant and an officer!`);
    }
  });
});
