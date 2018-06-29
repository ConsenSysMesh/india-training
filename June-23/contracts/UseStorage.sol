pragma solidity ^0.4.20;

contract Storage {
  function value() public returns(uint);
  function transferOwnership(address _newOwner) public;
}

contract UseStorage {

  address public storageAddress;


}
