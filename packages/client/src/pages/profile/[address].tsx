'use client';

import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

import Create from '@/components/Create';
import Layout from '@/components/layout/Layout';
import ProfileENS from '@/components/ProfileENS';

export default function Profile() {
  const router = useRouter();
  const { address } = router.query;
  const tabs = ['Create', 'Wallet'];
  const account = useAccount();

  const [currentTab, setCurrentTab] = useState<number>(0);

  const isProfile = useMemo(() => {
    if (!address || !account) {
      return false;
    }
    return (
      String(address).toLowerCase() === String(account.address).toLowerCase()
    );
  }, [address, account.address]);

  return (
    <Layout>
      <div className='flex py-8 justify-between'>
        {address && (
          <div>
            <ProfileENS address={address as string} />
          </div>
        )}
      </div>
      <div role='tablist' className='tabs tabs-lifted tabs-lg flex'>
        {tabs.map((tab, index) => (
          <h1
            key={index}
            role='tab'
            className={`tab text-gray-500 ${
              currentTab === index && 'tab-active'
            }`}
            onClick={() => setCurrentTab(index)}
          >
            {tab}
          </h1>
        ))}
        <div className='border-b w-full'></div>
      </div>
      <div className='py-8 w-full'>
        {currentTab === 0 ? (
          <Create isProfile={isProfile} owner={address as string}/>
        ) : (
          <div className='grid gap-4 grid-cols-2 mx-4 min-h-main'>
            <div>Caculate</div>
          </div>
        )}
      </div>
      {/* <div className="flex mx-6">
        {
          isProfile
          ? "Profile"
          : "Not Profile"
        }
      </div> */}
    </Layout>
  );
}
