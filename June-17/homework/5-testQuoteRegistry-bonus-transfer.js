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
  return Promise.reject('Could not find owner of address');
})
.then((name) => {
  console.log(colors.black('\n\n\tOwner name: ') + colors.green(name + '\n\n'));
  console.log(colors.green('\tCalling "tranfer" WITH fee...'));
  var encodedCall = instance.methods.transfer('just another quote', walletA.getChecksumAddressString()).encodeABI();
  var fee = web3.utils.toBN(web3.utils.toWei('0.5', 'ether'));
  return sendTx(walletA, encodedCall, nonceA, fee);
})
.then((tx) => {
  console.log(colors.green('\tChecking ownership of "just another quote"...'));
  return instance.methods.ownership("just another quote").call();
})
.then((ownership) => {
  var addr  = walletB.getChecksumAddressString().toLowerCase();
  var owner = ('' + ownership).toLowerCase();
  if (addr == owner) {
    return Promise.resolve(colors.green('\t====> All Good <==='));
  } else {
    return Promise.resolve(colors.red('\tERROR: allowed to transfer ownership of something that is not yours'));
  }
})
.then((msg) => {
  console.log(msg);
})
.catch((ex) => {
  console.log(colors.green('\t===> Throw exception, all good! <===='));
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
