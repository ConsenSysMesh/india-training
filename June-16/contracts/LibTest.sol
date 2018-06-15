pragma solidity ^0.4.20;

library MyLib {
  function add(uint a, uint b) returns (uint) {
    return a + b;
  }
}

contract MyContract {
  function libtest() returns (uint) {
    return MyLib.add(10, 12);
  }
}
