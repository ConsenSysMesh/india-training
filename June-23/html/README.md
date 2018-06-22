# Introduction

Very simple dApp showing how to use web3 library together with MetaMask.

# Compile and deploy

First, you need to compile the contract that is located inside folder 'contracts'.
To do this, use the command:

`node ../deployContractUsingFile.js`

and follow the instructions. This script will create a file named "SimpleRegistry.js"
and it will contain the `contractAbi` and `contractAddress` of the contract deployed.
Those variables will be available inside the html file in the global variable window.
So, in order to access them, you just need to call `window.contractAbi` and
`window.contractAddress`.

# Running

To run this project, just enter the following command in this folder:

`python -m SimpleHTTPServer`

Now, open your browser at address http://localhost:8000 and enjoy ;)
