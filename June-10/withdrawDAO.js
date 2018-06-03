const Prompt = require('prompt');
const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

const EthereumTx = require('ethereumjs-tx');

const DAOContract = require('../data/TheDAO.js');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var schema = {
    properties: {
        walletFilename: {
            description: colors.yellow('Wallet filename'),
            //validator: /^[a-zA-Z0-9\-]+$/,
            //warning: 'Wallet name must be only letters, numbers or dashes',
            required: true,
        },
        password: {
            description: colors.yellow('Wallet password'),
            hidden: true,
            required: true,
        },
    }
};

Prompt.start();
Prompt.get(schema, function(err, result) {

  var strJson = fs.readFileSync(result.walletFilename, 'utf8');
  var wallet  = Wallet.fromV3(strJson, result.password);

  var abi = JSON.parse(DAOContract.abi);

  var instance = new web3.eth.Contract(abi, DAOContract.address);

  var encodedCall = instance.methods.withdraw().encodeABI();

  var nonce, gasPrice;

  web3.eth.getTransactionCount(wallet.getChecksumAddressString())
  .then((numberOfTxs) => {
    nonce = numberOfTxs;
    return web3.eth.getGasPrice();
  })
  .then((price) => {
    gasPrice = web3.utils.toBN(price);
    var gasLimit = 40000;
    var txParams = {
      nonce:    '0x' + nonce.toString(16),
      gasPrice: '0x' + gasPrice.toString(16),
      gasLimit: '0x' + gasLimit.toString(16),
      data:            encodedCall,
      to:              DAOContract.address
    };

    var tx = new EthereumTx(txParams);
    tx.sign(wallet.getPrivateKey());

    var strTx = '0x' + tx.serialize().toString('hex'); // PAY CLOSE ATENTION TO THE '0x'!!!!!

    web3.eth.sendSignedTransaction(strTx)
    .once('transactionHash', function(txid) {
      console.log(colors.green('\n\ttxid: ' + txid + '\n'));
    })
  })
});
