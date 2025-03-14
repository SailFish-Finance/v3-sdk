import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Bridge } from '../bridge';

// Add window.ethereum type definition
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Types
type ChainType = 'bsc' | 'arbitrum' | 'educhain';

interface BridgeWidgetProps {
  onClose?: () => void;
  isPopup?: boolean;
  defaultFromChain?: ChainType;
  defaultToChain?: ChainType;
  defaultAmount?: string;
  signer?: ethers.Signer;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

// Chain configurations
const CHAINS = {
  bsc: {
    name: 'BSC',
    icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: 56,
    explorerUrl: 'https://bscscan.com',
    eduAddress: '0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639',
    nativeSymbol: 'BNB',
  },
  arbitrum: {
    name: 'Arbitrum',
    icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    explorerUrl: 'https://arbiscan.io',
    eduAddress: '0xf8173a39c56a554837C4C7f104153A005D284D11',
    nativeSymbol: 'ETH',
  },
  educhain: {
    name: 'EDUCHAIN',
    icon: '/svgs/edu-chain.svg', // Assuming this path exists in the host application
    rpcUrl: 'https://rpc.edu-chain.raas.gelato.cloud',
    chainId: 41923,
    explorerUrl: 'https://educhain.blockscout.com',
    eduAddress: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12',
    nativeSymbol: 'EDU',
  },
};

// Allowed bridge paths
const ALLOWED_PATHS = [
  { from: 'bsc', to: 'arbitrum' },
  { from: 'arbitrum', to: 'educhain' },
];

const BridgeWidget: React.FC<BridgeWidgetProps> = ({
  onClose,
  isPopup = false,
  defaultFromChain = 'bsc',
  defaultToChain = 'arbitrum',
  defaultAmount = '0',
  signer,
  onSuccess,
  onError,
}) => {
  // State
  const [fromChain, setFromChain] = useState<ChainType>(defaultFromChain);
  const [toChain, setToChain] = useState<ChainType>(defaultToChain);
  const [amount, setAmount] = useState(defaultAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'approval' | 'confirmation' | 'processing' | 'complete'>('input');
  const [fee, setFee] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Initialize signer and check wallet connection
  useEffect(() => {
    const initSigner = async () => {
      if (signer) {
        setCurrentSigner(signer);
        const address = await signer.getAddress();
        setUserAddress(address);
        return;
      }

      // If no signer provided, try to get one from window.ethereum
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const connectedSigner = await provider.getSigner();
          setCurrentSigner(connectedSigner);
          const address = await connectedSigner.getAddress();
          setUserAddress(address);
        } catch (err) {
          console.error('Failed to connect wallet:', err);
          setError('Please connect your wallet to use the bridge.');
        }
      } else {
        setError('No wallet detected. Please install MetaMask or another web3 wallet.');
      }
    };

    initSigner();
  }, [signer]);

  // Check if the selected path is valid
  const isValidPath = ALLOWED_PATHS.some(
    (path) => path.from === fromChain && path.to === toChain
  );

  // Switch chains when from/to changes
  useEffect(() => {
    if (!isValidPath) {
      // Find a valid path that includes the fromChain
      const validPath = ALLOWED_PATHS.find((path) => path.from === fromChain);
      if (validPath) {
        setToChain(validPath.to as ChainType);
      }
    }
  }, [fromChain, isValidPath]);

