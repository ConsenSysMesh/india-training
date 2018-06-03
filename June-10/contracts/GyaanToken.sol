pragma solidity ^0.4.20;

library SafeMath {
  function mul(uint a, uint b) internal pure returns (uint) {
    uint c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint a, uint b) internal pure returns (uint) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint a, uint b) internal pure returns (uint) {
    assert(b <= a);
    return a - b;
  }

  function add(uint a, uint b) internal pure returns (uint) {
    uint c = a + b;
    assert(c >= a);
    return c;
  }

  function max64(uint64 a, uint64 b) internal pure returns (uint64) {
    return a >= b ? a : b;
  }

  function min64(uint64 a, uint64 b) internal pure returns (uint64) {
    return a < b ? a : b;
  }

  function max256(uint256 a, uint256 b) internal pure returns (uint256) {
    return a >= b ? a : b;
  }

  function min256(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }

}

contract Owned {

  address public owner = msg.sender;

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

}

contract ERC223Receiver {
  function tokenFallback(address _from, uint _value, bytes _data) public;
}

contract GyaanToken is Owned {

  using SafeMath for uint;

  event Transfer(address indexed _from, address indexed _to, uint _value);

  mapping (address => uint) balances;

  string public name        = "Gyaan Token";
  string public symbol      = "GYA";
  uint8  public decimals    = 0;
  uint   public totalSupply = 500000;

  function GyaanToken() public {
    balances[msg.sender] = totalSupply;
  }

  function isContract(address target) internal view returns (bool) {
    uint codeLength;
    assembly {
      codeLength := extcodesize(target)
    }
    return codeLength > 0;
  }

  function transfer(address _to, uint _value, bytes _data) public {

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);

    if(isContract(_to)) {
      ERC223Receiver receiver = ERC223Receiver(_to);
      receiver.tokenFallback(msg.sender, _value, _data);
    }

    Transfer(msg.sender, _to, _value);

  }

  function transfer(address _to, uint _value) public {

    bytes memory empty;

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);

    if(isContract(_to)) {
      ERC223Receiver receiver = ERC223Receiver(_to);
      receiver.tokenFallback(msg.sender, _value, empty);
    }

    Transfer(msg.sender, _to, _value);

  }

  function balanceOf(address _owner) public view returns (uint) {
    return balances[_owner];
  }

}
