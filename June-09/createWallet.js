var Prompt = require('prompt');
var fs     = require('fs');
var bip39  = require("bip39");
var hdkey  = require('ethereumjs-wallet/hdkey');
var Wallet = require('ethereumjs-wallet');
var colors = require('colors/safe');

var schema = {
    properties: {
        walletName: {
            description: colors.yellow('Filename to save your wallet'),
            //validator: /^[a-zA-Z0-9\-]+$/,
            //warning: 'Wallet name must be only letters, numbers or dashes',
            required: true,
        },
        password: {
            description: colors.yellow('Password to encrypt your wallet'),
            hidden: true,
            required: true,
        },
    }
};

Prompt.start();
Prompt.get(schema, function(err, result) {
    var mnemonic = bip39.generateMnemonic();
    var prewallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    var path = "m/44'/60'/0'/0/0";
    var wallet = prewallet.derivePath(path).getWallet();
    var address = wallet.getAddress().toString("hex");
    var addressWithChecksum = wallet.getChecksumAddressString();
    var json = wallet.toV3(result.password);
    fs.writeFileSync(result.walletName, JSON.stringify(json));
    console.log(colors.white('\nSeed: ' + mnemonic + '\n'));
    console.log(colors.white('\nAddress: ' + addressWithChecksum + '\n'));
    //console.log(colors.white('\nPrivkey: ' + wallet.getPrivateKey().toString('hex') + '\n'));

    // certifies that wallet is perfect
    var strJson   = fs.readFileSync(result.walletName, 'utf8');
    var wallet2 = Wallet.fromV3(JSON.parse(strJson), result.password);
    var address2  = wallet2.getAddress().toString("hex");

    if (address2 != address) {
        console.log(colors.red('\nError generating wallet; addresses dont match'));
    } else {
        console.log(colors.yellow('\nWallet created successfuly and saved as "' + result.walletName + '"\n'));
    }
});
