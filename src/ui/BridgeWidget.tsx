import { ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { Bridge } from "../bridge";
// import arbitrumLogo from "./assets/arbitrum.svg";
// import bnbLogo from "./assets/bnb.svg";
// import eduLogo from "./assets/edu.svg";
import Arbitrum from "./assets/arbitrum";
import Bnb from "./assets/bnb";
import Edu from "./assets/edu";
import "./fonts/fonts.css";

// SVG asset paths
// const bnbLogo = new URL("./assets/bnb.svg", import.meta.url).href;
// const arbitrumLogo = new URL("./assets/arbitrum.svg", import.meta.url).href;
// const eduLogo = new URL("./assets/edu.svg", import.meta.url).href;

// Add window.ethereum type definition
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Types
type ChainType = "bsc" | "arbitrum" | "educhain";
type TabType = "bta" | "ate"; // bsc to arbitrum, arbitrum to educhain

interface BridgeWidgetProps {
  onClose?: () => void;
  isPopup?: boolean;
  defaultFromChain?: ChainType;
  defaultToChain?: ChainType;
  defaultAmount?: string;
  signer?: ethers.Signer;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
  theme?: "sailer" | "edu.fun";
}

// Chain configurations
const CHAINS = {
  bsc: {
    name: "BNB Smart chain",
    icon: <Bnb />,
    rpcUrl: "https://bsc-dataseed1.bnbchain.org",
    chainId: 56,
    explorerUrl: "https://bscscan.com",
    eduAddress: "0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639",
    nativeSymbol: "BNB",
  },
  arbitrum: {
    name: "Arbitrum One",
    icon: <Arbitrum />,
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    chainId: 42161,
    explorerUrl: "https://arbiscan.io",
    eduAddress: "0xf8173a39c56a554837C4C7f104153A005D284D11",
    nativeSymbol: "ETH",
  },
  educhain: {
    name: "EDU chain",
    icon: <Edu />,
    rpcUrl: "https://rpc.edu-chain.raas.gelato.cloud",
    chainId: 41923,
    explorerUrl: "https://educhain.blockscout.com",
    eduAddress: "0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12",
    nativeSymbol: "EDU",
  },
};

// Allowed bridge paths
const ALLOWED_PATHS = [
  { from: "bsc", to: "arbitrum" },
  { from: "arbitrum", to: "educhain" },
];

// Helper components
const RightArrow = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" />
  </svg>
);

const NetworkSwitchArrow = () => (
  <div className="mx-4 cursor-pointer">
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="min-w-[1.5rem] transition-all duration-75 cursor-pointer hover:rotate-180"
    >
      <path
        d="M12.5 22C18.0228 22 22.5 17.5228 22.5 12C22.5 6.47715 18.0228 2 12.5 2C6.97715 2 2.5 6.47715 2.5 12C2.5 17.5228 6.97715 22 12.5 22Z"
        stroke="var(--color-primary-29)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H15"
        stroke="var(--color-primary-29)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 15L16 12L13 9"
        stroke="var(--color-primary-29)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const LoadingIcon = ({ className }: { className?: string }) => (
  <div className={`bridge-widget-loader ${className || ""}`}></div>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="none" d="M0 0h24v24H0V0z"></path>
    <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"
      fill="currentColor"
    />
  </svg>
);

const SuccessIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
      fill="currentColor"
    />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59Z"
      fill="currentColor"
    />
  </svg>
);

