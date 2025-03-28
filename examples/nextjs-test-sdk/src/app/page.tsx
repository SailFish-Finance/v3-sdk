"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BridgeWidget } from "@sailfishdex/v3-sdk";
import { ethers } from "ethers";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function EmbeddedSimplePage() {
  const [ethersSigner, setEthersSigner] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chainId } = useAccount();

  // Only show the UI after mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // For debugging
  useEffect(() => {
    if (mounted) {
      console.log("Simple page - Connected:", isConnected);
      console.log("Simple page - Signer:", ethersSigner);
      console.log("Simple page - Chain:", chainId);
    }
  }, [mounted, isConnected, ethersSigner, chainId]);

  // Convert wagmi state to ethers signer
  useEffect(() => {
    if (
      !mounted ||
      !isConnected ||
      typeof window === "undefined" ||
      !window.ethereum
    ) {
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
        console.error("Failed to get ethers signer:", error);
        setEthersSigner(null);
      }
    };

    getSigner();
  }, [mounted, isConnected, address, chainId]);

  const handleSuccess = (txHash: string) => {
    console.log("Bridge transaction successful:", txHash);
    alert(`Bridge transaction successful! TX Hash: ${txHash}`);
  };

  const handleError = (error: any) => {
    console.error("Bridge error:", error);
    alert(`Bridge error: ${error.message || error}`);
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) return null;

  return (
    <div className="min-h-dvh w-full container mx-auto">
      <Head>
        <title>SailFish DEX - Simple Embedded Bridge</title>
        <meta name="description" content="Bridge EDU tokens between chains" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Bridge EDU</h2>
        </div>
        <div className="navbar-connect">
          <ConnectButton />
        </div>
      </nav>

      <main className="main">
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
              onClose={() => console.log("Bridge widget closed")} //when used as a popup
              isPopup={false}
              signer={ethersSigner}
              defaultFromChain={
                chainId === 56
                  ? "bsc"
                  : chainId === 42161
                  ? "arbitrum"
                  : "educhain"
              }
              defaultToChain="arbitrum"
              defaultAmount="1"
              onSuccess={handleSuccess}
              onError={handleError}
              theme="edu.fun"
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
          padding: 5rem 2rem 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
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

        .navbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #1a2236;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar-brand h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #fff;
          background: linear-gradient(to right, #3b82f6, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .navbar-connect {
          display: flex;
          justify-content: flex-end;
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