  // Update fee and balance when parameters change
  useEffect(() => {
    const updateFeeAndBalance = async () => {
      if (!currentSigner || !userAddress || !isValidPath || !amount || parseFloat(amount) <= 0) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Create bridge instance
        const bridge = new Bridge(currentSigner);

        // Check balance
        let hasEnough = false;
        if (fromChain === 'bsc') {
          hasEnough = await bridge.hasEnoughEdu(userAddress, amount);
          
          // Get fee for BSC to Arbitrum
          if (toChain === 'arbitrum') {
            const estimatedFee = await bridge.estimateBridgeFee(amount, userAddress);
            setFee(`${estimatedFee} BNB`);
            
            // Check if approved
            const approved = await bridge.isEduApproved(userAddress, amount);
            setIsApproved(approved);
          }
        } else if (fromChain === 'arbitrum') {
          hasEnough = await bridge.hasEnoughEduOnArb(userAddress, amount);
          
          // Check if approved for Arbitrum to EDUCHAIN
          if (toChain === 'educhain') {
            const approved = await bridge.isEduApprovedOnArb(userAddress, amount);
            setIsApproved(approved);
            setFee('Gas fee only');
          }
        }

        if (!hasEnough) {
          setError(`Insufficient EDU balance on ${CHAINS[fromChain].name}`);
        } else {
          setError(null);
        }

        // Get balance
        const provider = currentSigner.provider as ethers.Provider;
        const eduContract = new ethers.Contract(
          CHAINS[fromChain].eduAddress,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        );
        
        const decimals = await eduContract.decimals();
        const balanceWei = await eduContract.balanceOf(userAddress);
        const balanceFormatted = ethers.formatUnits(balanceWei, decimals);
        setBalance(balanceFormatted);
      } catch (err) {
        console.error('Error updating fee and balance:', err);
        setError('Failed to get fee or balance information');
      } finally {
        setLoading(false);
      }
    };

    updateFeeAndBalance();
  }, [currentSigner, userAddress, fromChain, toChain, amount, isValidPath]);

  // Handle chain switch
  const handleChainSwitch = async () => {
    if (!currentSigner) return;
    
    const provider = currentSigner.provider as ethers.Provider;
    const network = await provider.getNetwork();
    const currentChainId = network.chainId;
    const targetChainId = CHAINS[fromChain].chainId;
    
    if (currentChainId !== BigInt(targetChainId)) {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${targetChainId.toString(16)}` }],
          });
        } catch (err) {
          console.error('Failed to switch network:', err);
          setError(`Please switch your wallet to ${CHAINS[fromChain].name} network`);
        }
      }
    }
  };

  // Handle approval
  const handleApprove = async () => {
    if (!currentSigner || !userAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const bridge = new Bridge(currentSigner);
      
      // Approve based on the chain
      let tx: ethers.TransactionResponse | undefined;
      if (fromChain === 'bsc') {
        tx = await bridge.approveEdu(amount);
      } else if (fromChain === 'arbitrum') {
        tx = await bridge.approveEduOnArb(amount);
      }
      
      if (!tx) {
        throw new Error('Failed to create approval transaction');
      }
      
      setStep('approval');
      await tx.wait();
      setIsApproved(true);
      setStep('confirmation');
    } catch (err) {
      console.error('Approval failed:', err);
      setError('Failed to approve tokens');
    } finally {
      setLoading(false);
    }
  };

  // Handle bridge
  const handleBridge = async () => {
    if (!currentSigner || !userAddress || !isValidPath) return;
    
    setLoading(true);
    setError(null);
    setStep('processing');
    
    try {
      const bridge = new Bridge(currentSigner);
      
      // Execute bridge based on the path
      let tx: ethers.TransactionResponse | undefined;
      if (fromChain === 'bsc' && toChain === 'arbitrum') {
        tx = await bridge.bridgeEduFromBscToArb(amount, userAddress);
      } else if (fromChain === 'arbitrum' && toChain === 'educhain') {
        tx = await bridge.bridgeEduFromArbToEdu(amount);
      }
      
      if (!tx) {
        throw new Error('Failed to create bridge transaction');
      }
      
      await tx.wait();
      setSuccess(tx.hash);
      setStep('complete');
      
      if (onSuccess) {
        onSuccess(tx.hash);
      }
    } catch (err) {
      console.error('Bridge failed:', err);
      setError('Failed to bridge tokens');
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render the widget
  return (
    <div className={`bridge-widget ${isPopup ? 'bridge-widget-popup' : ''}`}>
      {isPopup && (
        <div className="bridge-widget-header">
          <h2>Bridge EDU Tokens</h2>
          {onClose && (
            <button className="bridge-widget-close" onClick={onClose}>
              ×
            </button>
          )}
        </div>
      )}

      <div className="bridge-widget-content">
        {step === 'input' && (
          <>
            <div className="bridge-widget-chains">
              <div className="bridge-widget-chain">
                <label>From</label>
                <select
                  value={fromChain}
                  onChange={(e) => setFromChain(e.target.value as ChainType)}
                  disabled={loading}
                >
                  {Object.entries(CHAINS).map(([key, chain]) => (
                    <option key={key} value={key}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="bridge-widget-chain-arrow">→</div>
              
              <div className="bridge-widget-chain">
                <label>To</label>
                <select
                  value={toChain}
                  onChange={(e) => setToChain(e.target.value as ChainType)}
                  disabled={loading}
                >
                  {Object.entries(CHAINS).map(([key, chain]) => (
                    <option 
                      key={key} 
                      value={key}
                      disabled={!ALLOWED_PATHS.some(
                        (path) => path.from === fromChain && path.to === key
                      )}
                    >
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bridge-widget-amount">
              <label>Amount</label>
              <div className="bridge-widget-amount-input">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  placeholder="0.0"
                  min="0"
                  step="0.01"
                />
                <span>EDU</span>
              </div>
              {balance && (
                <div className="bridge-widget-balance">
                  Balance: {parseFloat(balance).toFixed(4)} EDU
                  <button 
                    onClick={() => setAmount(balance)}
                    className="bridge-widget-max-button"
                  >
                    MAX
                  </button>
                </div>
              )}
            </div>

            {fee && (
              <div className="bridge-widget-fee">
                Estimated Fee: {fee}
              </div>
            )}

            {error && (
              <div className="bridge-widget-error">
                {error}
              </div>
            )}

            <div className="bridge-widget-actions">
              {!currentSigner ? (
                <button 
                  className="bridge-widget-button bridge-widget-connect"
                  onClick={handleChainSwitch}
                >
                  Connect Wallet
                </button>
              ) : !isApproved ? (
                <button 
                  className="bridge-widget-button bridge-widget-approve"
                  onClick={handleApprove}
                  disabled={loading || !!error || !isValidPath || !amount || parseFloat(amount) <= 0}
                >
                  {loading ? 'Approving...' : 'Approve'}
                </button>
              ) : (
                <button 
                  className="bridge-widget-button bridge-widget-bridge"
                  onClick={handleBridge}
                  disabled={loading || !!error || !isValidPath || !amount || parseFloat(amount) <= 0}
                >
                  {loading ? 'Processing...' : 'Bridge'}
                </button>
              )}
            </div>
          </>
        )}

        {step === 'approval' && (
          <div className="bridge-widget-step">
            <h3>Approving Tokens</h3>
            <div className="bridge-widget-loader"></div>
            <p>Please confirm the transaction in your wallet...</p>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="bridge-widget-step">
            <h3>Ready to Bridge</h3>
            <p>You're about to bridge {amount} EDU from {CHAINS[fromChain].name} to {CHAINS[toChain].name}.</p>
            {fee && <p>Estimated Fee: {fee}</p>}
            <button 
              className="bridge-widget-button bridge-widget-bridge"
              onClick={handleBridge}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Bridge'}
            </button>
            <button 
              className="bridge-widget-button bridge-widget-back"
              onClick={() => setStep('input')}
              disabled={loading}
            >
              Back
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="bridge-widget-step">
            <h3>Bridging in Progress</h3>
            <div className="bridge-widget-loader"></div>
            <p>Please confirm the transaction in your wallet...</p>
          </div>
        )}

        {step === 'complete' && (
          <div className="bridge-widget-step">
            <h3>Bridge Successful!</h3>
            <div className="bridge-widget-success">✓</div>
            <p>You've successfully initiated the bridge of {amount} EDU from {CHAINS[fromChain].name} to {CHAINS[toChain].name}.</p>
            <p>The tokens will arrive in your wallet on {CHAINS[toChain].name} shortly.</p>
            {success && (
              <a 
                href={`${CHAINS[fromChain].explorerUrl}/tx/${success}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bridge-widget-link"
              >
                View Transaction
              </a>
            )}
            <button 
              className="bridge-widget-button bridge-widget-new"
              onClick={() => {
                setStep('input');
                setSuccess(null);
                setAmount('0');
              }}
            >
              New Bridge
            </button>
          </div>
        )}
      </div>

      <div className="bridge-widget-footer">
        <p>Powered by SailFish DEX</p>
      </div>

      <style>{`
        .bridge-widget {
          font-family: 'Inter', sans-serif;
          background-color: #1a1b23;
          color: #ffffff;
          border-radius: 12px;
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .bridge-widget-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        }

        .bridge-widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #2d2e36;
        }

        .bridge-widget-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .bridge-widget-close {
          background: none;
          border: none;
          color: #8f8f8f;
          font-size: 24px;
          cursor: pointer;
        }

        .bridge-widget-content {
          padding: 24px;
          min-height: 300px;
        }

        .bridge-widget-chains {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .bridge-widget-chain {
          flex: 1;
        }

        .bridge-widget-chain label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #8f8f8f;
        }

        .bridge-widget-chain select {
          width: 100%;
          padding: 12px;
          background-color: #2d2e36;
          border: 1px solid #3a3b43;
          border-radius: 8px;
          color: #ffffff;
          font-size: 16px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238f8f8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .bridge-widget-chain-arrow {
          margin: 0 12px;
          font-size: 20px;
          color: #8f8f8f;
        }

        .bridge-widget-amount {
          margin-bottom: 24px;
        }

        .bridge-widget-amount label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #8f8f8f;
        }

        .bridge-widget-amount-input {
          display: flex;
          align-items: center;
          background-color: #2d2e36;
          border: 1px solid #3a3b43;
          border-radius: 8px;
          overflow: hidden;
        }

        .bridge-widget-amount-input input {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 16px;
        }

        .bridge-widget-amount-input span {
          padding: 0 12px;
          color: #8f8f8f;
        }

        .bridge-widget-balance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 14px;
          color: #8f8f8f;
        }

        .bridge-widget-max-button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .bridge-widget-fee {
          margin-bottom: 24px;
          padding: 12px;
          background-color: #2d2e36;
          border-radius: 8px;
          font-size: 14px;
        }

        .bridge-widget-error {
          margin-bottom: 24px;
          padding: 12px;
          background-color: rgba(239, 68, 68, 0.1);
          border-left: 3px solid #ef4444;
          border-radius: 4px;
          color: #ef4444;
          font-size: 14px;
        }

        .bridge-widget-actions {
          display: flex;
          justify-content: center;
        }

        .bridge-widget-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 100%;
        }

        .bridge-widget-connect {
          background-color: #3b82f6;
          color: #ffffff;
        }

        .bridge-widget-approve {
          background-color: #8b5cf6;
          color: #ffffff;
        }

        .bridge-widget-bridge {
          background-color: #10b981;
          color: #ffffff;
        }

        .bridge-widget-back {
          background-color: #6b7280;
          color: #ffffff;
          margin-top: 12px;
        }

        .bridge-widget-new {
          background-color: #3b82f6;
          color: #ffffff;
        }

        .bridge-widget-button:hover {
          opacity: 0.9;
        }

        .bridge-widget-button:disabled {
          background-color: #4b5563;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .bridge-widget-step {
          text-align: center;
        }

        .bridge-widget-step h3 {
          margin-bottom: 24px;
          font-size: 18px;
          font-weight: 600;
        }

        .bridge-widget-loader {
          margin: 0 auto 24px;
          width: 48px;
          height: 48px;
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-left-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .bridge-widget-success {
          margin: 0 auto 24px;
          width: 48px;
          height: 48px;
          background-color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #ffffff;
        }

        .bridge-widget-link {
          display: inline-block;
          margin: 16px 0;
          color: #3b82f6;
          text-decoration: none;
        }

        .bridge-widget-link:hover {
          text-decoration: underline;
        }

        .bridge-widget-footer {
          padding: 12px 24px;
          border-top: 1px solid #2d2e36;
          text-align: center;
          font-size: 12px;
          color: #8f8f8f;
        }
      `}</style>
    </div>
  );
};

export default BridgeWidget;
