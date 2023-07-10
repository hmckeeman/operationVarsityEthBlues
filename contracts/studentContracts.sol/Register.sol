// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../universityContracts/admissionsOffice.sol";

contract Register {
    address payable public admissionsOffice;

    constructor(address payable _admissionsOffice) {
        admissionsOffice = _admissionsOffice;
    }

    function registerWithAdmissionsOffice() external payable {
        require(admissionsOffice != address(0), "AdmissionsOffice address not set");
        require(msg.value >= 10 wei, "Insufficient payment");

        (bool success, ) = admissionsOffice.call{value: 10 wei}("");
        require(success, "ETH transfer to AdmissionsOffice failed");

        AdmissionsOffice(admissionsOffice).addApplicant(msg.sender);
    }

    function getAssignedOfficer() external view returns (address) {
        return AdmissionsOffice(admissionsOffice).getAssignedOfficer(msg.sender);
    }
}
