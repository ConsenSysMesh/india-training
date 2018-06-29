pragma solidity ^0.4.20;

library MyLib {
  function add(uint a, uint b) public pure returns (uint);
}

contract MyContract {
  function libtest() public pure returns (uint) {
    return MyLib.add(10, 12);
  }
}
