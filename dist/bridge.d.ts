import { ethers, Provider, Signer } from "ethers";
/**
 * Bridge class for bridging tokens between chains
 */
export declare class Bridge {
    private provider;
    private signer?;
    /**
     * Create a new Bridge instance
     * @param providerOrSigner An ethers Provider or Signer
     */
    constructor(providerOrSigner: Provider | Signer);
    /**
     * Check if the bridge has a signer
     * @returns True if the bridge has a signer
     * @private
     */
    private hasSigner;
    /**
     * Get the BNB price in USD
     * @returns The BNB price in USD
     */
    getBnbPrice(): Promise<number>;
    /**
     * Estimate the fee for bridging EDU tokens from BSC to Arbitrum
     * @param amount Amount of EDU tokens to bridge
     * @param address User's address
     * @param gasOnDestination Amount of ETH to receive on Arbitrum for gas (in ETH)
     * @returns The estimated fee in BNB
     */
    estimateBridgeFee(amount: string, address: string, gasOnDestination?: string): Promise<string>;
    /**
     * Check if the user has enough BNB for the bridge transaction
     * @param address User's address
     * @param fee Estimated fee in BNB
     * @returns True if the user has enough BNB
     */
    hasEnoughBnb(address: string, fee: string): Promise<boolean>;
    /**
     * Check if the user has enough EDU tokens for the bridge transaction
     * @param address User's address
     * @param amount Amount of EDU tokens to bridge
     * @returns True if the user has enough EDU tokens
     */
    hasEnoughEdu(address: string, amount: string): Promise<boolean>;
    /**
     * Approve EDU tokens for the bridge
     * @param amount Amount of EDU tokens to approve
     * @returns Transaction response
     */
    approveEdu(amount: string): Promise<ethers.TransactionResponse>;
    /**
     * Check if EDU tokens are approved for the bridge
     * @param address User's address
     * @param amount Amount of EDU tokens to bridge
     * @returns True if EDU tokens are approved
     */
    isEduApproved(address: string, amount: string): Promise<boolean>;
    /**
     * Bridge EDU tokens from BSC to Arbitrum
     * @param amount Amount of EDU tokens to bridge
     * @param address User's address
     * @param gasOnDestination Amount of ETH to receive on Arbitrum for gas (in ETH)
     * @returns Transaction response
     */
    bridgeEduFromBscToArb(amount: string, address: string, gasOnDestination?: string): Promise<ethers.TransactionResponse>;
    /**
     * Check if EDU tokens are approved for the bridge on Arbitrum
     * @param address User's address
     * @param amount Amount of EDU tokens to bridge
     * @returns True if EDU tokens are approved
     */
    isEduApprovedOnArb(address: string, amount: string): Promise<boolean>;
    /**
     * Approve EDU tokens for the bridge on Arbitrum
     * @param amount Amount of EDU tokens to approve
     * @returns Transaction response
     */
    approveEduOnArb(amount: string): Promise<ethers.TransactionResponse>;
    /**
     * Check if the user has enough EDU tokens on Arbitrum for the bridge transaction
     * @param address User's address
     * @param amount Amount of EDU tokens to bridge
     * @returns True if the user has enough EDU tokens
     */
    hasEnoughEduOnArb(address: string, amount: string): Promise<boolean>;
    /**
     * Bridge EDU tokens from Arbitrum to EDUCHAIN
     * @param amount Amount of EDU tokens to bridge
     * @returns Transaction response
     */
    bridgeEduFromArbToEdu(amount: string): Promise<ethers.TransactionResponse>;
}
