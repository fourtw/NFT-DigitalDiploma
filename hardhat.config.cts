import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const POLYGON_MUMBAI_RPC = process.env.POLYGON_MUMBAI_RPC || "https://rpc.ankr.com/polygon_mumbai";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      // Use PRIVATE_KEY from .env if available, otherwise use default mnemonic
      accounts: PRIVATE_KEY 
        ? [PRIVATE_KEY]
        : {
            mnemonic: "test test test test test test test test test test test junk",
            count: 20,
          },
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80001,
    },
    amoy: {
      url: process.env.POLYGON_AMOY_RPC || "https://rpc.ankr.com/polygon_amoy",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
    },
    polygon: {
      url: process.env.POLYGON_MAINNET_RPC || "https://polygon-rpc.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY,
      polygonAmoy: POLYGONSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;

