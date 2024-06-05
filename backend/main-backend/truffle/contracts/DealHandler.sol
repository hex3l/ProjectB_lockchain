// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.26;





contract DealHandler {
  // Set platform owner as owner of this deal
    constructor() {
        require(msg.sender != address(0), "Invalid owner address");
        owner = msg.sender;
        selfDestructInitiated = false;
    }
    // Platform owner (required to dispute a request)
    address public owner;
    bool public selfDestructInitiated;

    struct Deal {
        uint amount;
        address payable source;
        address payable target;
        bool sourceConfirmation;
        bool targetConfirmation;
        bool payed;
        bool valid;
        uint timestamp;
    }

    // List of all deals
    mapping(uint => Deal) public deals;

    // Custom errors for more gas-efficient error handling
    error OnlyOwner();
    error OnlySource();
    error OnlyTarget();
    error InvalidDeal();
    error DealAlreadyConfirmed();
    error DealNotValid();
    error InsufficientFunds();
    error DealAlreadyPaid();
    error WrongAmount();
    error SelfDestructInitiated();

    

    event CreatedDeal(uint indexed id);
    event Payed(uint indexed id);
    event TargetConfirm(uint indexed id);
    event SourceConfirm(uint indexed id);
    event Confirmed(uint id, address source, address target, uint256 indexed value);
    event Reimbursed(uint indexed id);
    event DeletedDeal(uint indexed id);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }
        _;
    }

    modifier onlySource(uint _id) {
        if (msg.sender != deals[_id].source) {
            revert OnlySource();
        }
        if (deals[_id].sourceConfirmation) {
            revert DealAlreadyConfirmed();
        }
        _;
    }

    modifier onlyTarget(uint _id) {
        if (msg.sender != deals[_id].target) {
            revert OnlyTarget();
        }
        if (deals[_id].targetConfirmation) {
            revert DealAlreadyConfirmed();
        }
        _;
    }

    modifier onlyAgreed(uint _id) {
        if (!deals[_id].sourceConfirmation || !deals[_id].targetConfirmation) {
            revert DealNotValid();
        }
        _;
    }

    modifier onlyAlive() {
        if (selfDestructInitiated) {
            revert SelfDestructInitiated();
        }
        _;
    }

    // Sender and target manage their interaction

    // Creates a virtual deal for the transaction
    function createDeal(uint dealID, uint amount, address _source, address _target) public onlyAlive onlyOwner {
        deals[dealID] = Deal(amount, payable(_source), payable(_target), false, false, false, true, block.number);
        emit CreatedDeal(dealID);
    }

    // Target can confirm that the task agreed in deal has been completed
    function confirmTargetDeal(uint _id) public onlyTarget(_id) {
        deals[_id].targetConfirmation = true;
        emit TargetConfirm(_id);

        if (deals[_id].sourceConfirmation) {
            fulfillDeal(_id);
        }
    }

    // Source can confirm that the task agreed in deal has been completed
    function confirmSourceDeal(uint _id) public onlySource(_id) {
        deals[_id].sourceConfirmation = true;
        emit SourceConfirm(_id);

        if (deals[_id].targetConfirmation) {
            fulfillDeal(_id);
        }
    }

    // Function that checks if both ends agreed to fulfill the deal and pays the target
    function fulfillDeal(uint _id) private onlyAgreed(_id) {
        if (deals[_id].amount > address(this).balance) {
            revert InsufficientFunds();
        }
        if (!deals[_id].valid) {
            revert DealNotValid();
        }
        deals[_id].target.transfer(deals[_id].amount);
        emit Confirmed(_id, deals[_id].source, deals[_id].target, deals[_id].amount);
        emit DeletedDeal(_id);
    }

    function getDealType(uint _id) public view returns (Deal memory) {
        return deals[_id];
    }

    function payDeal(uint _id) public payable {
        if (msg.sender != deals[_id].source) {
            revert OnlySource();
        }
        if (msg.value != deals[_id].amount) {
            revert WrongAmount();
        }
        if (deals[_id].payed) {
            revert DealAlreadyPaid();
        }

        deals[_id].payed = true;
        emit Payed(_id);
    }

    // Function to discard dispute on a deal, callable only by the owner
    function discardDeal(uint _id) public onlyOwner {
        deals[_id].source.transfer(deals[_id].amount);
        emit Reimbursed(_id);
        delete deals[_id];
        emit DeletedDeal(_id);
    }

    // Function to complete a dispute and pay the right side, callable only by the owner
    function completeAndPay(uint _id) public onlyOwner {
        deals[_id].target.transfer(deals[_id].amount);
        emit Confirmed(_id, deals[_id].source, deals[_id].target, deals[_id].amount);
        delete deals[_id];
        emit DeletedDeal(_id);
    }

    // Obtain locally deal information
    function getDeal(uint _id) public view returns (uint, address, address, bool, bool, bool) {
        if (!deals[_id].valid) {
            revert InvalidDeal();
        }

        return (
            deals[_id].amount,
            deals[_id].source,
            deals[_id].target,
            deals[_id].sourceConfirmation,
            deals[_id].targetConfirmation,
            deals[_id].payed
        );
    }

    // Big red button to stop the deal in case of exotic events
    function destroySmartDeal(address payable _to) public onlyOwner {
        selfDestructInitiated = true;
        selfdestruct(_to);
    }

    function deleteDeal(uint dealID) external{
        delete deals[dealID];
    }


    
}




