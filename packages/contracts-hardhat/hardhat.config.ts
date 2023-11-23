import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GOERLY_ETHERSCAN= process.env.GOERLY_ETHERSCAN

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [PRIVATE_KEY as string],
      chainId: 5,
    },
    mumbai: {
      url: "https://polygon-testnet.public.blastapi.io",
      accounts: [PRIVATE_KEY as string],
      chainId: 80001,
    },
    fuji: {
      url: "https://rpc.ankr.com/avalanche_fuji",
      accounts: [PRIVATE_KEY as string],
      chainId: 43113
    }
  },
  etherscan: {
    apiKey: {
      goerli: GOERLY_ETHERSCAN as string,
    },
  }
};

export default config;

