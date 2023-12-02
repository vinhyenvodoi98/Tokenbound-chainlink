import { useEffect, useState } from 'react';

import { shortenAddress } from '@/utils/addresses';
import apiOpenseaCall from '@/utils/opensea';

import Copy from '../Copy';
import Registry from '../Registry';

interface CreateInterface {
  isProfile: boolean;
  owner: string;
}

interface OpenseaNFTInterface {
  nfts: any[];
}

export default function Create({ isProfile, owner }: CreateInterface) {
  const [NFTs, setNFTs] = useState<any>([]);
  useEffect(() => {
    const fetchData = async (address: string) => {
      try {
        const ethereum: OpenseaNFTInterface = await apiOpenseaCall({
          url: `chain/ethereum/account/${address}/nfts?limit=50`,
        });
        setNFTs(ethereum.nfts.filter((nft) => nft.token_standard === 'erc721')); // TODO try with erc1155
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (owner) fetchData(owner);
  }, [owner]);

  const handleModal = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementById('create-tokenbound-modal ').showModal();
  };

  return (
    <div className='w-full grid grid-cols-6 gap-4 place-content-center'>
      {isProfile && (
        <div
          onClick={() => handleModal()}
          className='h-72 w-full font-bold border-2 border-gray-500 cursor-pointer bg-gray-600 rounded-lg flex justify-center items-center'
        >
          Custom create
        </div>
      )}

      {NFTs.map((nft: any, index: number) => (
        <div
          key={index}
          className='h-72 w-full font-bold border-2 border-gray-500 cursor-pointer rounded-2xl flex justify-center items-center'
        >
          <div className='card h-72 card-compact shadow-xl'>
            <figure>
              <img
                className='object-cover'
                src={nft.image_url}
                alt={nft.name}
              />
            </figure>
            <div className='card-body'>
              <h2 className='card-title'>{nft.collection}</h2>
              <div className='grid grid-cols-4 gap-2 place-content-center'>
                <p className='col-span-2'>{shortenAddress(nft.contract)}</p>
                <Copy text={nft.contract} />
              </div>
              <p>#{nft.identifier}</p>
            </div>
          </div>
        </div>
      ))}

      <dialog id='create-tokenbound-modal ' className='modal'>
        <div className='modal-box text-black w-11/12 max-w-5xl'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Create</h3>
          <div className='grid grid-col-3 gap-4'>
            <Registry />
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