// Toast Notification Component
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="bridge-widget-toast">
      <div className={`bridge-widget-toast-content ${type}`}>
        {type === "success" && (
          <SuccessIcon className="bridge-widget-toast-icon" />
        )}
        {type === "error" && <ErrorIcon className="bridge-widget-toast-icon" />}
        {type === "info" && <InfoIcon className="bridge-widget-toast-icon" />}
        <span className="bridge-widget-toast-message">{message}</span>
        <button className="bridge-widget-toast-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export const BridgeWidget: React.FC<BridgeWidgetProps> = ({
  onClose,
  isPopup = false,
  defaultFromChain = "bsc",
  defaultToChain = "arbitrum",
  defaultAmount = "0",
  signer,
  onSuccess,
  onError,
  theme = "sailer",
}) => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>("bta");
  const [fromChain, setFromChain] = useState<ChainType>(defaultFromChain);
  const [toChain, setToChain] = useState<ChainType>(defaultToChain);
  const [amount, setAmount] = useState(defaultAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showGasModal, setShowGasModal] = useState(false);
  const [step, setStep] = useState<
    "input" | "approval" | "confirmation" | "processing" | "complete"
  >("input");
  const [fee, setFee] = useState<string | null>(null);
  const [gas, setGas] = useState("0.0005");
  const [gasOption, setGasOption] = useState<"low" | "medium" | "max">("low");
  const [balance, setBalance] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [currentSigner, setCurrentSigner] = useState<ethers.Signer | null>(
    null
  );
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  const [eduPrice, setEduPrice] = useState<number>(0.15); // Default estimated price

  //set theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.documentElement.dataset.theme = theme;
    }
  }, []);

  // Fetch EDU price from CryptoCompare
  useEffect(() => {
    const fetchEduPrice = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=EDU&tsyms=USD"
        );
        const data = await response.json();
        if (data?.RAW?.EDU?.USD?.PRICE) {
          setEduPrice(data.RAW.EDU.USD.PRICE);
        }
      } catch (err) {
        // console.error("Error fetching EDU price:", err);
      }
    };

    fetchEduPrice();
  }, []);

  // Initialize signer and check wallet connection
  useEffect(() => {
    const initSigner = async () => {
      if (signer) {
        setCurrentSigner(signer);
        const address = await signer.getAddress();
        setUserAddress(address);

        // Get current chain
        const provider = signer.provider as ethers.Provider;
        if (provider) {
          const network = await provider.getNetwork();
          setChainId(Number(network.chainId));
        }
        return;
      }

      // If no signer provided, try to get one from window.ethereum
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const connectedSigner = await provider.getSigner();
          setCurrentSigner(connectedSigner);
          const address = await connectedSigner.getAddress();
          setUserAddress(address);

          // Get current chain
          const network = await provider.getNetwork();
          setChainId(Number(network.chainId));

          // Listen for chain changes
          window.ethereum.on("chainChanged", (chainId: string) => {
            setChainId(parseInt(chainId, 16));
          });
        } catch (err) {
          // console.error("Failed to connect wallet:", err);
          setError("Please connect your wallet to use the bridge.");
        }
      } else {
        setError(
          "No wallet detected. Please install MetaMask or another web3 wallet."
        );
      }
    };

    initSigner();

    // Cleanup
    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [signer, currentSigner]);

  // Update default chains when tab changes
  useEffect(() => {
    if (activeTab === "bta") {
      setFromChain("bsc");
      setToChain("arbitrum");
    } else if (activeTab === "ate") {
      setFromChain("arbitrum");
      setToChain("educhain");
    }
  }, [activeTab]);

  // Check if the selected path is valid
  const isValidPath = useMemo(
    () =>
      ALLOWED_PATHS.some(
        (path) => path.from === fromChain && path.to === toChain
      ),
    [fromChain, toChain]
  );

  // Check if user is on the wrong chain
  const isOnWrongChain = useMemo(() => {
    if (currentSigner && chainId) {
      return CHAINS[fromChain].chainId !== chainId;
    }
    return true;
  }, [chainId, currentSigner, fromChain]);

  // Check if bridge is supported on the selected path
  const bridgeNotSupported = useMemo(() => {
    if (fromChain === "educhain") {
      return true;
    }
    if (fromChain === "bsc" && toChain === "educhain") {
      return true;
    }
    if (toChain === "bsc") {
      return true;
    }
    return false;
  }, [fromChain, toChain]);

  // Update fee and balance when parameters change
  useEffect(() => {
    const updateFeeAndBalance = async () => {
      if (
        !currentSigner ||
        isOnWrongChain ||
        !userAddress ||
        !isValidPath ||
        !amount ||
        parseFloat(amount) <= 0
      ) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Create bridge instance
        const bridge = new Bridge(currentSigner);

        // Check balance
        let hasEnough = false;
        if (fromChain === "bsc") {
          hasEnough = await bridge.hasEnoughEdu(userAddress, amount);

          // Get fee for BSC to Arbitrum
          if (toChain === "arbitrum") {
            const estimatedFee = await bridge.estimateBridgeFee(
              amount,
              userAddress
            );
            // Format to exactly 5 decimal places
            const formattedFee = parseFloat(estimatedFee).toFixed(5);
            setFee(`${formattedFee} BNB`);

            // Check if approved
            const approved = await bridge.isEduApproved(userAddress, amount);
            setIsApproved(approved);
          }
        } else if (fromChain === "arbitrum") {
          hasEnough = await bridge.hasEnoughEduOnArb(userAddress, amount);

          // Check if approved for Arbitrum to EDUCHAIN
          if (toChain === "educhain") {
            const approved = await bridge.isEduApprovedOnArb(
              userAddress,
              amount
            );
            setIsApproved(approved);
            setFee("Gas fee only");
          }
        }

        // if (!hasEnough) {
        //   setError(`Insufficient EDU balance on ${CHAINS[fromChain].name}`);
        // } else {
        //   setError(null);
        // }

        // Get native balance
        const provider = currentSigner.provider as ethers.Provider;
        const nativeBalanceWei = await provider.getBalance(userAddress);
        const nativeBalanceFormatted = ethers.formatEther(nativeBalanceWei);
        setNativeBalance(nativeBalanceFormatted);
      } catch (err) {
        // console.error("Error updating fee and balance:", err);
        // setError("Failed to get fee or balance information");
      } finally {
        setLoading(false);
      }
    };

    updateFeeAndBalance();
  }, [
    currentSigner,
    userAddress,
    fromChain,
    toChain,
    amount,
    isValidPath,
    isOnWrongChain,
  ]);

  useEffect(() => {
    const getBalance = async () => {
      if (!currentSigner || isOnWrongChain) {
        setBalance("");
        return;
      }
      // Get native balance
      const provider = currentSigner.provider as ethers.Provider;
      const eduContract = new ethers.Contract(
        CHAINS[fromChain].eduAddress,
        [
          "function balanceOf(address) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ],
        provider
      );

      const decimals = await eduContract?.decimals();
      const balanceWei = await eduContract?.balanceOf(userAddress);
      const balanceFormatted = ethers.formatUnits(balanceWei, decimals);
      setBalance(balanceFormatted);
    };

    getBalance();
  }, [isOnWrongChain, refreshingBalance]);

  // Handle percentage selection
  const handlePercentageSelect = (percentage: number) => {
    if (!balance) return;

    const result = (parseFloat(balance) * percentage) / 100;
    setAmount(result.toString());
  };

  // Handle refresh balance
  const handleRefreshBalance = () => {
    setRefreshingBalance(true);
    setTimeout(() => {
      setRefreshingBalance(false);
    }, 2000);
  };

  // Handle chain switch
  const handleChainSwitch = async () => {
    if (!currentSigner) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAINS[fromChain].chainId.toString(16)}` }],
      });
    } catch (error) {
      // console.error("Failed to switch network:", err);
      setError(
        `Failed to switch your wallet to ${CHAINS[fromChain].name} network. Try doing it manually from your wallet.`
      );
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
      if (fromChain === "bsc") {
        tx = await bridge.approveEdu(amount);
      } else if (fromChain === "arbitrum") {
        tx = await bridge.approveEduOnArb(amount);
      }

      if (!tx) {
        throw new Error("Failed to create approval transaction");
      }

      setStep("approval");
      await tx.wait();
      setIsApproved(true);
      setStep("confirmation");
    } catch (err) {
      // console.error("Approval failed:", err);
      setError("Failed to approve tokens");
    } finally {
      setLoading(false);
    }
  };

  // Handle bridge
  const handleBridge = async () => {
    if (!currentSigner || !userAddress || !isValidPath) return;

    setLoading(true);
    setError(null);
    setStep("processing");
    setShowPopup(true);

    try {
      const bridge = new Bridge(currentSigner);

      // Execute bridge based on the path
      let tx: ethers.TransactionResponse | undefined;
      if (fromChain === "bsc" && toChain === "arbitrum") {
        tx = await bridge.bridgeEduFromBscToArb(amount, userAddress);
      } else if (fromChain === "arbitrum" && toChain === "educhain") {
        tx = await bridge.bridgeEduFromArbToEdu(amount);
      }

      if (!tx) {
        throw new Error("Failed to create bridge transaction");
      }

      await tx.wait();
      setSuccess(tx.hash);
      setStep("complete");

      if (onSuccess) {
        onSuccess(tx.hash);
      }
    } catch (err) {
      console.error("Bridge failed:", err);
      setError("Failed to bridge tokens");
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
    if (!error && step === "complete") {
      setStep("input");
      setSuccess(null);
      setAmount("0");
    }
  };

  // Render the widget
  return (
    <>
      <div className="bridge-widget">
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
          {/* Tab Navigation */}
          <div className="bridge-widget-tabs">
            <button
              className={`bridge-widget-tab ${
                activeTab === "bta" ? "active" : ""
              }`}
              onClick={() => setActiveTab("bta")}
            >
              <span>BSC to ARB</span>
              {/* <img
                src=
                alt="BSC"
                className="bridge-widget-chain-icon"
              /> */}
              {CHAINS.bsc.icon}
              <RightArrow />
              {/* <img
                src=
                alt="ARB"
                className="bridge-widget-chain-icon"
              /> */}
              {CHAINS.arbitrum.icon}
            </button>
            <button
              className={`bridge-widget-tab ${
                activeTab === "ate" ? "active" : ""
              }`}
              onClick={() => setActiveTab("ate")}
            >
              <span>ARB to EDU</span>
              {CHAINS.arbitrum.icon}
              {/* <img
                src=
                alt="ARB"
                className="bridge-widget-chain-icon"
              /> */}
              <RightArrow />
              {/* <img
                src=
                alt="EDU"
                className="bridge-widget-chain-icon"
              /> */}
              {CHAINS.educhain.icon}
            </button>
          </div>

          {/* Bridge Content */}
          <div className="bridge-widget-bridge-content">
            <div className="bridge-widget-title-row">
              <h3 className="bridge-widget-title">Bridge</h3>
              <span className="bridge-widget-balance-label">
                Available: {balance ? parseFloat(balance).toFixed(2) : "0.00"}{" "}
                EDU
              </span>
            </div>

            {/* Percentage Selector */}
            <div className="bridge-widget-percentage">
              <div className="bridge-widget-percentage-label">
                A percent of your balance
              </div>
              <div className="bridge-widget-percentage-buttons">
                {[10, 25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    className="bridge-widget-percentage-button"
                    onClick={() => handlePercentageSelect(percentage)}
                    disabled={!balance || parseFloat(balance) <= 0}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="bridge-widget-amount-input-container">
              <div className="bridge-widget-amount-input-with-token">
                <div className="bridge-widget-token">
                  {/* <img
                    src={CHAINS.educhain.icon}
                    alt="EDU"
                    className="bridge-widget-token-icon"
                  /> */}
                  {CHAINS.educhain.icon}
                  <span className="bridge-widget-token-symbol">EDU</span>
                </div>
                <div className="bridge-widget-amount-input-wrapper">
                  <input
                    type="text"
                    className="bridge-widget-amount-input"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d.]/g, "");
                      setAmount(value);
                    }}
                    disabled={loading}
                    placeholder="0.00"
                  />
                  <span className="bridge-widget-amount-usd">
                    ~${((parseFloat(amount) || 0) * eduPrice).toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* From/To Network */}
            <div className="bridge-widget-networks">
              <div className="bridge-widget-network">
                <label className="bridge-widget-network-label">
                  From Network
                </label>
                <div className="bridge-widget-network-selector">
                  {/* <img
                    src=
                    alt={CHAINS[fromChain].name}
                    className="bridge-widget-network-icon"
                  /> */}
                  {CHAINS[fromChain].icon}
                  <span className="bridge-widget-network-name">
                    {CHAINS[fromChain].name}
                  </span>
                </div>
              </div>
              <NetworkSwitchArrow />
              <div className="bridge-widget-network">
                <label className="bridge-widget-network-label">
                  To Network
                </label>
                <div className="bridge-widget-network-selector">
                  {/* <img
                    src=
                    alt={CHAINS[toChain].name}
                    className="bridge-widget-network-icon"
                  /> */}
                  {CHAINS[toChain].icon}
                  <span className="bridge-widget-network-name">
                    {CHAINS[toChain].name}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bridge-widget-transaction-details">
                <div className="bridge-widget-transaction-detail">
                  <span className="bridge-widget-transaction-label">
                    You will receive
                  </span>
                  <span className="bridge-widget-transaction-value">
                    {parseFloat(amount).toFixed(4)} EDU
                  </span>
                </div>
                {fee && (
                  <div className="bridge-widget-transaction-detail">
                    <span className="bridge-widget-transaction-label">
                      Transaction cost
                    </span>
                    <span className="bridge-widget-transaction-value">
                      {fee}
                    </span>
                  </div>
                )}
                {fromChain === "bsc" && (
                  <div className="bridge-widget-transaction-detail">
                    <div className="bridge-widget-transaction-label-with-tooltip">
                      <span className="bridge-widget-transaction-label">
                        Gas on destination
                      </span>
                      <div className="bridge-widget-tooltip">
                        <InfoIcon className="bridge-widget-info-icon" />
                        <span className="bridge-widget-tooltip-text">
                          This is the amount of ETH on Arbitrum you will receive
                          to allow you use as gas when bridging from ARB to EDU.
                        </span>
                      </div>
                    </div>
                    <div className="bridge-widget-gas-selector">
                      <span>{gas}</span>
                      <button
                        className="bridge-widget-gas-button"
                        onClick={() => setShowGasModal(true)}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Network Mismatch Warning */}
            {isOnWrongChain && (
              <div className="bridge-widget-warning">
                <InfoIcon className="bridge-widget-warning-icon" />
                <p className="bridge-widget-warning-text">
                  You're currently on{" "}
                  {chainId ? `Chain ID ${chainId}` : "an unknown network"}.
                  Switch to {CHAINS[fromChain].name} network on the connected
                  wallet.
                </p>
              </div>
            )}

            {/* Refresh Balance Button */}
            {!isOnWrongChain && currentSigner && (
              <button
                className="bridge-widget-refresh-button"
                onClick={handleRefreshBalance}
                disabled={refreshingBalance}
              >
                <RefreshIcon
                  className={refreshingBalance ? "animate-spin" : ""}
                />
                <span>
                  {refreshingBalance
                    ? "Refreshing Balance..."
                    : "Refresh Balance"}
                </span>
              </button>
            )}

            {/* Action Button */}
            {!currentSigner ? (
              <button
                className="bridge-widget-button bridge-widget-connect"
                onClick={handleChainSwitch}
              >
                Connect Wallet
              </button>
            ) : isOnWrongChain ? (
              <button
                className="bridge-widget-button bridge-widget-network-switch"
                onClick={handleChainSwitch}
              >
                Switch to {CHAINS[fromChain].name}
              </button>
            ) : bridgeNotSupported ? (
              <button
                className="bridge-widget-button bridge-widget-disabled"
                disabled
              >
                Bridge to {CHAINS[toChain].name} not supported
              </button>
            ) : nativeBalance &&
              fee &&
              parseFloat(nativeBalance) < parseFloat(fee.split(" ")[0]) ? (
              <button
                className="bridge-widget-button bridge-widget-disabled"
                disabled
              >
                Insufficient {CHAINS[fromChain].nativeSymbol} for Transaction
              </button>
            ) : balance && parseFloat(amount) > parseFloat(balance) ? (
              <button
                className="bridge-widget-button bridge-widget-disabled"
                disabled
              >
                Insufficient funds
              </button>
            ) : !isApproved ? (
              <button
                className="bridge-widget-button bridge-widget-approve"
                onClick={handleApprove}
                disabled={
                  loading ||
                  !!error ||
                  !isValidPath ||
                  !amount ||
                  parseFloat(amount) <= 0
                }
              >
                {loading ? "Approving..." : "Approve"}
              </button>
            ) : (
              <button
                className="bridge-widget-button bridge-widget-bridge"
                onClick={handleBridge}
                disabled={
                  loading ||
                  !!error ||
                  !isValidPath ||
                  !amount ||
                  parseFloat(amount) <= 0
                }
              >
                {loading
                  ? "Processing..."
                  : `Bridge to ${CHAINS[toChain].name}`}
              </button>
            )}
          </div>
        </div>

        <div className="bridge-widget-footer">
          <p>
            Powered by{" "}
            <a
              href="https://app.sailfish.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="bridge-widget-footer-link"
            >
              SailFish DEX
            </a>
          </p>
        </div>

        {/* Gas Selection Modal */}
        {showGasModal && (
          <div className="bridge-widget-popup-overlay">
            <div className="bridge-widget-popup gas-modal">
              <button
                className="bridge-widget-popup-close"
                onClick={() => setShowGasModal(false)}
              >
                ×
              </button>
              <div className="bridge-widget-popup-content">
                <h3 className="bridge-widget-popup-title">
                  Gas on destination chain
                </h3>
                <p className="bridge-widget-popup-description">
                  This is the amount of gas token you will receive on
                  destination.
                </p>

                <div className="bridge-widget-gas-options">
                  <button
                    className={`bridge-widget-gas-option ${
                      gasOption === "low" ? "active" : ""
                    }`}
                    onClick={() => {
                      setGas("0.0005");
                      setGasOption("low");
                      setShowGasModal(false);
                    }}
                  >
                    Low
                  </button>
                  <button
                    className={`bridge-widget-gas-option ${
                      gasOption === "medium" ? "active" : ""
                    }`}
                    onClick={() => {
                      setGas("0.004");
                      setGasOption("medium");
                      setShowGasModal(false);
                    }}
                  >
                    Medium
                  </button>
                  <button
                    className={`bridge-widget-gas-option ${
                      gasOption === "max" ? "active" : ""
                    }`}
                    onClick={() => {
                      setGas("0.05");
                      setGasOption("max");
                      setShowGasModal(false);
                    }}
                  >
                    Max
                  </button>
                </div>

                <div className="bridge-widget-gas-display">
                  <div className="bridge-widget-gas-token-icon">
                    {/* <img
                      src=
                      alt="ETH"
                      className="bridge-widget-gas-icon"
                    /> */}
                    {CHAINS.arbitrum.icon}
                  </div>
                  <div className="bridge-widget-gas-amount">{gas}</div>
                  <div className="bridge-widget-gas-label">
                    {gasOption === "low"
                      ? "Low"
                      : gasOption === "medium"
                      ? "Medium"
                      : "Max"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Popup */}
        {showPopup && (
          <div className="bridge-widget-popup-overlay">
            <div className="bridge-widget-popup">
              <button
                className="bridge-widget-popup-close"
                onClick={handleClosePopup}
              >
                ×
              </button>
              <div className="bridge-widget-popup-content">
                {step === "processing" ? (
                  <>
                    <LoadingIcon className="bridge-widget-popup-icon" />
                    <h3 className="bridge-widget-popup-title">Bridging...</h3>
                    <div className="bridge-widget-popup-networks">
                      <div className="bridge-widget-popup-network">
                        {/* <img
                          src=
                          alt={CHAINS[fromChain].name}
                          className="bridge-widget-popup-network-icon"
                        /> */}
                        {CHAINS[fromChain].icon}
                        <span>{CHAINS[fromChain].name}</span>
                      </div>
                      <RightArrow />
                      <div className="bridge-widget-popup-network">
                        {/* <img
                          src=
                          alt={CHAINS[toChain].name}
                          className="bridge-widget-popup-network-icon"
                        /> */}
                        {CHAINS[toChain].icon}
                        <span>{CHAINS[toChain].name}</span>
                      </div>
                    </div>
                    <div className="bridge-widget-popup-details">
                      <div className="bridge-widget-popup-detail">
                        <span>You will receive</span>
                        <span>{amount} EDU</span>
                      </div>
                      {fee && (
                        <div className="bridge-widget-popup-detail">
                          <span>Transaction cost</span>
                          <span>{fee}</span>
                        </div>
                      )}
                      {fromChain === "bsc" && (
                        <div className="bridge-widget-popup-detail">
                          <span>Gas on destination</span>
                          <span>{gas}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : step === "complete" && !error ? (
                  <>
                    <SuccessIcon className="bridge-widget-popup-success-icon" />
                    <h3 className="bridge-widget-popup-title">
                      Transaction Successful
                    </h3>
                    <div className="bridge-widget-popup-success-message">
                      <p>
                        {amount} EDU from {CHAINS[fromChain].name} to{" "}
                        {CHAINS[toChain].name} was successful.
                      </p>
                      <p>
                        {toChain === "educhain" ? (
                          <>
                            No action needed. Funds should arrive on EDU chain
                            in ~ 15mins
                          </>
                        ) : fromChain === "bsc" ? (
                          <>
                            No action needed. Funds should arrive on Arbitrum
                            One in ~ 3mins
                          </>
                        ) : null}
                      </p>
                      {success && (
                        <a
                          href={`${CHAINS[fromChain].explorerUrl}/tx/${success}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bridge-widget-popup-link"
                        >
                          View transaction on {CHAINS[fromChain].name} Explorer
                        </a>
                      )}
                      <a
                        href={`${CHAINS[toChain].explorerUrl}/address/${userAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bridge-widget-popup-link"
                      >
                        View balance on {CHAINS[toChain].name}
                      </a>
                    </div>
                  </>
                ) : error ? (
                  <>
                    <ErrorIcon className="bridge-widget-popup-error-icon" />
                    <h3 className="bridge-widget-popup-title">
                      Transaction failed
                    </h3>
                    <p className="bridge-widget-popup-error-message">
                      {error || "Failed to bridge tokens"}
                    </p>
                  </>
                ) : (
                  <>
                    <ErrorIcon className="bridge-widget-popup-error-icon" />
                    <h3 className="bridge-widget-popup-title">
                      No transaction performed
                    </h3>
                    <p className="bridge-widget-popup-error-message">
                      No bridge transaction was performed
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <Toast
          message={
            success
              ? `Successfully bridged ${amount} EDU to ${CHAINS[toChain].name}`
              : error || ""
          }
          type={success ? "success" : error ? "error" : "info"}
          visible={!!(success || error)}
          onClose={() => {
            setSuccess(null);
            setError(null);
          }}
        />

        <style>{`
        :root{
        --bridge-widget-bg-color: var(--popup);
        --color-primary-41: #4169e1;
        --color-primary-3a: #3a5fd9;
        --color-primary-29: #2964cc;
        --color-tab-hover: rgba(65, 105, 225, 0.1);
        --color-border-color-1: #3a3b43;
        --color-bg-1: #2d303e;
        --percentage-bg: rgba(45, 48, 62, 0.7);
         --percentage-button-bg: #3a414dx;
           --percentage-button-bg-hover: #4b5169;
           --button-disabled: #3c4156;
           --popup: #1a1b23;
           --gas-option-hover: #383b4d;
        }

        [data-theme="edu.fun"] {
--bridge-widget-bg-color: #071f16;
--color-primary-41: #02ecbc;
 --color-primary-3a: #0b4832;
 --color-primary-29: #09442a;
 --color-tab-hover: #1e4838;
  --color-border-color-1: #384942;
   --color-bg-1: #384942;
   --percentage-bg: #283836;
   --percentage-button-bg: #0b4832;
   --percentage-button-bg-hover: #09442a;
   --button-disabled: #283836;
   --popup: #071f16;
   --gas-option-hover: #283836;
          }


          /* Toast Notification Styles */
          .bridge-widget-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
          }
          
          .bridge-widget-toast-content {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slide-in 0.3s ease-out;
          }
          
          .bridge-widget-toast-content.success {
            background-color: #2b3a29;
            border-left: 4px solid #28a745;
          }
          
          .bridge-widget-toast-content.error {
            background-color: #3a292b;
            border-left: 4px solid #e63946;
          }
          
          .bridge-widget-toast-content.info {
            background-color: #293a3a;
            border-left: 4px solid var(--color-primary-41);
          }
          
          .bridge-widget-toast-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
          }
          
          .bridge-widget-toast-message {
            flex: 1;
            font-size: 0.875rem;
            padding-right: 10px;
          }
          
          .bridge-widget-toast-close {
            background: none;
            border: none;
            color: #adb5bd;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            padding: 0;
          }
          
          .bridge-widget-toast-close:hover {
            color: white;
          }
          
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .bridge-widget {
            font-family: "Ubuntu", sans-serif;
            background-color: var(--bridge-widget-bg-color);
            color: #ffffff;
            border-radius: 0.625rem;
            width: 100%;
            max-width: 33rem;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
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
            padding: 24px 24px 0 24px;
          }

          .bridge-widget-tabs {
            display: flex;
            margin-bottom: 1rem;
            border-bottom: 1px solid #2d2e36;
            padding-bottom: 0.75rem;
            overflow-x: auto;
            white-space: nowrap;
            gap: 0.5rem;
          }

          .bridge-widget-tab {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            color: #ffffff;
            border: 1px solid var(--color-primary-41);
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
            gap: 0.375rem;
            width: 100%;
          }

          .bridge-widget-tab.active {
            background-color: var(--color-primary-29);
            color: white;
          }

          .bridge-widget-tab:hover:not(.active) {
            background-color: var(--color-tab-hover);
          }

          .bridge-widget-chain-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            overflow: hidden;
          }

          .bridge-widget-bridge-content {
            padding: 0 0;
          }

          .bridge-widget-title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .bridge-widget-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
          }

          .bridge-widget-balance-label {
            font-size: 0.75rem;
            color: #f8f9fa;
          }

          .bridge-widget-percentage {
            display: flex;
            align-items: center;
            background-color: var(--percentage-bg);
            border-radius: 0.25rem;
            padding: 0.5rem 0.75rem;
            margin-bottom: 1rem;
            justify-content: space-between;
          }

          .bridge-widget-percentage-label {
            font-size: 0.75rem;
            color: white;
          }

          .bridge-widget-percentage-buttons {
            display: flex;
            gap: 0.5rem;
          }

          .bridge-widget-percentage-button {
            background-color: var(--percentage-button-bg);
            border: none;
            color: white;
            border-radius: 1rem;
            padding: 0.375rem 0.75rem;
            font-size: 0.65rem;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
          }

          .bridge-widget-percentage-button:hover:not(:disabled) {
            background-color: var(--percentage-button-bg-hover);
          }

          .bridge-widget-percentage-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .bridge-widget-amount-input-container {
            margin-bottom: 1rem;
          }

          .bridge-widget-amount-input-with-token {
            display: flex;
            align-items: center;
            background-color: transparent;
            border: 1px solid var(--color-border-color-1);
            border-radius: 0.25rem;
            padding: 0.5rem 1rem;
          }

          .bridge-widget-token {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            margin-right: 0.5rem;
          }

          .bridge-widget-token-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .bridge-widget-token-symbol {
            font-size: 0.875rem;
          }

          .bridge-widget-amount-input-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          .bridge-widget-amount-input {
            width: 100%;
            text-align: right;
            background: transparent;
            border: none;
            color: white;
            font-size: 1rem;
            outline: none;
          }

          .bridge-widget-amount-usd {
            font-size: 0.75rem;
            color: #8f9ba8;
          }

          .bridge-widget-networks {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
            gap: 1.25rem;
          }

          .bridge-widget-network {
            flex: 1;
          }

          .bridge-widget-network-label {
            display: block;
            font-size: 0.75rem;
            color: #8f9ba8;
            margin-bottom: 0.25rem;
          }

          .bridge-widget-network-selector {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: transparent;
            border: 1px solid var(--color-border-color-1);
            border-radius: 0.25rem;
            padding: 0.5rem;
          }

          .bridge-widget-network-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .bridge-widget-network-name {
            font-size: 0.875rem;
          }

          .bridge-widget-transaction-details {
            background-color: var(--color-bg-1);
            border-radius: 0.25rem;
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
          }

          .bridge-widget-transaction-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .bridge-widget-transaction-label {
            font-size: 0.75rem;
            color: #8f9ba8;
          }

          .bridge-widget-transaction-label-with-tooltip {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .bridge-widget-transaction-value {
            font-size: 0.875rem;
          }

          .bridge-widget-info-icon {
            color: #8f9ba8;
            cursor: help;
          }
          
          .bridge-widget-tooltip {
            position: relative;
            display: inline-block;
          }
          
          .bridge-widget-tooltip .bridge-widget-tooltip-text {
            visibility: hidden;
            width: 220px;
            background-color: var(--color-bg-1);
            color: #fff;
            text-align: left;
            border-radius: 6px;
            padding: 8px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 100%;
            margin-left: 10px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 0.75rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--color-border-color-1);
          }
          
          .bridge-widget-tooltip:hover .bridge-widget-tooltip-text {
            visibility: visible;
            opacity: 1;
          }

          .bridge-widget-gas-selector {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .bridge-widget-gas-button {
            background: none;
            border: none;
            color: var(--color-primary-41);
            cursor: pointer;
          }

          .bridge-widget-warning {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            background-color: var(--color-bg-1);
            border-radius: 0.5rem;
            padding: 0.625rem;
            margin-bottom: 1rem;
          }

          .bridge-widget-warning-icon {
            color: #e63946;
            flex-shrink: 0;
            margin-top: 0.125rem;
          }

          .bridge-widget-warning-text {
            font-size: 0.875rem;
            margin: 0;
          }

          .bridge-widget-refresh-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            background: none;
            border: none;
            color: white;
            font-size: 0.75rem;
            margin: 0 auto 1rem;
            cursor: pointer;
          }

          .bridge-widget-refresh-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .animate-spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .bridge-widget-button {
            width: 100%;
            padding: 0.75rem 1.25rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .bridge-widget-connect,
          .bridge-widget-network-switch {
            background-color: var(--color-primary-29);
            color: white;
          }

          .bridge-widget-connect:hover,
          .bridge-widget-network-switch:hover {
            background-color: var(--color-primary-3a);
          }

          .bridge-widget-approve {
            background-color:  var(--color-primary-29);
            color: white;
          }

          .bridge-widget-approve:hover:not(:disabled) {
            background-color: var(--color-primary-3a);
          }

          .bridge-widget-bridge {
            background-color: var(--color-primary-29);
            color: white;
          }

          .bridge-widget-bridge:hover:not(:disabled) {
            background-color: var(--color-primary-3a);
          }

          .bridge-widget-disabled {
            background-color: var(--button-disabled);
            color: white;
            opacity: 0.7;
          }

          .bridge-widget-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
          }

          .bridge-widget-footer {
            padding: 0.75rem;
            border-top: 1px solid #2d2e36;
            margin-top: 0.5rem;
            text-align: center;
            font-size: 0.75rem;
            color: #8f9ba8;
          }

          .bridge-widget-footer-link {
            color: var(--color-primary-41);
            text-decoration: none;
            transition: all 0.2s;
          }

          .bridge-widget-footer-link:hover {
            color: #6a8bff;
            text-decoration: underline;
          }

          .bridge-widget-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .bridge-widget-popup {
            background-color: var(--popup);
            border-radius: 0.625rem;
            width: 100%;
            max-width: 30rem;
            position: relative;
            padding: 2rem 1.5rem;
          }

          .bridge-widget-popup-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #8f9ba8;
            font-size: 1.5rem;
            cursor: pointer;
          }

          .bridge-widget-popup-content {
            text-align: center;
            
          }

          .bridge-widget-popup-icon {
            margin: 0 auto 1rem;
            width: 3rem;
            height: 3rem; 
          }

          .bridge-widget-popup-success-icon {
            color: #28a745;
            margin: 0 auto 1rem auto;
          }

          .bridge-widget-popup-error-icon {
            color: #e63946;
            margin-bottom: 1rem;
            margin: 0 auto 1rem auto;
          }

          .bridge-widget-popup-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .bridge-widget-popup-networks {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .bridge-widget-popup-network {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            border: 1px solid var(--color-border-color-1);
            border-radius: 0.25rem;
            padding: 0.5rem 1rem;
          }

          .bridge-widget-popup-network-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .bridge-widget-popup-details {
            background-color: var(--color-bg-1);
            border-radius: 0.25rem;
            padding: 0.75rem;
            margin-bottom: 1rem;
            text-align: left;
          }

          .bridge-widget-popup-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.25rem;
          }

          .bridge-widget-popup-detail:last-child {
            margin-bottom: 0;
          }

          .bridge-widget-popup-success-message {
            border: 1px solid var(--color-border-color-1);
            border-radius: 0.25rem;
            padding: 1rem;
            margin-bottom: 1rem;
            text-align: left;
          }

          .bridge-widget-popup-link {
            display: block;
            color: var(--color-primary-41);
            text-decoration: underline;
            margin-top: 0.5rem;
          }

          .bridge-widget-popup-error-message {
            color: #e63946;
            word-break: break-word;
          }

          /* Gas Modal Styles */
          .bridge-widget-popup.gas-modal {
            max-width: 26rem;
          }

          .bridge-widget-popup-description {
            color: #8f9ba8;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
          }

          .bridge-widget-gas-options {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .bridge-widget-gas-option {
            flex: 1;
            padding: 0.75rem 0.5rem;
            background-color: var(--color-bg-1);
            border: 1px solid var(--color-border-color-1);
            border-radius: 0.5rem;
            color: white;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .bridge-widget-gas-option:hover {
            background-color: var(--gas-option-hover);
          }

          .bridge-widget-gas-option.active {
            background-color: var(--color-primary-29);
            border-color: var(--color-primary-29);
          }

          .bridge-widget-gas-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1.5rem;
            background-color: var(--color-bg-1);
            border-radius: 0.5rem;
          }

          .bridge-widget-gas-token-icon {
            margin-bottom: 0.75rem;
          }

          .bridge-widget-gas-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }

          .bridge-widget-gas-amount {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
          }

          .bridge-widget-gas-label {
            color: #8f9ba8;
            font-size: 0.875rem;
          }

          .bridge-widget-loader {
            border: 4px solid rgba(65, 105, 225, 0.2);
            border-left-color: var(--color-primary-41);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
          }

          .size-8 {
            width: 2rem;
            height: 2rem;
          }

          .grid {
            display: grid;
          }

          .place-items-center {
            place-items: center;
          }

          .bg-primary-700 {
            background-color: var(--color-primary-41);
          }

          .text-white {
            color: white;
          }

          .rounded-full {
            border-radius: 9999px;
          }
        `}</style>
      </div>
    </>
  );
};
