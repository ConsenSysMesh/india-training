const Web3 = require('web3');
const Contract = require('./EventContract.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.WebsocketProvider('http://gyaan.network:8546'));

var abi = JSON.parse(Contract.abi);

var instance = new web3.eth.Contract(abi, Contract.address);
instance.events.ChangedValue((err, result) => {
  console.log(JSON.stringify(result));
});
