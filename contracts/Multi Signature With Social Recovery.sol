// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWalletWithRecovery {
    address[] public owners;
    uint public required; // no. of approvals needed
    mapping(address => bool) public isOwner;

    struct Transaction {
        address to;
        uint value;
        bool executed;
        uint approvals;
    }

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approved;

    // Recovery mechanism
    address[] public guardians;
    mapping(address => bool) public isGuardian;

    constructor(address[] memory _owners, uint _required, address[] memory _guardians) {
        require(_owners.length >= _required, "Owners < required approvals");

        for (uint i = 0; i < _owners.length; i++) {
            isOwner[_owners[i]] = true;
            owners.push(_owners[i]);
        }
        required = _required;

        for (uint j = 0; j < _guardians.length; j++) {
            isGuardian[_guardians[j]] = true;
            guardians.push(_guardians[j]);
        }
    }

    // Core Function 1: Submit Transaction
    function submitTransaction(address _to, uint _value) external onlyOwner {
        transactions.push(Transaction({
            to: _to,
            value: _value,
            executed: false,
            approvals: 0
        }));
    }

    // Core Function 2: Approve Transaction
    function approveTransaction(uint txIndex) external onlyOwner {
        require(!approved[txIndex][msg.sender], "Already approved");
        approved[txIndex][msg.sender] = true;
        transactions[txIndex].approvals++;

        if (transactions[txIndex].approvals >= required) {
            executeTransaction(txIndex);
        }
    }

    // Core Function 3: Recovery Mechanism
    function recoverWallet(address oldOwner, address newOwner) external onlyGuardian {
        require(isOwner[oldOwner], "Not valid owner");
        isOwner[oldOwner] = false;
        isOwner[newOwner] = true;
    }

    // Helper: Execute Transaction
    function executeTransaction(uint txIndex) internal {
        Transaction storage txn = transactions[txIndex];
        require(!txn.executed, "Already executed");
        txn.executed = true;
        payable(txn.to).transfer(txn.value);
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "Not a guardian");
        _;
    }

    receive() external payable {}
}

