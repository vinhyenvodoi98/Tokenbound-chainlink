import contractAddress from '../../../contracts-hardhat/contract-address.json';

export const getContractAddress = (network: number | undefined) => {
  const _contractAddress = contractAddress as any
  if(network)
    return _contractAddress[network]
  else
    return {
      ERC6551Registry: "0x0000000000000000000000000000000000000000",
      ERC6551Account: "0x0000000000000000000000000000000000000000"
    }
};