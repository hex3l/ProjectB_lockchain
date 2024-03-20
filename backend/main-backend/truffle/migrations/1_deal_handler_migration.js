var DealHandler = artifacts.require('DealHandler');

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(DealHandler);
};
