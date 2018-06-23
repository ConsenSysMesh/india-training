// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var WalletProvider = require("truffle-wallet-provider");

// Read and unlock keystore
var keystore = require('fs').readFileSync(<your wallet file>).toString();
var pass = <enter your wallet password>
var wallet = require('ethereumjs-wallet').fromV3(keystore, pass);

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    gyaan: {
      provider: () => { return new WalletProvider(wallet,"http://gyaan.network:8545")},
      gas: "4600000",
      network_id: "17"
    }
  }
};
