const Admissions = artifacts.require("Admissions");

contract("Admissions", (accounts) => {
    let admissions;

    // Address of the already deployed Admissions contract
    const DEPLOYED_ADDRESS = "0x7812142c200B417E3A5084386106c2353250b1f8"; // Replace with your contract address

    // Get the already deployed contract instance before running tests
    before(async () => {
        admissions = await Admissions.at(DEPLOYED_ADDRESS);
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
