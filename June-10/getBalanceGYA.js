const Web3     = require('web3');
const GYAContract = require('../data/GyaanToken.js');
const colors   = require('colors/safe');
const Prompt = require('prompt');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var abi = JSON.parse(GYAContract.abi);


var schema = {
    properties: {
        address: {
            description: colors.yellow('Address'),
            //validator: /^[a-zA-Z0-9\-]+$/,
            //warning: 'Wallet name must be only letters, numbers or dashes',
            required: true,
        },
    }
};

Prompt.start();
Prompt.get(schema, function(err, result) {
  var instance = new web3.eth.Contract(abi, GYAContract.address);
  instance.methods.balanceOf(result.address).call(function(err, result) {
    console.log(colors.green('\n\tBalance: ' + result + ' GYAs\n'));
  });
});
