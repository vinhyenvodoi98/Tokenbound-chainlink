import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import {
  avalanche,
  avalancheFuji,
  goerli,
  mainnet,
  polygonMumbai,
  polygonZkEvm,
  polygonZkEvmTestnet,
} from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient } = configureChains(
  [
    ...(process.env.NODE_ENV === 'development'
      ? [polygonMumbai, goerli, avalancheFuji, polygonZkEvmTestnet, mainnet]
      : [
          polygonMumbai,
          goerli,
          avalanche,
          polygonZkEvmTestnet,
          polygonZkEvm,
          mainnet,
        ]),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === mainnet.id)
          return {
            http: mainnet.rpcUrls.public.http[0],
          };

        if (chain.id === goerli.id)
          return {
            http: goerli.rpcUrls.public.http[0],
          };

        if (chain.id === polygonMumbai.id)
          return {
            http: polygonMumbai.rpcUrls.public.http[0],
          };

        if (chain.id === avalancheFuji.id)
          return {
            http: avalancheFuji.rpcUrls.public.http[0],
          };

        if (chain.id === avalanche.id)
          return {
            http: avalanche.rpcUrls.public.http[0],
          };

        if (chain.id === polygonZkEvmTestnet.id)
          return {
            http: polygonZkEvmTestnet.rpcUrls.public.http[0],
          };

        if (chain.id === polygonZkEvm.id)
          return {
            http: polygonZkEvm.rpcUrls.public.http[0],
          };

        return null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
  projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
