const Web3     = require('web3');
const Contract = require('./SimpleContract.js');
const colors   = require('colors/safe');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var abi = JSON.parse(Contract.abi);

var instance = new web3.eth.Contract(abi, Contract.address);

instance.methods.value().call(function(err, result) {
  console.log(colors.green('\n\tValue: ' + result + '\n'));
});

