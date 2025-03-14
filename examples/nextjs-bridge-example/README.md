# SailFish DEX Bridge Example with RainbowKit

This is a Next.js example project demonstrating how to use the SailFish DEX Bridge Widget with RainbowKit and wagmi for wallet connection.

> **Important Note**: This example uses Next.js-specific techniques to prevent hydration errors when using React components that access browser APIs during server-side rendering.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

This example demonstrates how to:

1. Set up RainbowKit and wagmi for wallet connection
2. Use the SailFish DEX Bridge Widget as a popup
3. Pass the connected wallet's signer to the Bridge Widget
4. Handle successful bridge transactions and errors

## Project Structure

- `components/BridgePopup.jsx`: Component that implements the popup bridge widget with RainbowKit
- `lib/wagmi.js`: Configuration for wagmi and RainbowKit, including custom chain setup for EDUCHAIN
- `pages/index.jsx`: Home page with links to different bridge implementation examples
- `pages/with-signer.jsx`: Page that demonstrates using the bridge widget as a popup
- `pages/embedded.jsx`: Page that demonstrates using the bridge widget embedded directly in the page with dynamic imports
- `pages/embedded-simple.jsx`: Page that demonstrates using the bridge widget with client-side rendering and mounting checks
- `pages/_app.jsx`: App component that sets up RainbowKit and wagmi providers
- `pages/_document.jsx`: Custom document component for Next.js

## How It Works

### Wallet Connection with RainbowKit

The app uses RainbowKit and wagmi for wallet connection:

```jsx
// In _app.jsx
return (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <Component {...pageProps} signer={signer} />
    </RainbowKitProvider>
  </WagmiConfig>
);
```

### Preventing Hydration Errors

This example demonstrates multiple techniques to prevent React hydration errors when using components that access browser APIs:

1. **Dynamic Imports with SSR Disabled**:
   ```jsx
   // Import BridgeWidget with no SSR to prevent hydration errors
   const BridgeWidget = dynamic(
     () => import('sailfish-v3-sdk').then((mod) => mod.BridgeWidget),
     { ssr: false }
   );
   ```

2. **Delaying Rendering Until Client-Side**:
   ```jsx
   // In _app.jsx
   const [mounted, setMounted] = useState(false);
   
   // Only show the UI after mounting to prevent hydration errors
   useEffect(() => {
     setMounted(true);
   }, []);
   
   // Prevent hydration errors by not rendering until mounted
   if (!mounted) return null;
   ```

3. **Proper Client-Side Checks**:
   ```jsx
   // Only execute client-side code when window is defined
   if (typeof window !== 'undefined' && window.ethereum) {
     // Browser-only code
   }
   ```

4. **Component-Level Dynamic Imports**:
   ```jsx
   // In index.jsx
   // Import BridgePopup with no SSR to prevent hydration errors
   const BridgePopup = dynamic(() => import('../components/BridgePopup'), {
     ssr: false,
   });
   ```

### Converting wagmi to ethers signer

The app converts the wagmi connection to an ethers signer for use with the Bridge Widget:

```jsx
// In BridgePopup.jsx
useEffect(() => {
  const getSigner = async () => {
    if (isConnected && typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setEthersSigner(signer);
      } catch (error) {
        console.error('Failed to get ethers signer:', error);
      }
    } else {
      setEthersSigner(null);
    }
  };
  
  getSigner();
}, [isConnected, address, chain]);
```

## Important Notes

1. The example uses the WalletConnect project ID `e906359052f14dc91a63a2b14221e22e` for demonstration purposes. For production use, you should obtain your own project ID from [WalletConnect Cloud](https://cloud.walletconnect.com).

2. The example includes a custom chain configuration for EDUCHAIN:

```js
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
```

## Learn More

To learn more about the SailFish DEX Bridge Widget, check out the [SailFish DEX v3 SDK documentation](https://github.com/sailfishdex/v3-sdk).

For more information about RainbowKit, visit the [RainbowKit documentation](https://www.rainbowkit.com/docs/introduction).
