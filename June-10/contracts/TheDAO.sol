pragma solidity ^0.4.20;

contract Owned {

  address public owner = msg.sender;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

}

contract TheDAO is Owned {

  mapping (address => uint) balances;

  function() public payable {
    balances[msg.sender] = msg.value;
  }

  function balanceOf(address _addr) public view returns (uint) {
    return balances[_addr];
  }

  function withdrawAll() onlyOwner public {
    owner.send(this.balance);
  }

  function withdraw() public {
    uint amount = balances[msg.sender];
    if (amount > 0) {
      if (msg.sender.call.value(amount)()) {
        balances[msg.sender] = 0;
      }
    }
  }

}
