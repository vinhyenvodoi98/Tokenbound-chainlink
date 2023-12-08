import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GOERLY_ETHERSCAN= process.env.GOERLY_ETHERSCAN

const config: HardhatUserConfig = {
  solidity:{
    compilers: [
      {
        version: '0.8.20',
        settings: {
          // evmVersion: 'paris' // for fuji
        }
      }
    ]
  },
  networks: {
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [PRIVATE_KEY as string],
      chainId: 5,
    },
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: [PRIVATE_KEY as string],
      chainId: 11155111,
    },
    mumbai: {
      url: "https://polygon-testnet.public.blastapi.io",
      accounts: [PRIVATE_KEY as string],
      chainId: 80001,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY as string],
      chainId: 43113,
      allowUnlimitedContractSize: true,
    },
    scroll: {
      url: "https://rpc.ankr.com/scroll",
      accounts: [PRIVATE_KEY as string],
      chainId: 534352,
    }
  },
  etherscan: {
    apiKey: {
      goerli: GOERLY_ETHERSCAN as string,
    },
  }
};

export default config;

