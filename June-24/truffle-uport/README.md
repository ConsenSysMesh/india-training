# Introduction

Truffle project integrated with uPort for logging in and signing transactions.

# Install

This project uses several libs defined in `package.json`. To install them, run:

`npm install`

# Configure and Deploy

Before trying to deploy the contracts, you will need to configure your wallet and
password in the config file `truffle.js`. Also, make sure you have in your `truffle.js`
the network where you're going to deploy your contracts to.

To deploy the contracts to the network just run:

`truffle migrate`

# Run

To run the project:

`npm run dev`

and access it in `http://localhost:8080`.
