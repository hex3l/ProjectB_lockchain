// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import "./DealHandler.sol";

interface I {
    function getDealType(uint dealID) external view returns (Deal memory);
    // function deals(uint dealID) external view returns (Deal memory);
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
}

contract GoldenNugget is ERC20, ERC20Pausable, Ownable, ERC20Permit {

I dealInterface;
// GreeterInterface GreeterContract = GreeterInterface(OTHER_CONTRACT);
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
    constructor(address initialOwner, address dealInterfaceAddress)
        ERC20("GoldenNugget", "GLD")
        Ownable(initialOwner)
        ERC20Permit("GoldenNugget")
    {
        dealInterface = I(dealInterfaceAddress);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(uint dealID, bool flag) public returns (bool ){
        // require(DealHandler(0xF7d6Cf0B3fA5779692deD8862c495091a8035e38).deals(dealID).valid == true, "Deal has not been reviewed yet");
         require(dealInterface.getDealType(dealID).source == msg.sender, "Not the original buyer!");
        // require(deals[dealID].payed == true, "Deal has not been payed yet");
        // require(deals[dealID].valid == true, "Deal has not been validated yet");

        require(dealInterface.getDealType(dealID).valid == true, "Deal has not been reviewed yet");
        require(dealInterface.getDealType(dealID).sourceConfirmation == true, "Deal has not been confirmed yet");
        require(dealInterface.getDealType(dealID).targetConfirmation == true, "Deal has not been confirmed yet");
         _mint(dealInterface.getDealType(dealID).source, 1); //mint 1 GDN tokens for the buyer TOCHECK if it's 2 or 1
         if (flag)
         _mint(dealInterface.getDealType(dealID).target, 2); //mint 1 GDN token for the seller, 2 if good review TODO
         else {
            _mint(dealInterface.getDealType(dealID).target, 1); //mint 1 GDN token for the seller, 2 if good review TODO
         }
        return false;
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }

}
