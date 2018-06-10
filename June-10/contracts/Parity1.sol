pragma solidity ^0.4.20;

contract Parity1 {

  address public owner = msg.sender;

  function () public payable {
  }


  function setOwner(address _newOwner) public {
    owner = _newOwner;
  }

  function withdraw() public {
    if (msg.sender == owner) {
      msg.sender.transfer(this.balance);
    }
  }

}
