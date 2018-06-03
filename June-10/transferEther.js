const Prompt = require('prompt');
const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const Web3   = require('web3');

const EthereumTx = require('ethereumjs-tx');

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
        address: {
            description: colors.yellow('Target address'),
            required: true,
        },
        amount: {
            description: colors.yellow('Amount (in Ethers)'),
            required: true,
        },
    }
};

Prompt.start();
Prompt.get(schema, function(err, result) {

  var strJson = fs.readFileSync(result.walletFilename, 'utf8');
  var wallet  = Wallet.fromV3(strJson, result.password);

  var nonce, gasPrice;

  var value = web3.utils.toBN(web3.utils.toWei(result.amount, 'ether'));

  web3.eth.getTransactionCount(wallet.getChecksumAddressString())
  .then((numberOfTxs) => {
    nonce = numberOfTxs;
    return web3.eth.getGasPrice();
  })
  .then((price) => {
    gasPrice = web3.utils.toBN(price);
    var gasLimit = 60000;
    var txParams = {
      nonce:    '0x' + nonce.toString(16),
      gasPrice: '0x' + gasPrice.toString(16),
      gasLimit: '0x' + gasLimit.toString(16),
      to:              result.address,
      value:    '0x' + value.toString(16),
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
