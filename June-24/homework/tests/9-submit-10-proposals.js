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

var wallets = [];
var proposalTxs = [];
for (var i = 0; i < 11; i++) {
  //console.log('loading ' + i);
  var json = fs.readFileSync('p' + i, 'utf8');
  var wallet = Wallet.fromV3(json, 'dnovy');
  wallet.forIndex = i;
  wallets.push(wallet);
}

const buildProposal = wallet =>
  new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(wallet.getChecksumAddressString())
    .then((numberOfTxs) => {
      var proposal = web3.utils.toBN(web3.utils.toWei('200', 'szabo'));
      var encoded = instance.methods.submitProposal(proposal).encodeABI();
      var tx = buildTx(wallet, encoded, numberOfTxs, 0);
      tx.forIndex = wallet.forIndex;
      proposalTxs.push(tx);
      //console.log('index[' + wallet.forIndex + '] nonce[' + numberOfTxs + ']');
      resolve();
    })
    .catch((ex) => {
      reject(ex);
    })
  })

const sendTx = tx =>
  new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(tx)
    .then((txid) => {
      resolve(txid);
    })
    .catch((ex) => {
      reject(ex);
    })
  })


var promises = [];
for (var i = 1; i < 11; i++) {
  promises.push(buildProposal(wallets[i]));
}
var level = 0;
Promise.all(promises)
.then(() => {
  level = 1;
  promises = [];
  for (var i = 0; i < 9; i++) {
    //console.log('[' + i + '] ' + proposalTxs[i]);
    promises.push(sendTx(proposalTxs[i]));
  }
  return Promise.all(promises);
})
.then(() => {
  level = 2;
  // Should not accept next proposal because contract has not enough funds!
  return web3.eth.sendSignedTransaction(proposalTxs[9]);
})
.then(() => {
  console.log(colors.red('TEST 9 ERROR: Sum of accepted proposals is greater than the total holdings of the contract'));
})
.catch((ex) => {
  if (level == 2) {
    instance.methods.listOpenBeneficiariesProposals().call()
    .then((list) => {
      if (list.length == 10) {
        console.log(colors.green('TEST 9 OK!'));
      } else {
        console.log(colors.red('TEST 9 ERROR: listOpenBeneficiariesProposals returned ' + list.length + ' items, expected 10'));
      }
    })
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
