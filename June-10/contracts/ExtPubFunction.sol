pragma solidity ^0.4.20;

contract ExtPubFunction {

  function testExt(uint a, uint b) external returns (uint) {
    return a * b;
  }

  function testPub(uint a, uint b) public returns (uint) {
    return a * b;
  }

}
