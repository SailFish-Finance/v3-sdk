import { ethers, Signer, Provider } from 'ethers';
import { ExactInputParams, ExactInputSingleParams, ExactOutputParams, ExactOutputSingleParams, SwapOptions, TradeType } from './types';
/**
 * SailFish Router class for executing swaps
 */
export declare class Router {
    private provider;
    private signer?;
    private routerContract;
    /**
     * Create a new Router instance
     * @param providerOrSigner An ethers Provider or Signer
     */
    constructor(providerOrSigner: Provider | Signer);
    /**
     * Check if the router has a signer
     * @returns True if the router has a signer
     */
    private hasSigner;
    /**
     * Approve a token for spending by the router
     * @param tokenAddress Token address
     * @param amount Amount to approve
     * @returns Transaction response
     */
    approveToken(tokenAddress: string, amount: ethers.BigNumberish): Promise<ethers.TransactionResponse>;
    /**
     * Check if a token is approved for spending by the router
     * @param tokenAddress Token address
     * @param amount Amount to check
     * @returns True if the token is approved for the amount
     */
    isTokenApproved(tokenAddress: string, amount: ethers.BigNumberish): Promise<boolean>;
    /**
     * Execute an exact input swap (swap a fixed amount of input token for as much output token as possible)
     * @param params Swap parameters
     * @returns Transaction response
     */
    exactInputSingle(params: ExactInputSingleParams): Promise<ethers.TransactionResponse>;
    /**
     * Execute an exact output swap (swap as little input token as possible for a fixed amount of output token)
     * @param params Swap parameters
     * @returns Transaction response
     */
    exactOutputSingle(params: ExactOutputSingleParams): Promise<ethers.TransactionResponse>;
    /**
     * Execute a multi-hop exact input swap
     * @param params Swap parameters
     * @returns Transaction response
     */
    exactInput(params: ExactInputParams): Promise<ethers.TransactionResponse>;
    /**
     * Execute a multi-hop exact output swap
     * @param params Swap parameters
     * @returns Transaction response
     */
    exactOutput(params: ExactOutputParams): Promise<ethers.TransactionResponse>;
    /**
     * Execute a swap with multiple calls in a single transaction
     * @param calls Array of encoded function calls
     * @param value ETH value to send with the transaction
     * @returns Transaction response
     */
    multicall(calls: string[], value?: ethers.BigNumberish): Promise<ethers.TransactionResponse>;
    /**
     * Unwrap WEDU to native ETH
     * @param amountMinimum Minimum amount to unwrap
     * @param recipient Recipient address
     * @returns Transaction response
     */
    unwrapWETH9(amountMinimum: ethers.BigNumberish, recipient: string): Promise<ethers.TransactionResponse>;
    /**
     * Refund any ETH left from a swap
     * @returns Transaction response
     */
    refundETH(): Promise<ethers.TransactionResponse>;
    /**
     * Sweep any tokens left from a swap
     * @param token Token address
     * @param amountMinimum Minimum amount to sweep
     * @param recipient Recipient address
     * @returns Transaction response
     */
    sweepToken(token: string, amountMinimum: ethers.BigNumberish, recipient: string): Promise<ethers.TransactionResponse>;
    /**
     * Create a swap transaction with common parameters
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param fee Fee tier
     * @param amountIn Amount of input token (for exact input swaps)
     * @param amountOut Amount of output token (for exact output swaps)
     * @param tradeType Trade type (exact input or exact output)
     * @param options Swap options
     * @returns Transaction parameters
     */
    createSwapTransaction(tokenIn: string, tokenOut: string, fee: number, amountIn: ethers.BigNumberish, amountOut: ethers.BigNumberish, tradeType: TradeType, options?: SwapOptions): Promise<ExactInputSingleParams | ExactOutputSingleParams>;
    /**
     * Create a multi-hop swap transaction with common parameters
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param intermediaryToken Intermediary token address
     * @param feeTier1 Fee tier for the first hop
     * @param feeTier2 Fee tier for the second hop
     * @param amountIn Amount of input token (for exact input swaps)
     * @param amountOut Amount of output token (for exact output swaps)
     * @param tradeType Trade type (exact input or exact output)
     * @param options Swap options
     * @returns Transaction parameters
     */
    createMultihopSwapTransaction(tokenIn: string, intermediaryToken: string, tokenOut: string, feeTier1: number, feeTier2: number, amountIn: ethers.BigNumberish, amountOut: ethers.BigNumberish, tradeType: TradeType, options?: SwapOptions): Promise<ExactInputParams | ExactOutputParams>;
}
