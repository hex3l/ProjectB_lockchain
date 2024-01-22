// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

contract DealHandler {

    // Platform owner (required to dispute a request)
    address public owner;
	uint public nextDealPid = 1;
	bool public selfDestructInitiated; //bool is initialized at 0 false, it's used to evalueate if the destroySmartDeal(_to) has been called
	struct Deal {
		uint id;
		uint amount; //amount to be sent
		address payable source; //sender
		address payable target; //recipient
		bool sourceConfirmation; //sender's confirmation
		bool targetConfirmation; //recipient's confirmation   //ideally, bool can be stored inside a single uint256 and save ( sometimes) some gas
        
	}

	// List of all deals
    mapping (uint => Deal) public deals;

    // Set platform owner as owner of this deal
    constructor() {
        owner = msg.sender;

    }
	//not entirely sure on what does indexed type do... //TOCHECK

	// fra: sui deal penso basti lasciare l'id del deal aggioranto in modo che possiamo ripescarlo da soli dal mappings. 
	// Credo sia necessario farsi passare un id dal backend in modo da poterlo associarre al deal sul db... vediamo che fare...
	event Confirmed(uint  id,address  source, address target, uint256 indexed value);
	event DeletedDeal(uint indexed pid);
	event CreatedDeal(Deal indexed c);
	//modifiers declaration, essential to reduce useless function calls if some conditions are not met. A sort of collections of requires. Order of each modifier's requires- is not relevant.
    
    modifier onlySource(uint _pid){
        require(msg.sender == deals[_pid].source, "Only the source can confirm this deal");
		require(deals[_pid].sourceConfirmation == false , "Deal's task has been already confirmed on your end");
        _;
    }

    modifier onlyTarget(uint _pid){
        require(msg.sender == deals[_pid].target, "Only the target can confirm this deal");
		require(deals[_pid].targetConfirmation == false , "Deal's task has been already confirmed on your end");
        _;
    }

	modifier onlyAgreed(uint _pid){
		
		require(deals[_pid].sourceConfirmation == true, "Source has not confirmed yet!");
		require(deals[_pid].targetConfirmation == true, "Target has not confirmed yet!");
		_;
	}

	modifier onlyAlive(){
		require(msg.value>0, "Amount must be higher than 0");
		require(!selfDestructInitiated, "cannot create new deal, only pending one are still accepted");
		_;
	
	}





    // Sender and target manage their interaction

	// Creates a virtual deal for the transaction
    // 
	function createDeal(address _target) onlyAlive() public payable {
		
		deals[nextDealPid] = Deal(nextDealPid, msg.value, payable(msg.sender), payable(_target), false, false);
		emit CreatedDeal(deals[nextDealPid]);
		nextDealPid++;
		
	}

	// Target can confirm that the task agreed in deal has been compleeted
	function confirmTargetDeal(uint _pid) onlyTarget(_pid) public {
		
		deals[_pid].targetConfirmation = true;
		
		if (deals[_pid].sourceConfirmation ==true){

			
		 	payDeal(_pid);
			
		}
	}

	// Target can confirm that the task agreed in deal has been compleeted
	function confirmSourceDeal(uint _pid) onlySource(_pid) public {
		
		deals[_pid].sourceConfirmation = true;

		if (deals[_pid].targetConfirmation ==true){

			
		 	payDeal(_pid);
			
		}

	}

	// Function that checks if both ends agreed to fulfill the deal and pays the target
    // ISSUE: Eventually,the deal will not have enough money to fulfill payments, so there are few strategies:
	//		- User-friendly approach: The owner will refill smart deal's balance once in a while
	//		- ERC20-like approach: The sender of the message (so final users) will have to specify an amount (higher than the msg.value). In short, the final user pays those fees.
	function payDeal(uint _pid) onlyAgreed(_pid) private {
		//if (deals[_pid].sourceConfirmation == true && deals[_pid].targetConfirmation == true) { //this can be modified as a modifier I guess
			require(deals[_pid].amount >= address(this).balance, "Insufficient funds");
			deals[_pid].target.transfer(deals[_pid].amount);
			emit Confirmed(_pid,deals[_pid].source, deals[_pid].target, deals[_pid].amount);
			// TODO: elimino il Deal dall'hashmap
              delete deals[_pid] ; 
			emit DeletedDeal(_pid);
		
	}

    


    // Function to discard dispute on a deal, callable only by the owner
    function discardDeal(uint _pid) public {
        require(msg.sender == owner, "only the owner can perform this action!"); //this could go in a modifier, but as long as only condition is there a require is fine.
		deals[_pid].source.transfer(deals[_pid].amount);
        delete deals[_pid] ; 
		emit DeletedDeal(_pid);
    }

    //function to complete a dispute and pay the right side, callable only by the owner
    //not entirely sure if this is the suitable way, the different approach is to make the seller now elegible to claim the earned money directly from the smartdeal on his own.
    function completeAndPay(uint _pid) public {
        require(msg.sender == owner, "only the owner can perform this action!"); //this could go in a modifier, but as long as only condition is there a require is fine.
        
        deals[_pid].target.transfer(deals[_pid].amount);
		delete deals[_pid] ; 
        emit DeletedDeal(_pid);
    }


	//Big-ass red button to stop the deal in case of << exotic >> events
	//TODO give back money to deals creators
	//the idea:
	// once the function is called:
	//	- No more deals can be created
	//	- Users can withdraw their money
	//  - If/when all the users had witdrew money/no more deal are open -> smartdeal is destructed
	function destroySmartDeal(address payable _to) public {
        require(msg.sender == owner, "You are not the owner");
		selfDestructInitiated = true;

        selfdestruct(_to);
    }

	}
