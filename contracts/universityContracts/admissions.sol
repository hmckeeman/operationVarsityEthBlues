// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admissions {
    address private deployer;
    address[] private unassignedApplicants;
    address[] private assignedApplicants;
    address[] private acceptedStudents;
    address[] private approvedAdmissionsOfficers;
    uint256 private maxStudents;
    uint256 private lastAssignedOfficerIndex;

    mapping(address => address) private applicantToOfficer;
    mapping(address => bool) private isRegistered;

    receive() external payable {
        // No logic required in the fallback function
    }
    
    constructor(uint256 _maxStudents) {
        maxStudents = _maxStudents;
        deployer = msg.sender;
        // Note: The deployer is no longer automatically added as an approved officer
    }

    modifier onlyAdmissionsOfficer() {
        require(isAdmissionsOfficer(msg.sender) || msg.sender == deployer, "Only approved admissions officers or deployer can call this function");
        _;
    }

    event AdmissionsOfficerAssigned(address indexed student, address indexed officer);

    function isAdmissionsOfficer(address officer) public view returns (bool) {
        for (uint256 i = 0; i < approvedAdmissionsOfficers.length; i++) {
            if (approvedAdmissionsOfficers[i] == officer) {
                return true;
            }
        }
        return false;
    }

    function getUnassignedApplicants() external view returns (uint256, address[] memory) {
        return (unassignedApplicants.length, unassignedApplicants);
    }

    function getAssignedApplicants() external view returns (uint256, address[] memory) {
        return (assignedApplicants.length, assignedApplicants);
    }

    function getAcceptedStudents() external view returns (uint256, address[] memory) {
        return (acceptedStudents.length, acceptedStudents);
    }

    function getAdmissionsOfficers() external view returns (uint256, address[] memory) {
        return (approvedAdmissionsOfficers.length, approvedAdmissionsOfficers);
    }

    function addApplicant(address applicant) external {
        require(!isRegistered[applicant], "Applicant already registered");
        unassignedApplicants.push(applicant);
        isRegistered[applicant] = true;
    }

    function isApplicantRegistered(address applicant) public view returns (bool) {
        for (uint256 i = 0; i < unassignedApplicants.length; i++) {
            if (unassignedApplicants[i] == applicant) {
                return true;
            }
        }
        for (uint256 i = 0; i < assignedApplicants.length; i++) {
            if (assignedApplicants[i] == applicant) {
                return true;
            }
        }
        return false;
    }

    function approveAdmissionsOfficer(address officer) external onlyAdmissionsOfficer {
        approvedAdmissionsOfficers.push(officer);
    }

    function assignAdmissionsOfficer() external onlyAdmissionsOfficer {
        require(unassignedApplicants.length > 0, "No unassigned applicants left");
        require(acceptedStudents.length < maxStudents, "Maximum number of students already reached");

        uint256 totalOfficers = approvedAdmissionsOfficers.length;
        uint256 totalApplicants = unassignedApplicants.length;

        // Calculate the number of applicants per officer
        uint256 applicantsPerOfficer = totalApplicants / totalOfficers;
        uint256 remainingApplicants = totalApplicants % totalOfficers;

        // Assign applicants to the officers
        for (uint256 i = 0; i < totalApplicants; i++) {
            if (i >= totalOfficers) {
                // All officers have been assigned, break the loop
                break;
            }

            // Calculate the number of applicants to assign to this officer
            uint256 count = applicantsPerOfficer;
            if (remainingApplicants > 0) {
                count += 1;
                remainingApplicants -= 1;
            }

            // Get the index of the next officer to assign
            uint256 officerIndex = (lastAssignedOfficerIndex + 1) % totalOfficers;

            // Assign applicants to the current officer
            for (uint256 j = 0; j < count; j++) {
                if (unassignedApplicants.length == 0) {
                    // No unassigned applicants left, break the loop
                    break;
                }

                uint256 randomIndex = getRandomIndex(unassignedApplicants.length);
                address selectedApplicant = unassignedApplicants[randomIndex];

                // Assign the selected applicant to the current officer
                applicantToOfficer[selectedApplicant] = approvedAdmissionsOfficers[officerIndex];
                assignedApplicants.push(selectedApplicant);

                // Remove the assigned applicant from the unassigned applicants list
                removeApplicant(randomIndex);

                // Emit the event
                emit AdmissionsOfficerAssigned(selectedApplicant, approvedAdmissionsOfficers[officerIndex]);

                // Update the last assigned officer index
                lastAssignedOfficerIndex = officerIndex;

                // Increment the officer index for the next iteration
                officerIndex = (officerIndex + 1) % totalOfficers;
            }
        }
    }

    function removeApplicant(uint256 index) internal {
        if (index >= unassignedApplicants.length) return;

        for (uint256 i = index; i < unassignedApplicants.length - 1; i++) {
            unassignedApplicants[i] = unassignedApplicants[i + 1];
        }
        unassignedApplicants.pop();
    }

    function getRandomIndex(uint256 length) internal view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % length;
        return seed;
    }

    function getAssignedOfficer(address applicant) public view returns (address) {
        return applicantToOfficer[applicant];
    }

    function getApplicantsForOfficer(address officer) external view returns (uint256, address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < assignedApplicants.length; i++) {
            if (applicantToOfficer[assignedApplicants[i]] == officer) {
                count++;
            }
        }

        address[] memory applicants = new address[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < assignedApplicants.length; i++) {
            if (applicantToOfficer[assignedApplicants[i]] == officer) {
                applicants[index] = assignedApplicants[i];
                index++;
            }
        }

        return (count, applicants);
    }
}
