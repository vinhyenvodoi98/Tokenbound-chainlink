import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { isAddress } from 'viem';
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
} from 'wagmi';

import NFTImage from '../NFTImage';
import Erc721Abi from '../../../../contracts-hardhat/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json';
import Erc6551Registry from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Registry.sol/ERC6551Registry.json';
import contractAddress from '../../../../contracts-hardhat/contract-address.json';

export default function Registry() {
  const account = useAccount();
  const [tokenContract, setTokenContract] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [salt, setSalt] = useState<string>('');

  // Read token
  const { data: token } = useContractReads({
    contracts: [
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi.abi as any,
        functionName: 'name',
      },
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi.abi as any,
        functionName: 'tokenURI',
        args: [tokenId],
      },
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi.abi as any,
        functionName: 'ownerOf',
        args: [tokenId as any],
      },
    ],
  });

  const { data: registry, refetch } = useContractRead({
    address: contractAddress[5].ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'account',
    args: [
      contractAddress[5].ERC6551Account,
      chain,
      tokenContract,
      tokenId,
      salt,
    ],
  });

  const {
    data: transactionHash,
    isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerCreateAccount,
  } = useContractWrite({
    address: contractAddress[5].ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'createAccount',
  });

  const createNewAccount = () => {
    triggerCreateAccount({
      args: [
        contractAddress[5].ERC6551Account,
        chain,
        tokenContract,
        tokenId,
        salt,
        '',
      ],
    });
  };

  const handleInput = (input: string) => {
    if (isAddress(input)) {
      setTokenContract(input);
    }
  };

  const isOwner = useMemo(() => {
    if (
      token &&
      token[2].result &&
      (token[2].result.toString().toLocaleLowerCase() as any) ===
        account.address?.toLocaleLowerCase()
    )
      return true;
    else false;
  }, [token, account]);

  const isFullField = useMemo(() => {
    if (
      tokenContract.length > 0 &&
      tokenId.length > 0 &&
      chain.length > 0 &&
      salt.length > 0
    )
      return true;
    else false;
  }, [contractAddress, tokenId, chain, salt]);

  useEffect(() => {
    if (
      tokenContract.length > 0 &&
      tokenId.length > 0 &&
      chain.length > 0 &&
      salt.length > 0
    )
      refetch?.();
  }, [tokenContract, tokenId, chain, salt]);

  useEffect(() => {
    if (isSuccess)
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );
  }, [isSuccess]);

  return (
    <div className='flex flex-col w-full lg:flex-row'>
      <div className='grid flex-grow min-h-64 rounded-box place-items-center'>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>Token Address</span>
          </label>
          <input
            onChange={(e) => handleInput(e.target.value)}
            type='text'
            placeholder='Type Token Address: 0x...'
            className='input input-bordered w-full rounded-md z-10'
          />
          <label className='label'>
            <span className='label-text'>TokenID</span>
          </label>
          <input
            onChange={(e) => setTokenId(e.target.value.toString())}
            type='number'
            placeholder='Type TokenID: 1'
            className='input input-bordered w-full rounded-md z-10'
          />
          <label className='label'>
            <span className='label-text'>Chain</span>
          </label>
          <input
            onChange={(e) => setChain(e.target.value.toString())}
            type='number'
            placeholder='Type Chain: 1'
            className='input input-bordered w-full rounded-md z-10'
          />
          <label className='label'>
            <span className='label-text'>Salt</span>
          </label>
          <input
            onChange={(e) => setSalt(e.target.value)}
            type='text'
            placeholder='Type Any: 1'
            className='input input-bordered w-full rounded-md z-10'
          />
        </div>
      </div>
      <div className='divider lg:divider-horizontal' />
      <div className='grid flex-grow card rounded-box place-items-center'>
        <div className='w-64 border rounded-2xl p-4'>
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4 items-center'>
              <div className='flex flex-col gap-1'>
                {token && token[0].result ? (
                  <>
                    <p className='font-medium'>{token[0].result}</p>
                    <p className='font-medium'>#{tokenId}</p>
                  </>
                ) : (
                  <>
                    <div className='skeleton h-4 w-28'></div>
                    <div className='skeleton h-4 w-20'></div>
                  </>
                )}
              </div>
            </div>
            <NFTImage token={token as any} />
          </div>
        </div>
        <div className='rounded-full m-2 p-2 w-[420px] h-10 bg-green-200 flex justify-center items-center'>
          {registry ? (
            <>{registry}</>
          ) : (
            <div className='skeleton h-5 w-[384px]'></div>
          )}
        </div>
        <button
          onClick={() => createNewAccount()}
          disabled={!(isOwner && isFullField)}
          className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-500 text-lg w-40'
        >
          {isOwner ? (isFullField ? 'Create' : 'Not Fulfilled') : 'Not Owner'}
        </button>
      </div>
    </div>
  );
}
