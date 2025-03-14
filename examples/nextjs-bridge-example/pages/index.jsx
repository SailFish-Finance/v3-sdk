import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>SailFish DEX - Bridge Examples</title>
        <meta name="description" content="Bridge EDU tokens between chains" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          SailFish DEX Bridge Examples
        </h1>

        <p className="description">
          Choose a bridge implementation example
        </p>

        <div className="examples-grid">
          <Link href="/with-signer" className="example-card">
            <h2>Popup Bridge &rarr;</h2>
            <p>Bridge with a popup overlay that appears when needed</p>
          </Link>

          <Link href="/embedded" className="example-card">
            <h2>Embedded Bridge &rarr;</h2>
            <p>Bridge directly embedded in the page content (dynamic import)</p>
          </Link>
          
          <Link href="/embedded-simple" className="example-card">
            <h2>Simple Embedded Bridge &rarr;</h2>
            <p>Bridge embedded with client-side rendering and mounting checks</p>
          </Link>
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

        .examples-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          gap: 2rem;
        }

        .example-card {
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #1e293b;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 300px;
          background-color: #1a1b23;
        }

        .example-card:hover,
        .example-card:focus,
        .example-card:active {
          color: #0ea5e9;
          border-color: #0ea5e9;
        }

        .example-card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .example-card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
          color: #94a3b8;
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
