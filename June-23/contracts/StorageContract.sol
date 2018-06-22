pragma solidity ^0.4.20;


contract Owned {
  address public owner = msg.sender;
  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
}

contract StorageContract is Owned {

  uint public value;

  function setValue(uint _newValue) public onlyOwner {
    value = _newValue;
  }

  function transferOwnership(address _newOwner) public onlyOwner {
    owner = _newOwner;
  }

}

contract UseStorage is Owned {

  address public storageAddress;

  function UseStorage() public {
    StorageContract st = new StorageContract();
    storageAddress = address(st);
  }

  function getValue() public returns (uint) {
    return StorageContract(storageAddress).value();
  }

  function setValue(uint _newValue) public onlyOwner {
    StorageContract(storageAddress).setValue(_newValue);
  }

  /*
   * Before calling this function, the new version of this contract
   * should be deployed! Then, the new version address should be
   * specified as parameter for this function.
   */
  function kill(address _newStorageOwner) public onlyOwner {
    StorageContract(storageAddress).transferOwnership(_newStorageOwner);
    selfdestruct(owner);
  }

}
