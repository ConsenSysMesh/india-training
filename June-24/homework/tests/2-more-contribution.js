const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

const addresses = require('../../../addresses.json');

const EthereumTx = require('ethereumjs-tx');

const Contract = require('./Example.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var jsonA = fs.readFileSync('signer1', 'utf8');
var walletA  = Wallet.fromV3(jsonA, 'dnovy');

var jsonB = fs.readFileSync('signer2', 'utf8');
var walletB  = Wallet.fromV3(jsonB, 'dnovy');

var abi = JSON.parse(Contract.abi);
var contractAddress = Contract.address;

var instance = new web3.eth.Contract(abi, contractAddress);

var nonceA, nonceB, gasPrice, oldBalance;

web3.eth.getTransactionCount(walletA.getChecksumAddressString())
.then((numberOfTxs) => {
  nonceA = numberOfTxs;
  return web3.eth.getTransactionCount(walletB.getChecksumAddressString());
})
.then((numberOfTxs) => {
  nonceB = numberOfTxs;
  return web3.eth.getGasPrice();
})
.then((price) => {
  gasPrice = web3.utils.toBN(price);
  var contribution = web3.utils.toBN(web3.utils.toWei('1000', 'szabo'));
  return sendTx(walletA, '0x0', nonceA, contribution);
})
.then((tx) => {
  return instance.methods.getContributorAmount(walletA.getChecksumAddressString()).call();
})
.then((result) => {
  if (result != web3.utils.toWei('1400', 'szabo')) {
    throw new Error(colors.red('TEST 2 ERROR: Wrong contribution stored for first contributor: ' + result));
  }
  console.log(colors.green('TEST 2 OK!'));
})
.catch((ex) => {
  console.log(ex);
});

function sendTx(wallet, encodedCall, nonce, value) {
  var gasLimit = 2000000;
  var txParams = {
    nonce:    '0x' + nonce.toString(16),
    gasPrice: '0x' + gasPrice.toString(16),
    gasLimit: '0x' + gasLimit.toString(16),
    data:            encodedCall,
    to:              contractAddress,
    value:    '0x' + value.toString(16)
  };
  var tx = new EthereumTx(txParams);
  tx.sign(wallet.getPrivateKey());
  var strTx = '0x' + tx.serialize().toString('hex');
  return web3.eth.sendSignedTransaction(strTx);
}
