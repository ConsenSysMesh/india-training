pragma solidity ^0.4.20;

contract Owned {

  address public owner = msg.sender;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  function setOwner(address _newOwner) {
    owner = _newOwner;
  }

}

contract Parity is Owned {

  function () public payable {
  }


  function withdraw() onlyOwner {
    require(this.balance > 0);
    msg.sender.transfer(this.balance);
  }

}
