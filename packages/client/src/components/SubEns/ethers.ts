import { type PublicClient, usePublicClient, WalletClient, useWalletClient } from 'wagmi'
import { providers } from 'ethers'
import { type HttpTransport } from 'viem'
import { useEffect, useMemo, useState } from 'react'
import { ENS } from '@ensdomains/ensjs'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return useMemo(() => publicClientToProvider(publicClient), [publicClient])
}

export function useEns({ chainId = 11155111 }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  const [ens, setEns] = useState<any>()

  useEffect(() => {
    const setup = async () => {
      const { chain, transport } = walletClient as WalletClient
      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }

      const provider = new providers.Web3Provider(transport, network)
      const _ens = new ENS();
      await _ens.setProvider(provider as any);
      setEns(_ens)
    }
    if(walletClient) setup()
  }, [walletClient])

  return ens;
}
