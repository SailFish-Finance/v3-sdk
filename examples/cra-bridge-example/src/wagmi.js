import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { arbitrum, bsc, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// Custom chain for EDUCHAIN
const educhain = {
  id: 41923,
  name: 'EDUCHAIN',
  network: 'educhain',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    public: { http: ['https://rpc.edu-chain.raas.gelato.cloud'] },
    default: { http: ['https://rpc.edu-chain.raas.gelato.cloud'] },
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://educhain.blockscout.com' },
  },
};

// Configure chains & providers with the public provider
export const { chains, publicClient } = configureChains(
  [educhain, arbitrum, bsc, mainnet],
  [publicProvider()]
);

// Set up wagmi config with RainbowKit
const { connectors } = getDefaultWallets({
  appName: 'SailFish DEX Bridge',
  projectId: 'e906359052f14dc91a63a2b14221e22e', // Replace with your WalletConnect project ID in production
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
