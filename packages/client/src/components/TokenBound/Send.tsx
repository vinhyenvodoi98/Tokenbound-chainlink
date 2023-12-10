import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { encodeFunctionData, formatEther, isAddress, parseEther } from 'viem';
import { useContractRead, useContractWrite, useNetwork } from 'wagmi';

import { NATIVE_TOKEN } from '@/constant/chains';

import { AccountInterface } from '../Registry';
import Erc20 from '../../../../contracts-hardhat/artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';
import Erc6551Account from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json';

interface SendInterface {
  tokenBound: AccountInterface | null;
  tokenAddress: string;
}

interface EstimateSendFeeInterface {
  tokenBound: AccountInterface;
  to: string;
  value: string
  setFee: Dispatch<SetStateAction<string>>
}

function EstimateSendFee ({tokenBound, to, value, setFee}: EstimateSendFeeInterface) {
  const { chain } = useNetwork();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const initData = encodeFunctionData({
  //   abi: Erc6551Account.abi,
  //   args: [to, value, tokenBound.chain, ''],
  //   functionName: 'executeCall',
  // });

  const { data: fee } = useContractRead({
    address: tokenBound.account as `0x${string}`,
    abi: Erc6551Account.abi as any,
    functionName: 'caculateFee',
    args: ["14767482510784806043", "0xD0daae2231E9CB96b94C8512223533293C3693Bf", to, parseEther(value), tokenBound.chain, ""],
  });

  useEffect(() => {
    if (fee) {
      setFee(fee as any);
    }
  }, [fee]);

  return (
    <>{
      fee ?
      <p>{`${fee && formatEther(fee as any)} ${chain?.nativeCurrency.symbol} (${
        chain?.nativeCurrency.name
      })`}</p>
       :
       <div className='skeleton h-5 w-[100px]'></div>
    }
    </>
  );
}

export default function Send({ tokenBound, tokenAddress }: SendInterface) {
  const { chain } = useNetwork();
  const [to, setTo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [fee, setFee] = useState<string>('')

  const isNative = useMemo(
    () => tokenAddress === NATIVE_TOKEN.address,
    [tokenAddress]
  );

  const {
    data: transactionHash,
    isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerExecuteCall,
  } = useContractWrite({
    address: tokenBound?.account as `0x${string}`,
    abi: Erc6551Account.abi as any,
    functionName: 'executeCall',
  });

  const handleExecute = () => {
    const data = isNative
      ? ''
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        encodeFunctionData({
          abi: Erc20.abi,
          args: [to, parseEther(amount)],
          functionName: 'transfer',
        });

    const _amount = isNative ? parseEther(amount) : 0;

    const _to = isNative ? to : tokenAddress;

    triggerExecuteCall({
      args: [_to, _amount, tokenBound?.chain, data],
      value: fee as any
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );
    }
  }, [isSuccess]);

  const isFullFilled = useMemo(() => {
    if (amount.length > 0 && to.length > 0) return true;
    else false;
  }, [amount, to]);

  const handleInput = (input: string) => {
    if (isAddress(input)) {
      setTo(input);
    }
  };

  return (
    <div>
      <div className='form-control w-full'>
        <label className='label'>
          <span className='label-text'>To</span>
        </label>
        <input
          onChange={(e) => handleInput(e.target.value)}
          type='text'
          placeholder='Type Address: 0x'
          className='input input-bordered w-full rounded-md z-10'
        />
        <label className='label'>
          <span className='label-text'>Amount</span>
        </label>
        <input
          onChange={(e) => setAmount(e.target.value.toString())}
          type='number'
          placeholder='Type Amount: 1'
          className='input input-bordered w-full rounded-md z-10'
        />
        {/* <label className='label'>
          <span className='label-text'>Chain</span>
        </label>
        <input
          onChange={(e) => setAmount(e.target.value.toString())}
          type='number'
          placeholder='Type Chain: 1'
          className='input input-bordered w-full rounded-md z-10'
        /> */}
        {
          (tokenBound && chain && (chain.id !== Number(tokenBound?.chain))) && (
            <div className='mt-4 flex gap-2 rounded-md p-2 h-10 bg-green-200'>
              <p>Fee:</p>
              <EstimateSendFee to={to} tokenBound={tokenBound} value={amount} setFee={setFee} />
            </div>
          )
        }
      </div>
      <div className='mt-8 flex flex-row-reverse'>
        <button
          onClick={() => handleExecute()}
          disabled={!isFullFilled}
          className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-600 text-lg w-32'
        >
          Send
        </button>
      </div>
    </div>
  );
}
