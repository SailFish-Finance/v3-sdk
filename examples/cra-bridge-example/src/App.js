import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { BridgeWidget } from 'sailfish-v3-sdk';
import './App.css';

function App() {
  const [ethersSigner, setEthersSigner] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  
  // Only show the UI after mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // For debugging
  useEffect(() => {
    if (mounted) {
      console.log("Connected:", isConnected);
      console.log("Signer:", ethersSigner);
      console.log("Chain:", chain);
    }
  }, [mounted, isConnected, ethersSigner, chain]);
  
  // Convert wagmi state to ethers signer
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
  
  const handleSuccess = (txHash) => {
    console.log('Bridge transaction successful:', txHash);
    alert(`Bridge transaction successful! TX Hash: ${txHash}`);
  };
  
  const handleError = (error) => {
    console.error('Bridge error:', error);
    alert(`Bridge error: ${error.message || error}`);
  };
  
  // Prevent rendering until mounted
  if (!mounted) return null;
  
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">SailFish DEX Bridge</h1>
        <p className="App-description">
          Bridge your EDU tokens between BSC, Arbitrum, and EDUCHAIN
        </p>
      </header>
      
      <main className="App-main">
        <div className="connect-button-container">
          <ConnectButton />
        </div>
        
        <div className="bridge-container">
          {!isConnected ? (
            <div className="connect-message">
              <p>Please connect your wallet to use the bridge</p>
            </div>
          ) : !ethersSigner ? (
            <div className="loading-widget">
              <p>Loading wallet connection...</p>
            </div>
          ) : (
            <BridgeWidget 
              isPopup={false}
              signer={ethersSigner}
              defaultFromChain={chain?.id === 56 ? "bsc" : chain?.id === 42161 ? "arbitrum" : "educhain"}
              defaultToChain="educhain"
              defaultAmount="10"
              onSuccess={handleSuccess}
              onError={handleError}
            />
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Powered by SailFish DEX</p>
      </footer>
    </div>
  );
}

export default App;
