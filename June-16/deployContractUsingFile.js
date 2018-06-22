const Prompt = require('prompt');
const fs     = require('fs');
const Wallet = require('ethereumjs-wallet');
const colors = require('colors/safe');
const solc   = require('solc');
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
        contractFilename: {
            description: colors.yellow('Contract filename'),
            required: true,
        },
        contractName: {
            description: colors.yellow('Contract name'),
            required: true,
        }
    }
};

Prompt.start();
Prompt.get(schema, function(err, result) {

  if (!fs.existsSync(result.walletFilename)) {
    console.log(colors.red('\n\tWallet file not found: ' + result.walletFilename + '\n'));
    process.exit();
  }

  if (!fs.existsSync(result.contractFilename)) {
    console.log(colors.red('\n\tContract file not found: ' + result.contractFilename + '\n'));
    process.exit();
  }

  var strJson = fs.readFileSync(result.walletFilename, 'utf8');
  var wallet = Wallet.fromV3(strJson, result.password);

  var contractCode = fs.readFileSync(result.contractFilename, 'utf8');

  var input = {'Input': contractCode}
  var output = solc.compile({sources: input}, 1);
  if (typeof output.errors != 'undefined') {
    console.log(JSON.stringify(output.errors));
    process.exit();
  }
  var contractName = result.contractName;
  var contractBinary = output.contracts['Input:' + contractName].bytecode;
  var contractABI    = output.contracts['Input:' + contractName].interface;
  var abi = JSON.stringify(contractABI);
  abi = abi.substring(1);
  abi = abi.substring(0, abi.length - 1);

  var nonce, gasPrice;

  web3.eth.getTransactionCount(wallet.getChecksumAddressString())
  .then((numberOfTxs) => {
    nonce = numberOfTxs;
    return web3.eth.getGasPrice();
  })
  .then((price) => {
    gasPrice = web3.utils.toBN(price);
    var gasLimit = 2000000;
    var txParams = {
      nonce:    '0x' + nonce.toString(16),
      gasPrice: '0x' + gasPrice.toString(16),
      gasLimit: '0x' + gasLimit.toString(16),
      data:     '0x' + contractBinary,
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
      saveFile(contractName, abi, receipt.contractAddress);
      console.log(colors.yellow('Saved deployed contract info into the file ' + contractName + '.js'));
    })
    .on('error', function(error) {
      console.log("ERROR" + error);
    })
    .catch(function(exception) {
      console.log('catch: ' + exception);
    })
  });

});

function saveFile(contractName, abi, address) {
  var sabi = 'var abi = \'' + abi + '\';\n';
  var sadd = 'var address = \'' + address + '\';\n';
  var finn = 'module.exports = {abi: abi, address: address};\n';
  var all = sabi + sadd + finn;
  fs.writeFileSync(contractName + '.js', all);
}
