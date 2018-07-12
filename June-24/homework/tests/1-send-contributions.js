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

var nonceA, nonceB, gasPrice, oldBalance, owner;

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
  return instance.methods.owner().call();
})
.then((result) => {
  owner = result;
  for (var i = 0; i < addresses.length; i++) {
    var addr = ('' + addresses[i].address).toLowerCase();
    var res  = ('' + result).toLowerCase();
    if (addr == res) {
      return Promise.resolve(addresses[i].name);
    }
  }
  return Promise.resolve('UNKNOWN: ' + result);
})
.then((name) => {
  console.log(colors.green('Owner name: ' + name + ' ' + owner));
  var contribution = web3.utils.toBN(web3.utils.toWei('400', 'szabo'));
  return sendTx(walletA, '0x0', nonceA, contribution);
})
.then((tx) => {
  nonceA++;
  var contribution = web3.utils.toBN(web3.utils.toWei('600', 'szabo'));
  return sendTx(walletB, '0x0', nonceB, contribution);
})
.then((tx) => {
  nonceB++;
  return instance.methods.listContributors().call();
})
.then((result) => {
  if (result.length != 2) {
    throw new Error(colors.red('TEST 1 ERROR: Wrong num of contributors. Expected 2, got ' + result.length));
  }
  var foundA = foundB = false;
  for (var i = 0; i < result.length; i++) {
    if (result[i] === walletA.getChecksumAddressString()) {
      foundA = true;
    }
    if (result[i] === walletB.getChecksumAddressString()) {
      foundB = true;
    }
  }
  if (!foundA || !foundB) {
    throw new Error(colors.red('TEST 1 ERROR: List of contributors seems to be wrong: ' + JSON.stringify(result)));
  }
  return instance.methods.getContributorAmount(walletA.getChecksumAddressString()).call();
})
.then((result) => {
  if (result != web3.utils.toWei('400', 'szabo')) {
    throw new Error(colors.red('TEST 1 ERROR: Wrong contribution stored for first contributor: ' + result));
  }
  return instance.methods.getContributorAmount(walletB.getChecksumAddressString()).call();
})
.then((result) => {
  if (result != web3.utils.toWei('600', 'szabo')) {
    throw new Error(colors.red('TEST 1 ERROR: Wrong contribution stored for second contributor: ' + result));
  }
  console.log(colors.green('TEST 1 OK!'));
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
