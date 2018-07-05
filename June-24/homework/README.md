# Two Weeks Homework

This homework will be composed of two parts: in the first
part, you should develop a smart contract that will be the
heart of this dApp.

In the second part you should develop a web interface to
interact with the contract.

# Contract Description

Take a look at the solidity interface file `AbstractMultiSig.sol`.
It has a list of all the functions your contract should implement.

Your task is to is to develop a decentralized fund (a fund controlled
by a smart contract) that will be able to fund projects through
proposals. The wallet of the fund will be a multi-sig wallet.
In order words, a contract that will only release Ethers after
receiving approval of the majority of voters.

The voters (or signers of the contract) are specified in
the file `signers.txt`.

Anyone can feed the contract with Ethers. The contract should
hold the list of contributors and the amount that they have
contributed to the contract.

Anyone can submit a proposal to withdraw some Ethers from
the contract. In order to do so, all one needs to do is
sending a transaction calling the function `submitProposal`
with the requested value. Value cannot be more than 10%
of the total holdings of the contract.

Voters vote on a given proposal by calling the function
`approve` or `reject` depending on their preferences.

When a proposal is approved, the beneficiary can then call
function `withdraw` specifying the value he/she wants to
withdraw. The value can be the whole value proposed or many
small withdraws. Of course that the total withdrawn cannot
be more than the value proposed (duh!).

Pay close attention to the events that the contract should
emit. All events are very well specified in the file
`AbstractMultisig.sol`.

Also, do all the checks you feel necessary. Think that this
contract is for real and will hold millions of dollars and YOU,
and only YOU, are responsible for it.

**Use as much `require` as possible. Give preference to use
`require` for validating user inputs instead of simple `if`s.**

After finishing, your contract's address should be added into
the file `india-training/June-24/homework/homework.txt`. I
will push a set of scripts that will be used to test them.
I will run the scripts against each contract and reward you
with Gyaan Tokens depending on the results.

If you find any problems in my script, please, lemme know.

# Appended text following suggestions from Anish

There should be a "contribution" period, in which the contract
will only receive contributions, and a "active" period, in which
the contract will NOT receive contributions anymore and proposals
can now be submitted.

To simplify things, contribution period will end after a given
function is called, "endContributionPeriod()". This function can
be called by any of the signers of the contract.

# Web Interface

A very simple web interface should show the contract current
state: open proposals, open proposal votes, the signers,
contributors, amounts, etc.

The web interface should allow a) a beneficiary to submit a
proposal, b) a signer to vote on a proposal and c) a beneficiary
to withdraw his/her Ethers using MetaMask.

A box in the bottom of the screen should list all Events that
this contract emitted (this is a plus, not totally necessary).

The dApp should be made available in a public internet address.
You can use any provider for this, there are some free of charge
where you can host nodejs apps.
