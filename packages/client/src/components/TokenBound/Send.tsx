import { useEffect, useMemo, useState } from "react"
import { useContractWrite } from "wagmi";
import { AccountInterface } from "../Registry";
import { isAddress, parseEther } from 'viem';

import Erc6551Account from '../../../../contracts-hardhat/artifacts/contracts/ERC6551Account.sol/ERC6551Account.json';
import { toast } from "react-toastify";

interface SendInterface {
  tokenBound: AccountInterface | null,
  tokenAddress: string
}

export default function Send({tokenBound, tokenAddress}: SendInterface) {
  const [to, setTo] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  // const [chain, setChain] = useState<string>('')

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
    triggerExecuteCall({
      args: [
        to,
        parseEther(amount),
        '',
      ],
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
    if (
      amount.length > 0 &&
      to.length > 0
    )
      return true;
    else false;
  }, [amount, to]);

  const handleInput = (input: string) => {
    if (isAddress(input)) {
      setTo(input);
    }
  };

  return(
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
      </div>
      <div className="mt-8 flex flex-row-reverse">
        <button onClick={() => handleExecute()} disabled={!isFullFilled} className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-600 text-lg w-32'>
          Send
        </button>
      </div>
    </div>
  )
}