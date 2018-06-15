const Web3        = require('web3');
const GYAContract = require('./data/GyaanToken.js');
const colors      = require('colors/safe');
const students    = require('./addresses.json');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://gyaan.network:8545'));

var abi = JSON.parse(GYAContract.abi);
var instance = new web3.eth.Contract(abi, GYAContract.address);

var map = new Map();

var promises = [];
for (i = 0; i < students.length; i++) {
  ((i) => {
    promises.push(
      instance.methods.balanceOf(students[i].address.toLowerCase()).call()
      .then((result) => {
        if (parseInt(result) > 0) {
          map.set(result, students[i].name);
        }
        return Promise.resolve(0);
      })
    );
  })(i);
}

Promise.all(promises)
.then(() => {
  var sorted = new Map([...map.entries()].sort((a, b) => {return parseInt(b) - parseInt(a)}));
  console.log(sorted);
});
