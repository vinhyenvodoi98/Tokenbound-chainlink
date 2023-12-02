import { useEffect, useMemo } from 'react';
import { useBalance } from 'wagmi';

import { DEFAULT_TOKEN, NATIVE_TOKEN } from '@/constant/chains';

import Send from './Send';
import { AccountInterface } from '../Registry';

interface TokenBalanceInterface {
  tokenBound: AccountInterface | null;
  tokenAddress: string;
}

const Native = ({ tokenBound }: { tokenBound: AccountInterface | null }) => {
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

  return (
    <div className='flex justify-between w-full'>
      <div className='flex flex-col justify-between'>
        <h3>{data?.symbol}</h3>
        <p className='text-gray-400'>$1</p>
      </div>
      <div className='flex flex-col justify-between'>
        <h3>{data?.formatted}</h3>
        <p className='text-gray-400'>$600</p>
      </div>
    </div>
  );
};

const Token = ({
  tokenBound,
  tokenAddress,
}: {
  tokenBound: AccountInterface | null;
  tokenAddress: string;
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

  return (
    <div className='flex justify-between w-full'>
      <div className='flex flex-col justify-between'>
        <h3>{data?.symbol}</h3>
        <p className='text-gray-400'>$1</p>
      </div>
      <div className='flex flex-col justify-between'>
        <h3>{data?.formatted}</h3>
        <p className='text-gray-400'>$600</p>
      </div>
    </div>
  );
};
export default function TokenBalance({
  tokenBound,
  tokenAddress,
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
      <img
        className='w-16 rounded-full'
        src={isNative ? NATIVE_TOKEN.image : DEFAULT_TOKEN.image}
      />
      {isNative ? (
        <Native tokenBound={tokenBound} />
      ) : (
        <Token tokenBound={tokenBound} tokenAddress={tokenAddress} />
      )}
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
