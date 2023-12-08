import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { isAddress } from 'viem';
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
} from 'wagmi';

import { CHAIN_SUPPORTED } from '@/constant/chains';
import { getContractAddress } from '@/utils/getContract';

import CrossChainFee from '../CrossChainFee';
import NFTImage from '../NFTImage';
import Erc721Abi from '../../../../contracts-hardhat/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json';
import Erc6551Registry from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Registry.sol/ERC6551Registry.json';

export interface AccountInterface {
  owner: string;
  account: string;
  tokenContract: string;
  tokenId: string;
  chain: string;
  salt: string;
}

export default function Registry() {
  const account = useAccount();
  const { chain: currentChain } = useNetwork();
  const [tokenContract, setTokenContract] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [salt, setSalt] = useState<string>('');
  const [tokenBounds, setTokenBounds] = useState<AccountInterface[]>([]);
  const [fee, setFee] = useState<any>(0);

  const reset = () => {
    setTokenContract('');
    setTokenId('');
    setChain('');
    setSalt('');
  };

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

  useEffect(() => {
    if (localStorage.getItem('tokenBounds')) {
      setTokenBounds(
        JSON.parse(
          localStorage.getItem('tokenBounds') as string
        ) as AccountInterface[]
      );
    }
  }, []);

  const { data: registry, refetch } = useContractRead({
    address: getContractAddress(currentChain?.id)
      .ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'account',
    args: [
      getContractAddress(currentChain?.id).ERC6551Account,
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
    address: getContractAddress(currentChain?.id)
      .ERC6551Registry as `0x${string}`,
    abi: Erc6551Registry.abi as any,
    functionName: 'createAccount',
  });

  const createNewAccount = () => {
    if (currentChain)
      triggerCreateAccount({
        args: [
          getContractAddress(currentChain?.id).ERC6551Account,
          chain,
          tokenContract,
          tokenId,
          salt,
          '',
        ],
        value: fee,
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

  const isFullFilled = useMemo(() => {
    if (
      tokenContract.length > 0 &&
      tokenId.length > 0 &&
      chain.length > 0 &&
      salt.length > 0
    )
      return true;
    else false;
  }, [tokenContract, tokenId, chain, salt]);

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
    if (isSuccess) {
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );

      setTokenBounds((prevTokenBounds) => [
        ...prevTokenBounds,
        {
          owner: account.address,
          account: registry as any,
          tokenContract,
          tokenId,
          chain,
          salt,
        } as AccountInterface,
      ]);

      reset();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.getElementById('create-tokenbound-modal ').close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (tokenBounds.length > 0)
      localStorage.setItem('tokenBounds', JSON.stringify(tokenBounds));
  }, [tokenBounds]);

  const selectTitle = useMemo(
    () => (chain.length > 0 ? CHAIN_SUPPORTED[chain].name : 'Select chain'),
    [chain]
  );

  return (
    <div className='flex flex-col w-full lg:flex-row'>
      <div className='grid flex-grow h-[450px] rounded-box place-items-center'>
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
          <div className='dropdown w-full z-50'>
            <div
              tabIndex={0}
              className='btn text-left w-full bg-gray-100 hover:bg-gray-200 justify-start'
            >
              {selectTitle}
            </div>
            <ul
              tabIndex={0}
              className='dropdown-content z-10 p-2 shadow bg-base-100 rounded-box w-full'
            >
              {Object.keys(CHAIN_SUPPORTED).map((key) => (
                <li
                  key={key}
                  onClick={() => setChain(key)}
                  className='flex flex-row items-center gap-2 w-full hover:bg-gray-200'
                >
                  <img
                    src={CHAIN_SUPPORTED[key].image}
                    className='p-4 w-16 h-16 rounded'
                    alt={CHAIN_SUPPORTED[key].name}
                  />
                  <p className='font-bold'>{CHAIN_SUPPORTED[key].name}</p>
                </li>
              ))}
            </ul>
          </div>
          <label className='label'>
            <span className='label-text'>Salt</span>
          </label>
          <input
            onChange={(e) => setSalt(e.target.value)}
            type='number'
            placeholder='Type Any Number: 1'
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
        {chain === '43113' && (
          <div className='flex gap-2'>
            <p>Cross-chain fee:</p>
            {isFullFilled ? (
              <CrossChainFee
                setFee={setFee}
                tokenContract={tokenContract}
                desChain={chain}
                tokenId={tokenId}
                salt={salt}
              />
            ) : (
              <div className='skeleton h-5 w-[100px]'></div>
            )}
          </div>
        )}
        <button
          onClick={() => createNewAccount()}
          disabled={!(isOwner && isFullFilled)}
          className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-500 text-lg w-40'
        >
          {isOwner ? (isFullFilled ? 'Create' : 'Not Fulfilled') : 'Not Owner'}
        </button>
      </div>
    </div>
  );
}
