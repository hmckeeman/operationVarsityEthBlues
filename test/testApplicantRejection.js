//this file tests to see if an applicant can approve an applicant - only officers can do this so it will fail

const Officer = artifacts.require("Officer");
const Applicant = artifacts.require("Applicant");
const Admissions = artifacts.require("Admissions");

contract("Officer", (accounts) => {
  let officerInstance;
  let applicantInstance;
  let admissionsInstance;
  
  beforeEach(async () => {
    admissionsInstance = await Admissions.new();
    officerInstance = await Officer.new(admissionsInstance.address);
    applicantInstance = await Applicant.new(admissionsInstance.address);

    await admissionsInstance.addApplicant(applicantInstance.address);
    await admissionsInstance.registerOfficer(officerInstance.address);
  });

  it("should reject an unauthorized applicant from approving an application", async () => {
    const unauthorizedApplicant = accounts[1]; // Use an unauthorized applicant's account
    
    try {
      // Attempt to approve an application from an unauthorized applicant
      await applicantInstance.acceptOffer({ from: unauthorizedApplicant });
      
      // If the function call succeeds, fail the test
      assert.fail("Unauthorized applicant was able to approve an application.");
    } catch (error) {
      // Check that the error message or other indicators confirm unauthorized access
      assert.include(error.message, "revert", "Unauthorized access error message not found.");
    }
  });
});
