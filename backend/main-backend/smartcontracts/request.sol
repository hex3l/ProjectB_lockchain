pragma solidity 0.8.22;

contract ContractHandler {

    // Platform owner (required to dispute a request)
    address public owner;
	uint public nextContractPid = 1;

	struct Contract {
		uint id;
		uint amount; //amount to be sent
		address payable source; //sender
		address payable target; //recipient
		bool sourceConfirmation; //sender's confirmation
		bool targetConfirmation; //recipient's confirmation   //ideally, bool can be stored inside a single uint256 and save ( sometimes) some gas
        // QUESTION: Shouldn't be here also the attribute regarding validity of the contract?
	}

	// List of all contracts
    mapping (uint => Contract) public contracts;

    // Set platform owner as owner of this contract
    constructor() {
        owner = msg.sender;

    }



	//modifiers declaration, essential to reduce useless function calls if some conditions are not met. A sort of collections of requires. Order of each modifier's requires- is not relevant.
    
    modifier onlySource(uint _pid){
        require(msg.sender == contracts[_pid].source, "Only the source can confirm this contract");
		require(contracts[_pid].sourceConfirmation == false , "Contract's task has been already confirmed on your end");
        _;
    }

    modifier onlyTarget(uint _pid){
        require(msg.sender == contracts[_pid].target, "Only the target can confirm this contract");
		require(contracts[_pid].targetConfirmation == false , "Contract's task has been already confirmed on your end");
        _;
    }

	modifier onlyAgreed(uint _pid){
		require(contracts[_pid].sourceConfirmation == true, "Source has not confirmed yet!");
		require(contracts[_pid].targetConfirmation == true, "Target has not confirmed yet!");
		_;
	}




    // Sender and target manage their interaction

	// Creates a virtual contract for the transaction
    // QUESTION shouldn't the creation also include amount? 
	function createContract(address _target) public payable {
		require(msg.value>0, "Amount must be higher than 0");
		contracts[nextContractPid] = Contract(nextContractPid, msg.value, payable(msg.sender), payable(_target), false, false);
		nextContractPid++;
	}

	// Target can confirm that the task agreed in contract has been compleeted
	function confirmTargetContract(uint _pid) onlyTarget(_pid) public {
		
		contracts[_pid].targetConfirmation = true;
		payContract(_pid);
	}

	// Target can confirm that the task agreed in contract has been compleeted
	function confirmSourceContract(uint _pid) onlySource(_pid) public {
		
		contracts[_pid].sourceConfirmation = true;
		payContract(_pid);
	}

	// Function that checks if both ends agreed to fulfill the contract and pays the target
    // ISSUE: Eventually,the contract will not have enough money to fulfill payments, so there are few strategies:
	//		- User-friendly approach: The owner will refill smart contract's balance once in a while
	//		- ERC20-like approach: The sender of the message (so final users) will have to specify an amount (higher than the msg.value). In short, the final user pays those fees.
	function payContract(uint _pid) onlyAgreed(_pid) private {
		//if (contracts[_pid].sourceConfirmation == true && contracts[_pid].targetConfirmation == true) { //this can be modified as a modifier I guess
			require(contracts[_pid].amount >= address(this).balance, "Insufficient funds");
			contracts[_pid].target.transfer(contracts[_pid].amount);
			// TODO: elimino il Contract dall'hashmap
              delete contracts[_pid] ; 
		
	}

    


    // Function to discard dispute on a contract, callable only by the owner
    function discardContract(uint _pid) public {
        require(msg.sender == owner, "only the owner can perform this action!"); //this could go in a modifier, but as long as only condition is there a require is fine.
        delete contracts[_pid] ; 

    }

    //function to complete a dispute and pay the right side, callable only by the owner
    //not entirely sure if this is the suitable way, the different approach is to make the seller now elegible to claim the earned money directly from the smartcontract on his own.
    function completeAndPay(uint _pid) public {
        require(msg.sender == owner, "only the owner can perform this action!"); //this could go in a modifier, but as long as only condition is there a require is fine.
        
        contracts[_pid].target.transfer(contracts[_pid].amount);
    
        
    }


	//Big-ass red button to stop the contract in case of << exothic >> behaviours
	//TOUPDATE following Di Ciccio's guidelines
	function destroySmartContract(address payable _to) public {
        require(msg.sender == owner, "You are not the owner");
        selfdestruct(_to);
    }

	}
