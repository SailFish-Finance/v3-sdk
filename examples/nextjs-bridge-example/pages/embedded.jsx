import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';

// Dynamically import BridgeWidget with SSR disabled to prevent hydration errors
const BridgeWidget = dynamic(
  () => import('sailfish-v3-sdk').then((mod) => mod.BridgeWidget),
  { ssr: false }
);

export default function EmbeddedBridgePage() {
  const [ethersSigner, setEthersSigner] = useState(null);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  
  // For debugging
  useEffect(() => {
    console.log("Embedded page - Connected:", isConnected);
    console.log("Embedded page - Signer:", ethersSigner);
    console.log("Embedded page - Chain:", chain);
  }, [isConnected, ethersSigner, chain]);
  
  // Convert wagmi state to ethers signer
  useEffect(() => {
    if (!isConnected || typeof window === 'undefined' || !window.ethereum) {
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
  }, [isConnected, address, chain]);
  
  const handleSuccess = (txHash) => {
    console.log('Bridge transaction successful:', txHash);
    alert(`Bridge transaction successful! TX Hash: ${txHash}`);
  };
  
  const handleError = (error) => {
    console.error('Bridge error:', error);
    alert(`Bridge error: ${error.message || error}`);
  };
  
  return (
    <div className="container">
      <Head>
        <title>SailFish DEX - Embedded Bridge</title>
        <meta name="description" content="Bridge EDU tokens between chains" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          SailFish DEX Bridge
        </h1>

        <p className="description">
          Bridge your EDU tokens between BSC, Arbitrum, and EDUCHAIN
        </p>

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

      <footer className="footer">
        <p>Powered by SailFish DEX</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #0f172a;
          color: white;
        }

        .main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }

        .footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #1e293b;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #94a3b8;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
          background: linear-gradient(to right, #3b82f6, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 2rem 0;
          color: #94a3b8;
        }

        .connect-button-container {
          margin-bottom: 2rem;
        }

        .bridge-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .connect-message {
          padding: 2rem;
          background-color: #1e293b;
          border-radius: 0.5rem;
          color: #94a3b8;
          text-align: center;
        }

        .loading-widget {
          padding: 2rem;
          background-color: #1e293b;
          border-radius: 0.5rem;
          color: #94a3b8;
          text-align: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          background-color: #0f172a;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
