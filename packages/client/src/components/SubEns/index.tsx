import { ENS_PNG } from "@/constant/chains";
import { useState } from "react";
import { useAccount, useEnsName } from "wagmi";

export default function SubEns({address}: {address: string}) {

  const {address: owner} = useAccount()

  const { data: name } = useEnsName({
    address: owner as `0x${string}`,
    scopeKey: (owner as `0x${string}`) || '',
  });

  const [subDomain, setSubDomain] = useState<string>('')
  const handleModal = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementById('create-subens').showModal();
  };

  const handleSetSubdomain = () => {
    console.log(subDomain)
  }

  return(
    <div>
      <div
        onClick={() => handleModal()}
        className='p-2 border-2 border-gray-400 cursor-pointer rounded-lg'
      >
        <img className="h-4 w-4" src={ENS_PNG.image} alt="ens"/>
      </div>
      <dialog id='create-subens' className='modal'>
        <div className='modal-box text-black w-1/3 max-w-5xl'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Create SubEns</h3>
          <div className='grid grid-col-3 gap-4'>
          <label className='label'>
            <span className='label-text'>SubDomain</span>
          </label>
            <input
              onChange={(e) => setSubDomain(e.target.value.toString())}
              value={subDomain}
              type='text'
              placeholder='Type subdomain: iam'
              className='input input-bordered w-full rounded-md z-10'
            />
            <div className="rounded-md p-2 flex gap-2 bg-green-200">
              Preview: {
              subDomain.length > 0 &&<p>
              {`${subDomain}.${name}`}
            </p>
            }
            </div>
          </div>
          <div className='mt-4 flex flex-row-reverse'>
            <button
              onClick={() => handleSetSubdomain()}
              className='btn btn-outline rounded-full text-blue-500 hover:bg-blue-600 text-lg w-32'
            >
              Submit
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}