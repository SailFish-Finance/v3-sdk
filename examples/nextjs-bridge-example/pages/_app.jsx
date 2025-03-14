import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { wagmiConfig, chains } from '../lib/wagmi';

function MyApp({ Component, pageProps }) {
  const [signer, setSigner] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Only show the UI after mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Initialize ethers signer when account changes in wagmi
  useEffect(() => {
    if (!mounted) return;
    
    const initSigner = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const connectedSigner = await provider.getSigner();
          setSigner(connectedSigner);
        } catch (error) {
          console.error('Failed to initialize ethers signer:', error);
        }
      }
    };
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', initSigner);
      window.ethereum.on('chainChanged', initSigner);
      
      // Initial setup
      initSigner();
    }
    
    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initSigner);
        window.ethereum.removeListener('chainChanged', initSigner);
      }
    };
  }, [mounted]);
  
  // Prevent hydration errors by not rendering until mounted
  if (!mounted) return null;
  
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode>
        <Component {...pageProps} signer={signer} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
