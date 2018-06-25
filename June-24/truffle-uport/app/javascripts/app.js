import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { Connect, SimpleSigner } from 'uport-connect'

var mnid = require('mnid');

import registryArtifacts from '../../build/contracts/SimpleRegistry.json'
var SimpleRegistry = contract(registryArtifacts);

var uport;
var account;

window.App = {
  start: function() {
    var self = this;
    SimpleRegistry.setProvider(window.web3.currentProvider);
  },

  login: function() {
    // Request credentials to login
    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: true // We want this if we want to recieve credentials
    })
    .then((credentials) => {
      console.log(credentials, 'credentials');
      account = mnid.decode(credentials.networkAddress).address;
    });
  },

  refreshGet: function() {
    var self = this;

    SimpleRegistry.deployed().then(function(instance) {
      return instance.get.call('test');
    }).then(function(value) {
      var getResult = document.getElementById("getResult");
      getResult.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
    });
  },

  setNewValue: function() {
    var self = this;

    var newValue = parseInt(document.getElementById("newValue").value);

    SimpleRegistry.deployed().then(function(instance) {
      return instance.register('test', newValue, {from: account});
    })
    .then(function(result) {
      // result.tx = tx hash
      // result.receipt
      // result.logs
      console.log(result);
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        if (log.event == "NewValueRegistered") {
          console.log('Found NewValueSet', result.logs[i]);
        }
      }
    }).catch(function(e) {
      console.log(e);
    });
  }
};

window.addEventListener('load', function() {
  uport = new Connect('Class Example', {
    clientId: '2ohHGjQh7hMpSZFCcznB5vmscJPckTJn7Jj',
    network: 'rinkeby',
    //accountType: 'segregated',
    signer: SimpleSigner('cba0874881a754b1a4844308e1a5b82a5bc773add4a6e5f0d35f5c55c2eac53d')
  })


  window.web3 = uport.getWeb3();

  App.start();
});















