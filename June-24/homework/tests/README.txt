# Test 1
Add contributions from 2 address
* Check if list of contributors contains both addresses
* Check if contribution amounts are correct
* Check if event was generated

# Test 2
Add more contribution from first address
* Check if contribution from first address was increased

# Test 3
Call endContributionPeriod
Add one more contribution from address 1
* Check if function throws since the contribution period is over

# Test 4
Submit proposal with value 0
* Check if function throws

# Test 5
Submit proposal with value > 0 from a signer
* Check if function throws (signer cannot submit proposals)

# Test 6
Submit proposal with value > 0 and value > 10% total contribution
* Check if function throws (proposal cannot be gt 10% of total contributions)

# Test 7
Submit proposal with value == 9.9% of total contribution
* listOpenBeneficiariesProposals should return this address
* getBeneficiaryProposal should return the value of the proposal
* Check if event was generated

# Test 8
Submit same proposal again
* Check if function throws because same address cannot submit more than one proposal

# Test 9
Submit 10 proposals from 10 different address each requesting 9.9% of total contributions
* Check if last call throws (10th will be the 11th proposal of 9.9%)
* listOpenBeneficiariesProposals should return all addresses

# Test 10
Try to withdraw some value using one of previous address
* Withdraw should fail because it's not approved

# Test 11
Call approve function from an address that's not a signer
* Check if function throws

# Test 12
Call reject function from an address that's not a signer
* Check if function throws

# Test 13
Call approve function using invalid beneficiary
* Check if function throws

# Test 14
Call reject function using invalid beneficiary
* Check if function throws

# Test 15
Call approve function using valid beneficiary
* Check if event was generated

# Test 16
Try to withdraw from beneficiary of Test 15
* Check if withdraw fails

# Test 17
Call approve again from the same signer to the same beneficiary
* Check if function throws because same signer cannot approve more than once

# Test 18
Call reject from a signer that has already approved
* Check if function throws because signer cannot change his/her vote
* If didn't thrown, check if signer was able to change his/her vote

# Test 19
Call reject from a signer that has not voted yet
* Check if ProposalRejected event has been emitted

# Test 20
Call approve function from another signer to the same beneficiary
Try to withdraw 60% of requested value for this beneficiary
* Check if withdraw was successful

# Test 21
Try to withdraw 60% again
* Check if function throws

# Test 22
Try to withdraw remaining 40%
* Check if withdraw is successful

# Test 23
Try to withdraw remaining 40% again
* Check if function throws

