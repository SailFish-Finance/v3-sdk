import { ethers, BigNumberish } from 'ethers';
import { TradeType } from '@uniswap/sdk-core';
import { QuoteResult, RoutesResult } from './types';
/**
 * SailFish Quoter class for getting quotes and finding routes
 */
export declare class Quoter {
    private provider;
    private quoterContract;
    /**
     * Create a new Quoter instance
     * @param provider An ethers Provider
     */
    constructor(provider: ethers.Provider);
    /**
     * Get the best route for a swap
     * @param tokenInAddress Input token address
     * @param tokenOutAddress Output token address
     * @returns Promise resolving to the best route
     */
    getBestRoute(tokenInAddress: string, tokenOutAddress: string): Promise<RoutesResult>;
    /**
     * Find all possible routes for a swap
     * @param tokenInAddress Input token address
     * @param tokenOutAddress Output token address
     * @returns Promise resolving to all possible routes
     */
    findAllRoutes(tokenInAddress: string, tokenOutAddress: string): Promise<RoutesResult>;
    /**
     * Query direct pools for a token pair
     * @param token0 First token address
     * @param token1 Second token address
     * @returns Promise resolving to direct pools
     */
    private queryDirectPools;
    /**
     * Query indirect pools for a token pair
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @returns Promise resolving to indirect pools
     */
    private queryIndirectPools;
    /**
     * Find intermediary tokens between two sets of pools
     * @param pools0 First set of pools
     * @param pools1 Second set of pools
     * @returns Array of intermediary tokens
     */
    private findIntermediaryTokens;
    /**
     * Construct indirect routes from pools and intermediary tokens
     * @param pools0 First set of pools
     * @param pools1 Second set of pools
     * @param intermediaryTokens Array of intermediary tokens
     * @returns Array of indirect routes
     */
    private constructIndirectRoutes;
    /**
     * Get a quote for an exact input swap
     * @param params Quote parameters
     * @returns Promise resolving to the quote result
     */
    quoteExactInputSingle(params: {
        tokenIn: string;
        tokenOut: string;
        amountIn: BigNumberish;
        fee: number;
        sqrtPriceLimitX96?: BigNumberish;
    }): Promise<ethers.Result>;
    /**
     * Get a quote for an exact output swap
     * @param params Quote parameters
     * @returns Promise resolving to the quote result
     */
    quoteExactOutputSingle(params: {
        tokenIn: string;
        tokenOut: string;
        amount: BigNumberish;
        fee: number;
        sqrtPriceLimitX96?: BigNumberish;
    }): Promise<ethers.Result>;
    /**
     * Get a quote for a swap
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input token (for exact input swaps)
     * @param amountOut Amount of output token (for exact output swaps)
     * @param tradeType Trade type (exact input or exact output)
     * @returns Promise resolving to the quote result
     */
    getQuote(tokenIn: string, tokenOut: string, amountIn: string, amountOut: string, tradeType: TradeType): Promise<QuoteResult>;
    /**
     * Get all available fee tiers for a token pair
     * @param tokenA First token address
     * @param tokenB Second token address
     * @returns Promise resolving to an array of available fee tiers
     */
    getAvailableFeeTiers(tokenA: string, tokenB: string): Promise<number[]>;
}
