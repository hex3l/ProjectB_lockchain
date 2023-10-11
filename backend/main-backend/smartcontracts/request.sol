pragma solidity 0.8.19;

contract ContractHandler {

    // Platform owner (required to dispute a request)
    address public owner;
	uint public nextContractPid = 1;

	struct Contract {
		uint id;
		uint amount;
		address payable source;
		address payable target;
		bool sourceConfirmation;
		bool targetConfirmation;
	}

	// List of all contracts
    mapping (uint => Contract) public contracts;

    // Set platform owner as owner of this contract
    constructor() {
        owner = msg.sender;
    }

	// Sender and target manage their interactin

	// Creates a virtual contract for the transaction
	function createContract(address _target) public payable {
		contracts[nextContractPid] = Contract(nextContractPid, msg.value, payable(msg.sender), payable(_target), false, false);
		nextContractPid++;
	}

	// Target can confirm that the task agreed in contract has been compleeted
	function confirmTargetContract(uint _pid) public {
		require(msg.sender == contracts[_pid].target, "Only the target can confirm this contract");
		require(contracts[_pid].targetConfirmation == false , "Contract's task has been already confirmed on your end");
		contracts[_pid].targetConfirmation = true;
		payContract(_pid);
	}

	// Target can confirm that the task agreed in contract has been compleeted
	function confirmSourceContract(uint _pid) public {
		require(msg.sender == contracts[_pid].source, "Only the source can confirm this contract");
		require(contracts[_pid].sourceConfirmation == false , "Contract's task has been already confirmed on your end");
		contracts[_pid].sourceConfirmation = true;
		payContract(_pid);
	}

	// Function that checks if both ends agreed to fulfill the contract and pays the target
	function payContract(uint _pid) private {
		if (contracts[_pid].sourceConfirmation == true && contracts[_pid].targetConfirmation == true) {
			contracts[_pid].target.transfer(contracts[_pid].amount);
			// TODO: elimino il Contract dall'hashmap
		}
	}

	// TODO: 2 owner functions:
	// 			1. Discard and refund source
	// 			2. Complete and pay target
}