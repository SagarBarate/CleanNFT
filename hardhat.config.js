require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001, // Mumbai testnet
    },
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://polygon-amoy.g.alchemy.com/v2/BAXA8y1jcCe3ghxQhOyUg",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002, // Amoy testnet
    },
  },
};