# SailFish DEX Bridge Example with Create React App

This is a Create React App example project demonstrating how to use the SailFish DEX Bridge Widget with RainbowKit and wagmi for wallet connection.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

This example demonstrates how to:

1. Set up RainbowKit and wagmi for wallet connection in a Create React App project
2. Use the SailFish DEX Bridge Widget embedded directly in the page
3. Pass the connected wallet's signer to the Bridge Widget
4. Handle successful bridge transactions and errors
5. Implement client-side rendering with mounting checks to prevent errors

## Project Structure

- `public/`: Static assets and HTML template
- `src/App.js`: Main application component with embedded bridge widget
- `src/App.css`: Styles for the main application
- `src/index.js`: Entry point that sets up RainbowKit and wagmi providers
- `src/wagmi.js`: Configuration for wagmi and RainbowKit, including custom chain setup for EDUCHAIN

## How It Works

### Wallet Connection with RainbowKit

The app uses RainbowKit and wagmi for wallet connection:

```jsx
// In index.js
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
```

### Preventing Rendering Errors

This example demonstrates techniques to prevent React rendering errors when using components that access browser APIs:

1. **Delaying Rendering Until Client-Side**:
   ```jsx
   // In App.js
   const [mounted, setMounted] = useState(false);
   
   // Only show the UI after mounting to prevent hydration errors
   useEffect(() => {
     setMounted(true);
   }, []);
   
   // Prevent rendering until mounted
   if (!mounted) return null;
   ```

2. **Proper Client-Side Checks**:
   ```jsx
   // Only execute client-side code when window is defined
   if (!mounted || !isConnected || typeof window === 'undefined' || !window.ethereum) {
     console.log("Not connected or no window.ethereum");
     setEthersSigner(null);
     return;
   }
   ```

### Converting wagmi to ethers signer

The app converts the wagmi connection to an ethers signer for use with the Bridge Widget:

```jsx
// In App.js
useEffect(() => {
  if (!mounted || !isConnected || typeof window === 'undefined' || !window.ethereum) {
    console.log("Not connected or no window.ethereum");
    setEthersSigner(null);
    return;
  }
  
  const getSigner = async () => {
    try {
      console.log("Getting signer...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Signer obtained:", signer);
      setEthersSigner(signer);
    } catch (error) {
      console.error('Failed to get ethers signer:', error);
      setEthersSigner(null);
    }
  };
  
  getSigner();
}, [mounted, isConnected, address, chain]);
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

To learn more about Create React App, check out the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
