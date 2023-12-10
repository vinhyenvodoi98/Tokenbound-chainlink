import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useNetwork } from 'wagmi';

import { CHAIN_SUPPORTED, NATIVE_TOKEN } from '@/constant/chains';
import { shortenAddress } from '@/utils/addresses';

import SetTokenAddress from './SetTokenAddress';
import TokenBalance from './TokenBalance';
import Copy from '../Copy';
import { RefreshIcon } from '../Icon';
import { AccountInterface } from '../Registry';
import Erc6551Account from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json';
import SubEns from '../SubEns';

export default function TokenBound() {
  const account = useAccount();
  const {chain}= useNetwork()
  const [tokenBounds, setTokenBounds] = useState<AccountInterface[]>([]);
  const [currentAccount, setCurrentAccount] = useState<AccountInterface | null>(
    null
  );

  const [total, setTotal] = useState<number>(0);

  const handleTotal = (childValue: number) => {
    setTotal((prevTotal) => prevTotal + childValue);
  };

  const [tokens, setTokens] = useState<string[]>([NATIVE_TOKEN.address]);

  useEffect(() => {
    if (localStorage.getItem('tokenBounds')) {
      const tempBounds = JSON.parse(
        localStorage.getItem('tokenBounds') as string
      ) as AccountInterface[];
      const _bounds = tempBounds.filter(
        (bound) => bound.owner === account.address
      );
      setTokenBounds(_bounds);
      if(currentAccount === null) {
        setCurrentAccount(_bounds[0]);
      }
    }

    const interval = setInterval(() => {
      if (localStorage.getItem('tokenBounds')) {
        const tempBounds = JSON.parse(
          localStorage.getItem('tokenBounds') as string
        ) as AccountInterface[];
        const _bounds = tempBounds.filter(
          (bound) => bound.owner === account.address
        );
        setTokenBounds(_bounds);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const { data: allToken, refetch: refetchAllToken } = useContractRead({
    address: currentAccount?.account as `0x${string}`,
    abi: Erc6551Account.abi as any,
    functionName: 'getAllToken',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetchAllToken();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (allToken && allToken?.length > 0) {
      setTokens([NATIVE_TOKEN.address].concat(allToken as any));
    }
  }, [allToken]);

  return (
    <div className='w-full h-96 grid grid-cols-10 border-2 border-gray-600 rounded-xl'>
      <div className='bg-gray-800 col-span-3 rounded-l-lg p-4'>
        {tokenBounds.map((tokenBound, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg hover:bg-gray-500 cursor-pointer ${
              tokenBound.account === currentAccount?.account && ' bg-gray-500'
            }`}
            onClick={() => setCurrentAccount(tokenBound)}
          >
            <div className='flex justify-between items-center'>
              <div className='flex gap-2'>
                <div className='flex gap-2'>
                  <img src={CHAIN_SUPPORTED[tokenBound.sourceChainId].image} alt={CHAIN_SUPPORTED[tokenBound.sourceChainId].name} className="w-5 h-5 rounded" />
                  <p>{shortenAddress(tokenBound.account)}</p>
                  <Copy text={tokenBound.account} />
                </div>
                {
                  tokenBound.desAccount.length > 0 && (
                    <>
                      <p>{` -> `}</p>
                      <div className='flex gap-2'>
                        <img src={CHAIN_SUPPORTED[tokenBound.chain].image} alt={CHAIN_SUPPORTED[tokenBound.chain].name} className="w-5 h-5 rounded" />
                        <p>{shortenAddress(tokenBound.desAccount)}</p>
                        <Copy text={tokenBound.desAccount} />
                      </div>
                    </>
                  )
                }
              </div>
              {
                (chain && chain.id === Number(tokenBound.chain)) && <SubEns address={tokenBound.account}/>
              }
            </div>
          </div>
        ))}
      </div>
      <div className='col-span-7 p-4'>
        <div className='h-20 flex justify-between rounded-lg bg-gradient-to-r from-green-100 to-blue-200 p-3'>
          <div>
            <h1 className='text-gray-900'>${total} USD</h1>
            {/* <p className='text-gray-600 font-bold'>$120</p> */}
          </div>
          <div className='flex justify-center items-center gap-4'>
            <SetTokenAddress tokenBound={currentAccount} />
            <button className='btn btn-outline hover:bg-gray-200 w-12 h-12 p-2'>
              <RefreshIcon />
            </button>
          </div>
        </div>
        <div className='mt-4'>
          {tokens.map((token) => (
            <TokenBalance
              key={token}
              tokenAddress={token}
              tokenBound={currentAccount}
              handleTotal={handleTotal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
