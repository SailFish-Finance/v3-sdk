import {
  Chain,
  getDefaultConfig,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { ethers } from "ethers";
import { cookieStorage, createStorage, http } from "wagmi";
import { bsc, arbitrum } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

const { wallets } = getDefaultWallets();

export const educhain = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: "EDUCHAIN",
  iconUrl: "https://app.sailfish.finance/svgs/edu.svg",
  iconBackground: "#fff",
  nativeCurrency: { name: "EDUCHAIN", symbol: "EDU", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL!] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: process.env.NEXT_PUBLIC_BLOCK_SCOUT!,
    },
  },
} as const satisfies Chain;

export const provider = new ethers.JsonRpcProvider(
  educhain.rpcUrls.default.http[0]
);

export const config = getDefaultConfig({
  appName: "SailFish DEX Bridge",
  projectId,
  chains: [bsc,arbitrum,educhain],
  transports: {
    [educhain.id]: http(process.env.NEXT_PUBLIC_RPC_URL!),
  },
  wallets: [
    ...wallets,
    {
      groupName: "Others",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
  storage: createStorage({
    storage: cookieStorage,
  }),
});
