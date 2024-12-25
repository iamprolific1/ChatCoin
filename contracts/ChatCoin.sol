//SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChatCoin is ERC20, Ownable {

    constructor (uint256 initialSupply) ERC20('ChatCoin', 'CHAT') Ownable(msg.sender) {
        // mint initial supply to the contract deployer
        _mint(msg.sender, initialSupply);
    }

    // add a mint function to mint more tokens to the owner
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // add a burn function to burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}