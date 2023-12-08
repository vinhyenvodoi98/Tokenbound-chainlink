import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isAddress } from 'viem';
import { useBalance, useContractWrite, useNetwork } from 'wagmi';

import { DEFAULT_TOKEN } from '@/constant/chains';
import { TOKEN_SUPPORTED } from '@/constant/token';

import { SettingIcon } from '../Icon';
import { AccountInterface } from '../Registry';
import Erc6551Account from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json';

interface SetTokenAddressInterface {
  tokenBound: AccountInterface | null;
}

function VerifyToken({
  address,
  chainId,
  token,
}: {
  address: string;
  chainId: string;
  token: string;
}) {
  const { data: tokenInfo } = useBalance({
    address: address as `0x${string}`,
    chainId: Number(chainId),
    token: token as `0x${string}`,
  });

  return (
    <div>
      <div className='flex flex-col gap-4 w-52'>
        <div className='flex gap-4 items-center'>
          <img
            className='skeleton w-16 h-16 rounded-full shrink-0'
            src={
              TOKEN_SUPPORTED[chainId][token].image
                ? TOKEN_SUPPORTED[chainId][token].image
                : DEFAULT_TOKEN.image
            }
            alt='default token image'
          />

          <div className='flex flex-col gap-4'>
            <div className='h-4'>Name: {tokenInfo?.symbol}</div>
            <div className='h-4'>Decimal: {tokenInfo?.decimals}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetTokenAddress({
  tokenBound,
}: SetTokenAddressInterface) {
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const { chain } = useNetwork();

  const handleInput = (input: string) => {
    if (isAddress(input)) {
      setTokenAddress(input);
    }
  };

  const handle = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementById('add-token-modal').showModal();
  };

  const {
    data: transactionHash,
    isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerAddToken,
  } = useContractWrite({
    address: tokenBound?.account as `0x${string}`,
    abi: Erc6551Account.abi as any,
    functionName: 'addToken',
  });

  const handleExecute = () => {
    if (chain) {
      triggerAddToken({
        args: [tokenAddress, TOKEN_SUPPORTED[chain?.id][tokenAddress].dataFeed],
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );
    }
    // reset
    setTokenAddress('');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementById('add-token-modal')?.close();
  }, [isSuccess]);

  return (
    <>
      <button
        onClick={() => handle()}
        className='btn btn-outline hover:bg-gray-200 w-12 h-12 p-2'
      >
        <SettingIcon />
      </button>
      <dialog id='add-token-modal' className='modal'>
        <div className='modal-box text-black'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Add token to watch list</h3>
          <div className='grid grid-col-3 gap-4'>
            <label className='label'>
              <span className='label-text'>Token Address</span>
            </label>
            <input
              onChange={(e) => handleInput(e.target.value)}
              type='text'
              placeholder='Type Address: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
              className='input input-bordered w-full rounded-md z-10'
            />
            <div className='grid grid-cols-2 gap-4 mt-4'>
              {tokenBound && tokenAddress.length > 0 ? (
                <VerifyToken
                  address={tokenBound?.account}
                  chainId={tokenBound.chain}
                  token={tokenAddress}
                />
              ) : (
                <div className='flex flex-col gap-4 w-52'>
                  <div className='flex gap-4 items-center'>
                    <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                    <div className='flex flex-col gap-4'>
                      <div className='skeleton h-4 w-20'></div>
                      <div className='skeleton h-4 w-28'></div>
                    </div>
                  </div>
                </div>
              )}
              <div className='flex flex-col justify-end'>
                <button
                  onClick={() => handleExecute()}
                  className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-600 text-lg'
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
