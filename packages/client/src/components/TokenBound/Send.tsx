import { useMemo, useState } from "react"

export default function Send() {
  const [amount, setAmount] = useState<string>('')
  const [chain, setChain] = useState<string>('')

  const isFullFilled = useMemo(() => {
    if (
      amount.length > 0 &&
      chain.length > 0
    )
      return true;
    else false;
  }, [amount, chain]);

  return(
    <div>
      <div className='form-control w-full'>
        <label className='label'>
          <span className='label-text'>Amount</span>
        </label>
        <input
          onChange={(e) => setAmount(e.target.value.toString())}
          type='number'
          placeholder='Type Amount: 1'
          className='input input-bordered w-full rounded-md z-10'
        />
        <label className='label'>
          <span className='label-text'>Chain</span>
        </label>
        <input
          onChange={(e) => setAmount(e.target.value.toString())}
          type='number'
          placeholder='Type Chain: 1'
          className='input input-bordered w-full rounded-md z-10'
        />
      </div>
      <div className="mt-8 flex flex-row-reverse">
        <button disabled={!isFullFilled} className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-600 text-lg w-32'>
          Send
        </button>
      </div>
    </div>
  )
}