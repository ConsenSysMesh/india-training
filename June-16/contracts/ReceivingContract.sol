pragma solidity ^0.4.20;

contract ReceivingContract {

  mapping (address => uint) public balances;

  function () payable public {
     balances[msg.sender] = msg.value;
  }

}
