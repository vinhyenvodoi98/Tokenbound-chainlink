import { shortenAddress } from "@/utils/addresses";
import Image from "next/image";
import { useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { CheckIcon, CopyIcon } from "../Icon";

export default function ProfileENS({address}:{address: string}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyUsername = (name : string) => {
    navigator.clipboard.writeText(name);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const { data: name } = useEnsName({
    address: address as `0x${string}` ,
    scopeKey: address as `0x${string}` || '',
    chainId: 1
  })

  const ensAvatar = useEnsAvatar({
    name,
    scopeKey: address as `0x${string}`,
    chainId: 1
  })
  return (
    <div className="flex flex-col items-start mt-4 ml-6">
      {
        ensAvatar.data
        ? <Image
          src={ensAvatar.data}
          style={{ borderRadius: '50%'}}
          width={96}
          height={96}
          alt="Avatar"
        />
        : <img src={`https://robohash.org/${address}&200x200`} className="border-2 mask mask-hexagon bg-indigo-300 h-24 w-24" alt="Avatar"/>
      }
      <div className="flex">
        <h1 className="text-3xl font-bold mt-4">{name || shortenAddress(address as `0x${string}`)}</h1>
        <button
          className="px-2 mt-4"
          onClick={() => handleCopyUsername( address as `0x${string}` )}
        >
          {isCopied ? <CheckIcon/> : <CopyIcon/>}
        </button>
      </div>
    </div>
  )
}