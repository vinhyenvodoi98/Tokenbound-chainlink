import Image from 'next/image';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

interface Data {
  label: string,
  address: string
}

function Account({ data, isConnectable }:{data:Data, isConnectable:boolean}) {
  return (
    <div className="text-updater-node border-2 border-gray-500 rounded-lg">
      <div className='flex flex-col'>
        <label htmlFor="text" className='p-2 bg-purple-100 rounded-t-md text-black'>{data.label}</label>
        <div className='flex justify-center items-center p-2 gap-4 p-4'>
          <Image className='rounded-lg ' src={'/png/link-logo.png'} height={40} width={40} alt="link logo" />
          <p>{data.address}</p>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default Account;
