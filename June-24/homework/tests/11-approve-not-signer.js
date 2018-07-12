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
var json = fs.readFileSync('p8', 'utf8');
var wallet = Wallet.fromV3(json, 'dnovy');

web3.eth.getTransactionCount(wallet.getChecksumAddressString())
.then((nonce) => {
  var encoded = instance.methods.approve(wallet.getChecksumAddressString()).encodeABI();
  var tx = buildTx(wallet, encoded, nonce, 0);
  level = 1;
  return web3.eth.sendSignedTransaction(tx);
})
.then((result) => {
  level = 2;
  return instance.methods.getSignerVote(wallet.getChecksumAddressString(), wallet.getChecksumAddressString()).call();
})
.then((vote) => {
  if (vote == 0) {
    console.log(colors.green('TEST 11 OK!'));
  } else {
    console.log(colors.red('TEST 11 ERROR: Allowed non-signer to vote!'));
  }
})
.catch((ex) => {
  if (level == 1) {
    console.log(colors.green('TEST 11 OK!'));
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
