const Admissions = artifacts.require("Admissions");

contract("Admissions", (accounts) => {
    let admissions;

    // Fetching the deployed instance instead of deploying a new one
    before(async () => {
        admissions = await Admissions.deployed();
    });

    describe("Deployment", () => {
        it("deploys successfully", async () => {
            const address = admissions.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it("initializes with the correct maxStudents", async () => {
            const maxStudents = await admissions.getMaxStudents();
            assert.equal(maxStudents.toString(), '1000', "Max students was not initialized to 1000");
        });

    });

});
