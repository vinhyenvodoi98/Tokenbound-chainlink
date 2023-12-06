import { ethers, network } from "hardhat";
import fs from "fs";
import { routerConfig } from "./constants";
require('dotenv').config()

async function main() {
  const ERC6551Registry = await ethers.deployContract("ERC6551Registry", [routerConfig[network.name as string].address], {}) as any;
  await ERC6551Registry.waitForDeployment();

  console.log(
    `ERC6551Registry deployed to ${ERC6551Registry.target}`
  );

  const ERC6551Account = await ethers.deployContract("ERC6551Account", [], {}) as any;
  await ERC6551Account.waitForDeployment();

  console.log(
    `ERC6551Account deployed to ${ERC6551Account.target}`
  );

  const contractAddresses = readDataFromFile();

  if (contractAddresses[network.config.chainId as number]) {
    contractAddresses[network.config.chainId as number].ERC6551Registry = ERC6551Registry.target;
    contractAddresses[network.config.chainId as number].ERC6551Account = ERC6551Account.target;
  } else {
    contractAddresses[network.config.chainId as number] = {
      ERC6551Registry: ERC6551Registry.target,
      ERC6551Account: ERC6551Account.target
    };
  }
  // Save the updated array to the JSON file
  writeDataToFile(contractAddresses);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const readDataFromFile = () => {
  try {
    const data = fs.readFileSync('contract-address.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

const writeDataToFile = (data : any) => {
  fs.writeFileSync('contract-address.json', JSON.stringify(data, null, 2));
};
