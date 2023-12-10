import Image from 'next/image';
import { Handle, Position } from 'reactflow';

interface Data {
  label: string;
  address: string;
  image: string;
}

function Account({
  data,
  isConnectable,
}: {
  data: Data;
  isConnectable: boolean;
}) {
  return (
    <div className='text-updater-node border-2 border-gray-500 rounded-lg'>
      <div className='flex flex-col'>
        <label
          htmlFor='text'
          className='p-2 bg-purple-100 rounded-t-md text-black flex gap-2'
        >
          {data.label}
          <Image src='/png/link-logo.png' alt='link logo' height={24} width={24} />
        </label>
        <div className='flex justify-center items-center p-4 gap-4'>
          <img
            className='rounded-lg '
            src={data.image}
            height={36}
            width={36}
            alt='link logo'
          />
          <p>{data.address}</p>
        </div>
      </div>
      <Handle
        type='target'
        position={Position.Left}
        id='a'
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default Account;
