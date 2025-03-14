import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import BridgeWidget with SSR disabled to prevent hydration errors
const BridgeWidget = dynamic(
  () => import('sailfish-v3-sdk').then((mod) => mod.BridgeWidget),
  { ssr: false }
);

export default function WithSignerPage({ signer }) {
  return (
    <div className="container">
      <Head>
        <title>SailFish DEX - Bridge with Signer</title>
        <meta name="description" content="Bridge EDU tokens between chains" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          SailFish DEX Bridge
        </h1>

        <p className="description">
          Bridge with pre-connected wallet
        </p>

        <div className="bridge-container">
          {signer ? (
            <BridgeWidget 
              signer={signer}
              defaultFromChain="bsc"
              defaultToChain="arbitrum"
              defaultAmount="10"
            />
          ) : (
            <p className="connect-message">Please connect your wallet</p>
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

        .bridge-container {
          margin-top: 2rem;
        }

        .connect-message {
          padding: 1rem 2rem;
          background-color: #1e293b;
          border-radius: 0.5rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
