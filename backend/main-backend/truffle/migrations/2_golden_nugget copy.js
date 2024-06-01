var DealHandler = require('../build/contracts/DealHandler.json');
var GoldenNugget = artifacts.require('GoldenNugget');

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(GoldenNugget, '0x3F2a452ca9f216cAd85415B75A7da0130fBB72a6', DealHandler.networks['5777'].address);
};
