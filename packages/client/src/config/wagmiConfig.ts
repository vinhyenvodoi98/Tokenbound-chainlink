import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import {
  avalanche,
  avalancheFuji,
  mainnet,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient } = configureChains(
  [
    ...(process.env.NODE_ENV === 'development'
      ? [polygonMumbai, sepolia, avalancheFuji, mainnet]
      : [polygonMumbai, sepolia, avalanche, mainnet]),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === mainnet.id)
          return {
            http: mainnet.rpcUrls.public.http[0],
          };

        if (chain.id === sepolia.id)
          return {
            http: sepolia.rpcUrls.public.http[0],
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
