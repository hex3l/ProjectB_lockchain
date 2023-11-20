/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.19',
  paths: {
    sources: './smartcontracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
require('@nomicfoundation/hardhat-ethers');
