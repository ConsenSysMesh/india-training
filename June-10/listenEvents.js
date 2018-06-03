const Web3 = require('web3');
const Contract = require('./EventContract.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var abi = JSON.parse(Contract.abi);

var instance = new web3.eth.Contract(abi, Contract.address);

var timer = setInterval(function() {
  instance.getPastEvents('ChangedValue', function(err, result) {
    if (result.length != 0) {
      console.log(JSON.stringify(result));
      clearInterval(timer);
    }
  });
}, 1000);

