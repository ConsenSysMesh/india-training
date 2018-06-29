pragma solidity ^0.4.20;

contract StorageContract {
  function value() public returns (uint);
  function setValue(uint _newValue) public;
  function transferOwnership(address _newOwner) public;
}

contract NewVersionStorageContract {
  address public storageAddress;

  function NewVersionStorageContract(address _storageAddress) {
    storageAddress = _storageAddress;
  }

  function makeUseOfValue() public {
    uint value = StorageContract(storageAddress).value();
    StorageContract(storageAddress).setValue(value + 10);
  }

}
