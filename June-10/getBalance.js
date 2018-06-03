const Prompt = require('prompt');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

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
  web3.eth.getBalance(result.address)
  .then(function(balance) {
    console.log(colors.green('\n\tBalance: ' + web3.utils.fromWei(balance, 'ether') + '\n'));
  })
});
