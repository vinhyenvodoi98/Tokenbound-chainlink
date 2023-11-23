'use client';

import Flow from "@/components/Flow";
import Layout from "@/components/layout/Layout";
import ProfileENS from "@/components/ProfileENS";
import { shortenAddress } from "@/utils/addresses";
import { useRouter } from 'next/router';
import { useMemo } from "react";
import { useAccount } from "wagmi";

export default function Profile() {
  const router = useRouter();
  const { address } = router.query;
  const account = useAccount();
  const isProfile = useMemo(
    () => {
      if(!address || !account) {return false}
      return String(address).toLowerCase() === String(account.address).toLowerCase()
    },
    [address, account.address],
  )

  return (
    <Layout>
      <div className="flex py-8 justify-between">
        {address &&
        <div>
          <ProfileENS address={address as string}/>
        </div>
        }
      </div>
      <div className="grid gap-4 grid-cols-2 min-h-main">
        <div>
          Caculate
        </div>
        <Flow />
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
