import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { bsc, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// Define EDUCHAIN as a custom chain
const educhain = {
  id: 41923,
  name: 'EDUCHAIN',
  iconUrl: "https://app.sailfish.finance/svgs/edu.svg",
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

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [bsc, arbitrum, educhain],
  [publicProvider()]
);

// Set up connectors
const { connectors } = getDefaultWallets({
  appName: 'SailFish DEX Bridge',
  projectId: 'e906359052f14dc91a63a2b14221e22e',
  chains,
});

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
