const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

const addresses = require('../../addresses.json');

const EthereumTx = require('ethereumjs-tx');

const Contract = require('./QuoteRegistry.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var jsonA = fs.readFileSync('walletA.json', 'utf8');
var walletA  = Wallet.fromV3(jsonA, 'something');

var jsonB = fs.readFileSync('walletB.json', 'utf8');
var walletB  = Wallet.fromV3(jsonB, 'something');

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
  return instance.methods.owner().call();
})
.then((result) => {
  for (var i = 0; i < addresses.length; i++) {
    var addr = ('' + addresses[i].address).toLowerCase();
    var res  = ('' + result).toLowerCase();
    if (addr == res) {
      return Promise.resolve(addresses[i].name);
    }
  }
  return Promise.reject(colors.red('\n\tContract owner unknown: ' + res + '\n'));
})
.then((name) => {
  console.log(colors.black('\n\n\tOwner name: ') + colors.green(name + '\n\n'));
  console.log(colors.green('\tCalling "register" from walletA...'));
  var encodedCall = instance.methods.register('some fun quote').encodeABI();
  return sendTx(walletA, encodedCall, nonceA, 0);
})
.then((tx) => {
  nonceA++;
  console.log(colors.green('\tCalling "register" from walletB...'));
  var encodedCall = instance.methods.register('some very serious quote').encodeABI();
  return sendTx(walletB, encodedCall, nonceB, 0);
})
.then((tx) => {
  nonceB++;
  console.log(colors.green('\tCalling "register" from walletA again...'));
  var encodedCall = instance.methods.register('just another quote').encodeABI();
  return sendTx(walletA, encodedCall, nonceA, 0);
})
.then((tx) => {
  nonceA++;
  return instance.methods.ownership('some fun quote').call();
})
.then((ownership) => {
  console.log('\tChecking ownership of "some fun quote"...');
  var addr = walletA.getChecksumAddressString().toLowerCase();
  var owner = ('' + ownership).toLowerCase();
  if (addr == owner) {
    return instance.methods.ownership('some very serious quote').call();
  } else {
    return Promise.reject('Failed ownership. Should be ' + addr + ' but was ' + owner);
  }
})
.then((ownership) => {
  console.log('\tChecking ownership of "some very serious quote"...');
  var addr = walletB.getChecksumAddressString().toLowerCase();
  var owner = ('' + ownership).toLowerCase();
  if (addr == owner) {
    return instance.methods.ownership('just another quote').call();
  } else {
    return Promise.reject('Failed ownership. Should be ' + addr + ' but was ' + owner);
  }
})
.then((ownership) => {
  console.log('\tChecking ownership of "just another quote"...');
  var addr = walletA.getChecksumAddressString().toLowerCase();
  var owner = ('' + ownership).toLowerCase();
  if (addr == owner) {
    return Promise.resolve();
  } else {
    return Promise.reject('Failed ownership. Should be ' + addr + ' but was ' + owner);
  }
})
.then(() => {
  console.log(colors.green("\n\t=========> Register working fine! <=============\n"));
})
.catch((ex) => {
  console.log(ex);
});

function sendTx(wallet, encodedCall, nonce, value) {
  var gasLimit = 200000;
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
