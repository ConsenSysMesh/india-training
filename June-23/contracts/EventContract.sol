pragma solidity ^0.4.20;

contract EventContract {

   uint public value = 12345;

   event ChangedValue(address indexed _addr, uint _newValue);

   function setValue(uint _newValue) public {
      value = _newValue;
      ChangedValue(msg.sender, _newValue);
   }

}
