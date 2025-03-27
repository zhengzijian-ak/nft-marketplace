const fs = require('fs');
require("@nomiclabs/hardhat-waffle");

const privateKey = fs.readFileSync('.secret').toString().trim();
// const JWT = fs.readFileSync('.pinata').toString().trim();

module.exports = {
  JWT,
  networks: {
    hardhat: {
      chainId: 31337
    }

  },
  solidity: "0.8.4",
};
