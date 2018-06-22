const Prompt = require('prompt');
const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

const EthereumTx = require('ethereumjs-tx');

const promisify = require('bluebird').promisify;

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
        contractBinary: {
            description: colors.yellow('Contract binary'),
            required: true,
        },
    }
};

Prompt.start();
Prompt.get(schema, function(err, result) {

  if (!fs.existsSync(result.walletFilename)) {
    console.log(colors.red('\n\tWallet file not found: ' + result.walletFilename + '\n'));
    process.exit();
  }

  var strJson = fs.readFileSync(result.walletFilename, 'utf8');
  var wallet  = Wallet.fromV3(strJson, result.password);
  var binary = result.contractBinary;

  var nonce, gasPrice;

  promisify(web3.eth.getTransactionCount)(wallet.getChecksumAddressString())
  .then((numberOfTxs) => {
    nonce = numberOfTxs;
    return promisify(web3.eth.getGasPrice)();
  })
  .then((price) => {
    gasPrice = web3.utils.toBN(price);
    var gasLimit = 2000000;
    var txParams = {
      nonce:    '0x' + nonce.toString(16),
      gasPrice: '0x' + gasPrice.toString(16),
      gasLimit: '0x' + gasLimit.toString(16),
      data:     '0x' + binary,
    };

    var tx = new EthereumTx(txParams);
    tx.sign(wallet.getPrivateKey());

    var strTx = '0x' + tx.serialize().toString('hex'); // PAY CLOSE ATENTION TO THE '0x'!!!!!

    web3.eth.sendSignedTransaction(strTx)
    .on('transactionHash', function(hash) {
      console.log(colors.green('\ttxid: ' + hash));
    })
    .on('receipt', function(receipt) {
      console.log(colors.green("\tContract address: " + receipt.contractAddress));
    })
    .on('error', function(error) {
      console.log("ERROR" + error);
    })
    .catch(function(exception) {
      console.log('catch: ' + exception);
    })
  });
});

