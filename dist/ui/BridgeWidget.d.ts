import { ethers } from "ethers";
import React from "react";
import "./fonts/fonts.css";
declare global {
    interface Window {
        ethereum?: any;
    }
}
type ChainType = "bsc" | "arbitrum" | "educhain";
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
export declare const BridgeWidget: React.FC<BridgeWidgetProps>;
export {};
