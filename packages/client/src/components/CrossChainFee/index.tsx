import { getContractAddress } from "@/utils/getContract";
import { encodeFunctionData, formatEther } from "viem";
import { useContractRead, useNetwork } from "wagmi"
import Erc6551Registry from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Registry.sol/ERC6551Registry.json';
import Erc6551Account from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json';
import { useEffect } from "react";

interface CrossChainFeeInterface {
  tokenContract: string,
  desChain: string,
  tokenId: string,
  salt: string,
  setFee: (fee:any) => void
}

export default function CrossChainFee({tokenContract, desChain, tokenId, salt, setFee}:CrossChainFeeInterface) {
  const {chain} = useNetwork()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const initData = encodeFunctionData({
    abi: Erc6551Account.abi,
    args: [tokenContract],
    functionName: 'setSourceAddress',
  });

  const { data:fee } = useContractRead({
    address: getContractAddress(chain?.id).ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'caculateFee',
    args: [
      desChain,
      tokenContract,
      tokenId,
      salt,
      initData,
    ],
  });

  useEffect(() => {
    if(fee) {
      setFee(fee)
    }
  }, [fee])

  return(
    <p>{`${fee && formatEther(fee as any)} ${chain?.nativeCurrency.symbol} (${chain?.nativeCurrency.name})`}</p>
  )
}