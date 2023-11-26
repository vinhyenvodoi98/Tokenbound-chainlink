import axios from 'axios';
import { useEffect, useState } from 'react';

export default function NFTImage({ token }: { token: any }) {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async (url: string) => {
      try {
        const response = await axios.get(url);

        setTokenInfo(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token && token[1].result) fetchData(token[1].result as any);
  }, [token]);

  return (
    <div className='h-40 flex justify-center items-center'>
      {token && token[1].result && tokenInfo && tokenInfo.image ? (
        <img
          className='h-40 object-cover'
          src={tokenInfo.image}
          alt='nft image'
        />
      ) : (
        <div className='skeleton h-32 w-full'></div>
      )}
    </div>
  );
}
