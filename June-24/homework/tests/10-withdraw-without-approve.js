const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');
const EthereumTx = require('ethereumjs-tx');
const Contract   = require('./Example.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var abi = JSON.parse(Contract.abi);
var contractAddress = Contract.address;
var instance = new web3.eth.Contract(abi, contractAddress);

var gasPrice = web3.utils.toBN('100000000000');
var json = fs.readFileSync('p1', 'utf8');
var wallet = Wallet.fromV3(json, 'dnovy');

var valueToWithdraw = web3.utils.toWei('90', 'szabo');

var encoded = instance.methods.withdraw(valueToWithdraw).encodeABI();
var level = 0;
var nonce, balance;
web3.eth.getTransactionCount(wallet.getChecksumAddressString())
.then((result) => {
  nonce = result;
  return web3.eth.getBalance(wallet.getChecksumAddressString());
})
.then((result) => {
  balance = result;
  var tx = buildTx(wallet, encoded, nonce, 0);
  level = 1;
  return web3.eth.sendSignedTransaction(tx);
})
.then((txid) => {
  // function didn't thrown. But ok, I can check wallet balance to see if it
  // received something back.
  return web3.eth.getBalance(wallet.getChecksumAddressString());
})
.then((result) => {
  if (result.gt(balance)) {
    console.log(colors.red('TEST 10 ERROR: Allowed to withdraw value without having proposal approved'));
  } else {
    console.log(colors.green('TEST 10 OK!'));
  }
})
.catch((ex) => {
  if (level == 1) {
    console.log(colors.green('TEST 10 OK!'));
  } else {
    console.log(ex);
  }
})

function buildTx(wallet, encodedCall, nonce, value) {
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
  return '0x' + tx.serialize().toString('hex');
}
