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
var json = fs.readFileSync('signer3', 'utf8');
var wallet = Wallet.fromV3(json, 'dnovy');

json = fs.readFileSync('p5', 'utf8');
var walletB = Wallet.fromV3(json, 'dnovy');
var level = 0;

web3.eth.getTransactionCount(wallet.getChecksumAddressString())
.then((nonce) => {
  var encoded = instance.methods.approve(walletB.getChecksumAddressString()).encodeABI();
  var tx = buildTx(wallet, encoded, nonce, 0);
  level = 1;
  return web3.eth.sendSignedTransaction(tx);
})
.then((result) => {
  level = 2;
  return instance.getPastEvents('ProposalApproved', {fromBlock:'latest', toBlock:'latest'});
})
.then((result) => {
  level = 3;
  if (result.length == 0) {
    throw new Error(colors.red('TEST 20 ERROR: Event ProposalApproved was not emitted'));
  } else {
    return web3.eth.getTransactionCount(walletB.getChecksumAddressString());
  }
})
.then((nonce) => {
  level = 4;
  var valueToWithdraw = web3.utils.toWei('110', 'szabo');
  var encoded = instance.methods.withdraw(valueToWithdraw).encodeABI();
  var tx = buildTx(walletB, encoded, nonce, 0);
  return web3.eth.sendSignedTransaction(tx);
})
.then((txid) => {
  level = 5;
  return instance.getPastEvents('WithdrawPerformed', {fromBlock:'latest', toBlock:'latest'});
})
.then((result) => {
  level = 6;
  if (result.length == 0) {
    throw new Error(colors.red('TEST 20 ERROR: Event WithdrawPerformed was not emitted'));
  } else {
    console.log(colors.green('TEST 20 OK!'));
  }
})
.catch((ex) => {
  console.log('level:' + level);
  console.log(colors.red('TEST 20 ERROR: Function was not supposed to throw'));
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
