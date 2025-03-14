// Example of using the BridgeWidget component in a React application

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { BridgeWidget } from 'sailfish-v3-sdk';

function BridgeWidgetExample() {
  const [showPopup, setShowPopup] = useState(false);
  
  // Function to handle successful bridge
  const handleSuccess = (txHash) => {
    console.log('Bridge transaction successful:', txHash);
    // You can add additional logic here, like showing a success notification
  };
  
  // Function to handle errors
  const handleError = (error) => {
    console.error('Bridge error:', error);
    // You can add additional error handling logic here
  };
  
  return (
    <div className="container">
      <h1>SailFish DEX Bridge</h1>
      
      {/* Button to open the bridge widget as a popup */}
      <button 
        className="open-bridge-button"
        onClick={() => setShowPopup(true)}
      >
        Open Bridge
      </button>
      
      {/* Embedded bridge widget (always visible) */}
      <div className="embedded-widget">
        <h2>Embedded Bridge Widget</h2>
        <BridgeWidget 
          defaultFromChain="bsc"
          defaultToChain="arbitrum"
          defaultAmount="10"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
      
      {/* Popup bridge widget (shown conditionally) */}
      {showPopup && (
        <div className="popup-overlay">
          <BridgeWidget 
            isPopup={true}
            onClose={() => setShowPopup(false)}
            defaultFromChain="arbitrum"
            defaultToChain="educhain"
            onSuccess={(txHash) => {
              handleSuccess(txHash);
              // Automatically close the popup after successful bridge
              setTimeout(() => setShowPopup(false), 3000);
            }}
            onError={handleError}
          />
        </div>
      )}
      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .open-bridge-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 40px;
        }
        
        .embedded-widget {
          margin-top: 40px;
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
      `}</style>
    </div>
  );
}

export default BridgeWidgetExample;

// Usage in a Next.js page:
/*
import BridgeWidgetExample from '../components/BridgeWidgetExample';

export default function BridgePage() {
  return (
    <div>
      <BridgeWidgetExample />
    </div>
  );
}
*/

// Usage with a custom signer:
/*
import { ethers } from 'ethers';
import { BridgeWidget } from 'sailfish-v3-sdk';

function BridgeWithCustomSigner() {
  const [signer, setSigner] = useState(null);
  
  // Initialize signer when component mounts
  useEffect(() => {
    const initSigner = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const connectedSigner = await provider.getSigner();
        setSigner(connectedSigner);
      }
    };
    
    initSigner();
  }, []);
  
  return (
    <div>
      {signer ? (
        <BridgeWidget signer={signer} />
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}
*/
