import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';

// Dynamically import BridgeWidget with SSR disabled to prevent hydration errors
const BridgeWidget = dynamic(
  () => import('sailfish-v3-sdk').then((mod) => mod.BridgeWidget),
  { ssr: false }
);

export default function BridgePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [ethersSigner, setEthersSigner] = useState(null);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  
  // For debugging
  useEffect(() => {
    console.log("Popup state:", showPopup);
    console.log("Connected:", isConnected);
    console.log("Signer:", ethersSigner);
    console.log("Chain:", chain);
  }, [showPopup, isConnected, ethersSigner, chain]);
  
  // Debug button click
  const handleButtonClick = () => {
    console.log("Bridge button clicked");
    setShowPopup(true);
    console.log("showPopup set to true");
  };
  
  // Convert wagmi state to ethers signer
  useEffect(() => {
    if (!isConnected || typeof window === 'undefined' || !window.ethereum) {
      setEthersSigner(null);
      return;
    }
    
    const getSigner = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setEthersSigner(signer);
        console.log("Signer obtained:", signer);
      } catch (error) {
        console.error('Failed to get ethers signer:', error);
        setEthersSigner(null);
      }
    };
    
    getSigner();
  }, [isConnected, address, chain]);
  
  const handleSuccess = (txHash) => {
    console.log('Bridge transaction successful:', txHash);
    // You can add additional logic here, like showing a success notification
    // Automatically close the popup after successful bridge
    setTimeout(() => setShowPopup(false), 3000);
  };
  
  const handleError = (error) => {
    console.error('Bridge error:', error);
    // You can add additional error handling logic here
  };
  
  return (
    <div className="bridge-popup-container">
      <div className="connect-button-container">
        <ConnectButton />
      </div>
      
      <button 
        className="bridge-button"
        onClick={handleButtonClick}
        disabled={!isConnected}
      >
        Bridge EDU Tokens
      </button>
      
      {!isConnected && (
        <p className="connect-message">Connect your wallet to use the bridge</p>
      )}
      
      {showPopup ? (
        <div className="popup-overlay">
          {ethersSigner ? (
            <BridgeWidget 
              isPopup={true}
              signer={ethersSigner}
              onClose={() => setShowPopup(false)}
              defaultFromChain={chain?.id === 56 ? "bsc" : chain?.id === 42161 ? "arbitrum" : "educhain"}
              defaultToChain="educhain"
              defaultAmount="10"
              onSuccess={handleSuccess}
              onError={handleError}
            />
          ) : (
            <div className="loading-widget">
              <p>Loading wallet connection...</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          )}
        </div>
      ) : null}
      
      <style jsx>{`
        .bridge-popup-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .connect-button-container {
          margin-bottom: 20px;
        }
        
        .bridge-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .bridge-button:hover:not(:disabled) {
          background-color: #2563eb;
        }
        
        .bridge-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }
        
        .connect-message {
          color: #94a3b8;
          font-size: 14px;
          margin-top: 8px;
        }
        
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .loading-widget {
          background-color: #1a1b23;
          color: #ffffff;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 480px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }
        
        .loading-widget button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
