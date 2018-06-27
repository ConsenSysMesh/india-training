# Two Weeks Homework

This homework will be composed of two parts: in the first
part, you should develop a smart contract that it's the
heart of it.

In the second part, due to other week, you should develop
a web interface to interact with the contract.

The goal of this homework
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

Anyone can submit a proposal to withdraw some Ethers from
the contract. In order to do so, all one needs to do is
sending a transaction calling the function `submitProposal`
with the requested value. Value cannot be more than 10%
of the total holdings of the contract.

Anyone can feed the contract with Ethers. The contract should
hold the list of contributors and the amount that they sent
to the contract.

Voters vote on a given proposal by calling the function
`approve` or `reject` depending on their preferences.

Pay close attention to the events that the contract should
emit.

Also, do all the checks you feel necessary. Think that this
contract is for real and will hold millions of dollars and YOU,
and only YOU, are responsible for it.

After finishing, your contract's address should be added into
the file `india-training/June-24/homework/homework.txt`.

# Appended text following suggestions from Anish

There should be a "contribution" period, in which the contract
will only receive contributions, and a "active" period, in which
the contract will NOT receive contributions anymore and proposals
can now be submitted.

To simplify things, contribution period will end after a given
function is called, "endContributionPeriod()". This function can
be called by any of the signers of the contract.

# Web Interface

A very simple web interface would show the contract current
state: open proposals, open proposal votes, the signers,
contributors, amounts, etc.

An advanced interface would allow a voter to vote on a proposal
and a beneficiary to withdraw his/her Ethers using MetaMask.

A box in the bottom of the screen should list all Events that
this contract emitted.

A plus would be the same interface to allow any user (Ethereum
wallet through MetaMask) to send Ethers to this contract.

The dApp should be made available in a public internet address.
You can use any provider for this, there are some free of charge
where you can host nodejs apps.
