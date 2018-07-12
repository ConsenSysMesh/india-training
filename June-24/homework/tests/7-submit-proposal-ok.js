const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

const addresses = require('../../../addresses.json');

const EthereumTx = require('ethereumjs-tx');

const Contract = require('./Example.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var jsonA = fs.readFileSync('p0', 'utf8');
var walletA = Wallet.fromV3(jsonA, 'dnovy');

var abi = JSON.parse(Contract.abi);
var contractAddress = Contract.address;

var instance = new web3.eth.Contract(abi, contractAddress);

var nonceA, nonceB, gasPrice;

web3.eth.getTransactionCount(walletA.getChecksumAddressString())
.then((numberOfTxs) => {
  nonceA = numberOfTxs;
  return web3.eth.getGasPrice();
})
.then((price) => {
  gasPrice = web3.utils.toBN(price);
  var proposal = web3.utils.toBN(web3.utils.toWei('200', 'szabo'));
  var encoded = instance.methods.submitProposal(proposal).encodeABI();
  return sendTx(walletA, encoded, nonceA, 0);
})
.then((tx) => {
  return instance.methods.listOpenBeneficiariesProposals().call();
})
.then((result) => {
  if (result.length != 1) {
    throw new Error(colors.red('TEST 7 ERROR: Wrong open proposals. Expected 1, got ' + result.length));
  }
  if (result[0] !== walletA.getChecksumAddressString()) {
    throw new Error(colors.red('TEST 7 ERROR: Wrong open proposals. Expected ' + walletA.getChecksumAddressString() + ' got ' + result[0]));
  }
  return instance.methods.getBeneficiaryProposal(result[0]).call();
})
.then((result) => {
  var expected = web3.utils.toWei('200', 'szabo');
  if (result !== expected) {
    throw new Error(colors.red('TEST 7 ERROR: Wrong proposal returned. Expected ' + expected + ' got ' + result));
  }
  console.log(colors.green('TEST 7 OK!'));
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
