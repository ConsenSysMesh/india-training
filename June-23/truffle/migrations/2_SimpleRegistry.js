var SimpleRegistry = artifacts.require("./SimpleRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleRegistry);
};
