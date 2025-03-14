"use client";

import {
  darkTheme,
  DisclaimerComponent,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { config } from "./config";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
  cookie: string | null;
};

export const WagProvider = ({ children, cookie }: Props) => {
  const initialState = cookieToInitialState(config, cookie);
  const Disclaimer: DisclaimerComponent = ({ Text }) => <Text> </Text>;
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={false}
          appInfo={{
            appName: "SailFish",
            disclaimer: Disclaimer,
          }}
          modalSize="compact"
          theme={darkTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
