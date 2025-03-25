import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Token, PoolInfo } from './types';
/**
 * Create a Token object from an address
 * @param address Token address
 * @param provider Ethers provider
 * @returns Promise resolving to a Token object
 */
export declare function getTokenInfo(address: string, provider: ethers.Provider): Promise<Token>;
/**
 * Get pool address for a token pair and fee
 * @param tokenA First token address
 * @param tokenB Second token address
 * @param fee Fee tier
 * @param provider Ethers provider
 * @returns Pool address
 */
export declare function getPoolAddress(tokenA: string, tokenB: string, fee: number, provider: ethers.Provider): Promise<string>;
/**
 * Get pool information
 * @param poolAddress Pool address
 * @param provider Ethers provider
 * @returns Pool information
 */
export declare function getPoolInfo(poolAddress: string, provider: ethers.Provider): Promise<PoolInfo>;
/**
 * Sort tokens by address
 * @param tokenA First token
 * @param tokenB Second token
 * @returns Sorted tokens [token0, token1]
 */
export declare function sortTokens(tokenA: string, tokenB: string): [string, string];
/**
 * Encode path for multi-hop swaps
 * @param path Array of token addresses and fees
 * @returns Encoded path
 */
export declare function encodePath(path: {
    token: string;
    fee: number;
}[]): string;
/**
 * Calculate price from sqrtPriceX96
 * @param sqrtPriceX96 Square root price in X96 format
 * @param token0Decimals Decimals of token0
 * @param token1Decimals Decimals of token1
 * @returns Price of token1 in terms of token0
 */
export declare function calculatePriceFromSqrtPriceX96(sqrtPriceX96: BigNumber | string | number, token0Decimals: number, token1Decimals: number): number;
/**
 * Calculate amount of token1 for a given amount of token0 and liquidity
 * @param amount0 Amount of token0
 * @param sqrtPriceX96 Square root price in X96 format
 * @param sqrtPriceX96Upper Upper square root price in X96 format
 * @returns Amount of token1
 */
export declare function amount1(liquidity: string | number | BigNumber, sqrtPriceX96Lower: string | number | BigNumber, sqrtPriceX96: string | number | BigNumber): BigNumber;
/**
 * Calculate liquidity for a given amount of token0
 * @param amount0 Amount of token0
 * @param sqrtPriceX96 Square root price in X96 format
 * @param sqrtPriceX96Upper Upper square root price in X96 format
 * @returns Liquidity
 */
export declare function liquidity0(amount0: string | number | BigNumber, sqrtPriceX96: string | number | BigNumber, sqrtPriceX96Upper: string | number | BigNumber): BigNumber;
/**
 * Calculate tick from price
 * @param price Price
 * @returns Tick
 */
export declare function priceToTick(price: number): number;
/**
 * Calculate price from tick
 * @param tick Tick
 * @returns Price
 */
export declare function tickToPrice(tick: number): number;
/**
 * Calculate square root price in X96 format from tick
 * @param tick Tick
 * @returns Square root price in X96 format
 */
export declare function tickToSqrtPriceX96(tick: number): BigNumber;
