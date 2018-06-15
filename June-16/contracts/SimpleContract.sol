pragma solidity ^0.4.20;

contract SimpleContract {

   uint public value = 12345;

   function setValue(uint _newValue) public {
      value = _newValue;
   }

}
