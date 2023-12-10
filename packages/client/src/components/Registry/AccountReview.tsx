import { useEffect } from 'react';
import { useContractRead, useNetwork } from 'wagmi';

import { CHAIN_SUPPORTED } from '@/constant/chains';
import { shortenAddress } from '@/utils/addresses';
import { getContractAddress } from '@/utils/getContract';

import Erc6551Registry from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Registry.sol/ERC6551Registry.json';

interface AccountReviewInterface {
  sourceChain: number;
  chain: string;
  tokenContract: string;
  tokenId: string;
  salt: string;
  handleSetSourceAccount: (i: string) => void;
  handleDesAccount: (i: string) => void;
}

export default function AccountReview({
  sourceChain,
  chain,
  tokenContract,
  tokenId,
  salt,
  handleSetSourceAccount,
  handleDesAccount,
}: AccountReviewInterface) {
  const { chain: currentChain } = useNetwork();

  const { data: registry, refetch } = useContractRead({
    address: getContractAddress(sourceChain).ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'account',
    chainId: sourceChain,
    args: [
      getContractAddress(sourceChain).ERC6551Account,
      chain,
      tokenContract,
      tokenId,
      salt,
    ],
  });

  useEffect(() => {
    if (
      tokenContract.length > 0 &&
      tokenId.length > 0 &&
      chain.length > 0 &&
      salt.length > 0
    )
      refetch?.();

    if (Number(chain) === currentChain?.id) {
      handleDesAccount('');
    }
  }, [tokenContract, tokenId, chain, salt]);

  useEffect(() => {
    if (registry) {
      handleSetSourceAccount(registry as any);
    }
  }, [registry]);

  return (
    <div className='rounded-full m-2 p-2 w-[420px] h-10 bg-green-200 flex justify-center items-center gap-2'>
      {registry ? (
        <div className='flex gap-2'>
          <div className='flex items-center gap-2 tooltip' data-tip={registry}>
            <img
              src={CHAIN_SUPPORTED[sourceChain].image}
              alt={CHAIN_SUPPORTED[sourceChain].name}
              className='w-5 h-5 rounded'
            />
            {shortenAddress(registry as any)}
          </div>
        </div>
      ) : (
        <div className='skeleton h-6 w-[160px]'></div>
      )}
      {chain === '43113' && (
        <>
          <p>{' -> '}</p>
          <DestinationAccountReview
            handleDesAccount={handleDesAccount}
            chain={Number(chain)}
            tokenContract={tokenContract}
            tokenId={tokenId}
            salt={salt}
          />
        </>
      )}
    </div>
  );
}

interface DestinationAccountReviewInterface {
  chain: number;
  tokenContract: string;
  tokenId: string;
  salt: string;
  handleDesAccount: (i: string) => void;
}

function DestinationAccountReview({
  chain,
  tokenContract,
  tokenId,
  salt,
  handleDesAccount,
}: DestinationAccountReviewInterface) {
  const { data: registry, refetch } = useContractRead({
    address: getContractAddress(chain).ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'account',
    chainId: Number(chain),
    args: [
      getContractAddress(chain).ERC6551Account,
      chain,
      tokenContract,
      tokenId,
      salt,
    ],
  });

  useEffect(() => {
    if (tokenContract.length > 0 && tokenId.length > 0 && salt.length > 0)
      refetch?.();
  }, [tokenContract, tokenId, chain, salt]);

  useEffect(() => {
    if (registry) handleDesAccount(registry as any);
  }, [registry]);

  return (
    <div className=''>
      {registry ? (
        <div>
          <div className='flex items-center gap-2 tooltip' data-tip={registry}>
            <img
              src={CHAIN_SUPPORTED[chain].image}
              alt={CHAIN_SUPPORTED[chain].name}
              className='w-5 h-5 rounded'
            />
            {shortenAddress(registry as any)}
          </div>
        </div>
      ) : (
        <div className='skeleton h-6 w-[160px]'></div>
      )}
    </div>
  );
}
