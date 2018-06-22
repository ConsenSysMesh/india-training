pragma solidity ^0.4.20;

contract SimpleRegistry {

  mapping (string => uint) registry;

  function register(string _key, uint _value) public {
    registry[_key] = _value;
  }

  function get(string _key) public view returns (uint) {
    return registry[_key];
  }

}
