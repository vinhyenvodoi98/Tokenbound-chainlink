import Image from 'next/image';
import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

interface Data {
  contract: string,
  image:string,
  alt:string,
  tokenId: string
}

function TextUpdaterNft({ data, isConnectable }:{data:Data, isConnectable:boolean}) {
  return (
    <div className="text-updater-node border-2 border-gray-500 rounded-lg">
      <div className='flex flex-col'>
        <label htmlFor="text" className='p-2 bg-purple-100 rounded-t-md text-black'>EIP-721 Contract</label>
        <div className='flex flex-col justify-center items-center p-2'>
          <p>({data.contract})</p>
          <Image className='rounded-lg' src={data.image} height={100} width={100} alt={data.alt} />
          <p>{data.tokenId}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        isConnectable={true}
      />
    </div>
  );
}

export default TextUpdaterNft;
