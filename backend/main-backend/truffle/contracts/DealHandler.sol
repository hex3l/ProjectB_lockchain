// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;

contract DealHandler {
  // Platform owner (required to dispute a request)
  address public owner;
  bool public selfDestructInitiated; //bool is initialized at 0 false, it's used to evalueate if the destroySmartDeal(_to) has been called
  struct Deal {
    uint amount; //amount to be sent
    address payable source; //sender
    address payable target; //recipient
    bool sourceConfirmation; //sender's confirmation
    bool targetConfirmation; //recipient's confirmation   //ideally, bool can be stored inside a single uint256 and save ( sometimes) some gas
    //once the offer has been confirmed, the web app should contact the oracle to write [id, source, target, amount]
    //when the buyer sends his money, the confirmation can only invole deal id attribute
    bool payed;
    bool valid;
  }

  // List of all deals
  mapping(uint => Deal) public deals;

  // Set platform owner as owner of this deal
  constructor() {
    owner = msg.sender;
  }

  //not entirely sure on what does indexed type do... //TOCHECK
  event CreatedDeal(uint indexed id);
  event Payed(uint indexed id);
  event TargetConfirm(uint indexed id);
  event SourceConfirm(uint indexed id);
  event Confirmed(uint id, address source, address target, uint256 indexed value);
  event Reimbursed(uint indexed id);
  event DeletedDeal(uint indexed id);

  //modifiers declaration, essential to reduce useless function calls if some conditions are not met. A sort of collections of requires. Order of each modifier's requires- is not relevant.

  modifier onlySource(uint _id) {
    require(msg.sender == deals[_id].source, 'Only the source can confirm this deal');
    require(deals[_id].sourceConfirmation == false, "Deal's task has been already confirmed on your end");
    _;
  }

  modifier onlyTarget(uint _id) {
    require(msg.sender == deals[_id].target, 'Only the target can confirm this deal');
    require(deals[_id].targetConfirmation == false, "Deal's task has been already confirmed on your end");
    _;
  }

  modifier onlyAgreed(uint _id) {
    require(deals[_id].sourceConfirmation == true, 'Source has not confirmed yet!');
    require(deals[_id].targetConfirmation == true, 'Target has not confirmed yet!');
    _;
  }

  modifier onlyAlive() {
    require(msg.value > 0, 'Amount must be higher than 0');
    require(!selfDestructInitiated, 'cannot create new deal, only pending one are still accepted');
    _;
  }

  // Sender and target manage their interaction

  // Creates a virtual deal for the transaction
  //
  function createDeal( uint dealID, uint amount,  address _source, address _target) public payable onlyAlive {
    require(msg.sender == owner, 'You are not the owner');
    deals[dealID] = Deal(amount, payable(_source), payable(_target), false, false, false, true);
    emit CreatedDeal(dealID);
  }

  // Target can confirm that the task agreed in deal has been compleeted
  function confirmTargetDeal(uint _id) public onlyTarget(_id) {
    deals[_id].targetConfirmation = true;
    emit TargetConfirm(_id);

    if (deals[_id].sourceConfirmation == true) {
      fulfillDeal(_id);
    }
  }

  // Target can confirm that the task agreed in deal has been compleeted
  function confirmSourceDeal(uint _id) public onlySource(_id) {
    deals[_id].sourceConfirmation = true;
    emit SourceConfirm(_id);

    if (deals[_id].targetConfirmation == true) {
      fulfillDeal(_id);
    }
  }

  // Function that checks if both ends agreed to fulfill the deal and pays the target
  // ISSUE: Eventually,the deal will not have enough money to fulfill payments, so there are few strategies:
  //		- User-friendly approach: The owner will refill smart deal's balance once in a while
  //		- ERC20-like approach: The sender of the message (so final users) will have to specify an amount (higher than the msg.value). In short, the final user pays those fees.
  function fulfillDeal(uint _id) private onlyAgreed(_id) {
    //if (deals[_id].sourceConfirmation == true && deals[_id].targetConfirmation == true) { //this can be modified as a modifier I guess
    require(deals[_id].amount > address(this).balance, 'Insufficient funds');
    deals[_id].target.transfer(deals[_id].amount);
    emit Confirmed(_id, deals[_id].source, deals[_id].target, deals[_id].amount);
    // TODO: elimino il Deal dall'hashmap
    delete deals[_id];
    emit DeletedDeal(_id);
  }

  function payDeal(uint _idl) public payable {
    require(msg.sender == deals[_idl].source, 'You are not the source!');
    require(msg.value == deals[_idl].amount, 'Wrong amount!');
    require(deals[_idl].payed == false, 'Deal already payed!');

    deals[_idl].payed = true;

    emit Payed(_idl);
  }

  // Function to discard dispute on a deal, callable only by the owner
  function discardDeal(uint _id) public {
    require(msg.sender == owner, 'only the owner can perform this action!'); //this could go in a modifier, but as long as only condition is there a require is fine.
    deals[_id].source.transfer(deals[_id].amount);
    emit Reimbursed(_id);
    delete deals[_id];
    emit DeletedDeal(_id);
  }

  //function to complete a dispute and pay the right side, callable only by the owner
  //not entirely sure if this is the suitable way, the different approach is to make the seller now elegible to claim the earned money directly from the smartdeal on his own.
  function completeAndPay(uint _id) public {
    require(msg.sender == owner, 'only the owner can perform this action!'); //this could go in a modifier, but as long as only condition is there a require is fine.

    deals[_id].target.transfer(deals[_id].amount);
    emit Confirmed(_id, deals[_id].source, deals[_id].target, deals[_id].amount);
    delete deals[_id];
    emit DeletedDeal(_id);
  }

  ////////////////////////////////////////
  // Obtain locally deal information
  function getDeal(uint _id) public view returns (uint, address, address, bool, bool, bool) {
    require(deals[_id].valid == true, 'No associated deals with this id');

    return (
      deals[_id].amount,
      deals[_id].source,
      deals[_id].target,
      deals[_id].sourceConfirmation,
      deals[_id].targetConfirmation,
      deals[_id].payed
    );
  }

  //Big-ass red button to stop the deal in case of << exotic >> events
  //TODO give back money to deals creators
  //the idea:
  // once the function is called:
  //	- No more deals can be created
  //	- Users can withdraw their money
  //  - If/when all the users had witdrew money/no more deal are open -> smartdeal is destructed
  function destroySmartDeal(address payable _to) public {
    require(msg.sender == owner, 'You are not the owner');
    selfDestructInitiated = true;
    selfdestruct(_to);
  }
}
