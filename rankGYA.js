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
        map.set(students[i].name, result);
        return Promise.resolve(0);
      })
    );
  })(i);
}


Promise.all(promises)
.then(() => {
  map[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
  }
  console.log('');
  var counter = 0;
  for (let [key, value] of map) {     // get data sorted
    var ksize = key.length;
    var vsize = (''+value).length;
    var comp = '';
    for (i = 0; i < 40 - ksize - vsize; i++) {
       comp += '-';
    }
    if (counter < 10 && value > 5000) {
      console.log(colors.green('\t' + key + comp + value));
    } else {
      console.log(colors.yellow('\t' + key + comp + value));
    }
    counter++;
  }
  console.log('');
});
