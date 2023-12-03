import { useEffect, useMemo } from 'react';
import { useBalance, useContractRead } from 'wagmi';

import { DEFAULT_TOKEN, NATIVE_TOKEN } from '@/constant/chains';

import Send from './Send';
import { AccountInterface } from '../Registry';
import { TOKEN_SUPPORTED } from '@/constant/token';

import Erc6551Account from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json';
import AggregatorV3Interface from '../../../../contracts-hardhat/artifacts/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/AggregatorV3Interface.json';

interface TokenBalanceInterface {
  tokenBound: AccountInterface | null;
  tokenAddress: string;
  handleTotal: (value: number) => void
}

const Native = ({ tokenBound, handleTotal }: { tokenBound: AccountInterface, handleTotal: (value: number) => void }) => {
  const { data, refetch } = useBalance({
    address: tokenBound?.account as `0x${string}`,
    chainId: Number(tokenBound?.chain),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const { data: price } = useContractRead({
    address: TOKEN_SUPPORTED[tokenBound?.chain][NATIVE_TOKEN.address].dataFeed as `0x${string}`,
    abi: AggregatorV3Interface.abi as any,
    functionName: 'latestRoundData',
  });

  const tokenPrice = useMemo(() => (price && price[1] !== null ) ? Number(price[1]) / 10**8 : 0 , [price])

  useEffect(() => {
    if(tokenPrice !== 0 && data !== undefined) {
      handleTotal((tokenPrice * Number(data?.formatted)) / 2)
    }
  }, [tokenPrice, data])

  return (
    <div className='flex justify-between w-full'>
      <div className='flex flex-col justify-between'>
        <h3 className='text-left'>{data?.symbol}</h3>
        <p className='text-gray-400'>${tokenPrice}</p>
      </div>
      <div className='flex flex-col justify-between'>
        <h3 className='text-right'>{data?.formatted}</h3>
        <p className='text-gray-400'>${tokenPrice * Number(data?.formatted)}</p>
      </div>
    </div>
  );
};

const Token = ({
  tokenBound,
  tokenAddress,
  handleTotal,
}: {
  tokenBound: AccountInterface | null;
  tokenAddress: string;
  handleTotal: (value: number) => void;
}) => {
  const { data, refetch } = useBalance({
    address: tokenBound?.account as `0x${string}`,
    chainId: Number(tokenBound?.chain),
    token: tokenAddress as `0x${string}`,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const { data: price } = useContractRead({
    address: tokenBound?.account as `0x${string}`,
    abi: Erc6551Account.abi as any,
    functionName: 'getChainlinkDataFeedLatestAnswer',
    args: [
      tokenAddress
    ],
  });

  const tokenPrice = useMemo(() => (price !== null ) ? Number(price) / 10**8 : 0 , [price])

  useEffect(() => {
    if(tokenPrice !== 0 && data !== undefined) {
      handleTotal((tokenPrice * Number(data?.formatted)) / 2)
    }
  }, [])

  return (
    <div className='flex justify-between w-full'>
      <div className='flex flex-col justify-between'>
        <h3 className='text-left'>{data?.symbol}</h3>
        <p className='text-gray-400'>${tokenPrice}</p>
      </div>
      <div className='flex flex-col justify-between'>
        <h3 className='text-right'>{data?.formatted}</h3>
        <p className='text-gray-400'>${tokenPrice * Number(data?.formatted)}</p>
      </div>
    </div>
  );
};
export default function TokenBalance({
  tokenBound,
  tokenAddress,
  handleTotal
}: TokenBalanceInterface) {
  const handleSend = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementById(`send-modal-${tokenAddress}`).showModal();
  };

  const { data: nativeBalance, refetch: nativeRefetch } = useBalance({
    address: tokenBound?.account as `0x${string}`,
    chainId: Number(tokenBound?.chain),
  });

  const isNative = useMemo(
    () => tokenAddress === NATIVE_TOKEN.address,
    [tokenAddress]
  );

  return (
    <div
      onClick={() => handleSend()}
      className='flex p-2 rounded-lg gap-4 cursor-pointer hover:bg-gray-500'
    >
      {
        tokenBound &&
        <>
          <img
            className='w-16 rounded-full'
            src={TOKEN_SUPPORTED[tokenBound?.chain][tokenAddress].image ? TOKEN_SUPPORTED[tokenBound?.chain][tokenAddress].image  : DEFAULT_TOKEN.image}
          />
          {isNative ? (
            <Native tokenBound={tokenBound} handleTotal={handleTotal}/>
          ) : (
            <Token tokenBound={tokenBound} tokenAddress={tokenAddress} handleTotal={handleTotal}/>
          )}
        </>
      }
      <dialog id={`send-modal-${tokenAddress}`} className='modal'>
        <div className='modal-box text-black'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Send</h3>
          <div className='grid grid-col-3 gap-4'>
            <Send tokenBound={tokenBound} tokenAddress={tokenAddress} />
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
