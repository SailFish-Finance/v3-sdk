import { ethers } from 'ethers';
import { AddLiquidityParams, CollectFeesParams, DecreaseLiquidityParams, IncreaseLiquidityParams, PoolInitializeParams, PoolPortfolio, PoolPosition, PoolStats, PriceRange, RangeType } from './poolTypes';
import { PoolInfo } from './types';
/**
 * PoolManager class for managing liquidity pools
 */
export declare class PoolManager {
    private provider;
    private signer?;
    private nftPositionManagerAddress;
    private uniswapV3FactoryAddress;
    private nftPositionManagerAbi;
    private uniswapV3FactoryAbi;
    private erc20Abi;
    private chainId;
    private nativeWrappedTokenAddress;
    /**
     * Constructor for PoolManager
     * @param provider Ethers provider
     * @param signer Optional ethers signer for transactions
     * @param config Configuration options
     */
    constructor(provider: ethers.Provider, signer?: ethers.Signer, config?: {
        nftPositionManagerAddress: string;
        uniswapV3FactoryAddress: string;
        nftPositionManagerAbi?: any;
        uniswapV3FactoryAbi?: any;
        erc20Abi?: any;
        chainId: number;
        nativeWrappedTokenAddress: string;
    });
    /**
     * Initialize a new pool
     * @param params Pool initialization parameters
     * @returns The address of the created pool
     */
    initializePool(params: PoolInitializeParams): Promise<string>;
    /**
     * Get pool information
     * @param poolAddress The address of the pool
     * @returns Pool information
     */
    getPoolInfo(poolAddress: string): Promise<PoolInfo>;
    /**
     * Add liquidity to a pool
     * @param params Parameters for adding liquidity
     * @returns Transaction result with tokenId, liquidity, amount0, and amount1
     */
    addLiquidity(params: AddLiquidityParams): Promise<{
        tokenId: string;
        liquidity: string;
        amount0: string;
        amount1: string;
    }>;
    /**
     * Increase liquidity in an existing position
     * @param params Parameters for increasing liquidity
     * @returns Transaction result with liquidity, amount0, and amount1
     */
    increaseLiquidity(params: IncreaseLiquidityParams): Promise<{
        liquidity: string;
        amount0: string;
        amount1: string;
    }>;
    /**
     * Decrease liquidity in an existing position
     * @param params Parameters for decreasing liquidity
     * @returns Transaction result with amount0 and amount1
     */
    decreaseLiquidity(params: DecreaseLiquidityParams): Promise<{
        amount0: string;
        amount1: string;
    }>;
    /**
     * Collect fees from a position
     * @param params Parameters for collecting fees
     * @returns Transaction result with amount0 and amount1
     */
    collectFees(params: CollectFeesParams): Promise<{
        amount0: string;
        amount1: string;
    }>;
    /**
     * Burn a position NFT
     * @param tokenId The ID of the position token to burn
     * @returns Transaction receipt
     */
    burnPosition(tokenId: string): Promise<ethers.TransactionReceipt>;
    /**
     * Get all positions for an address
     * @param address The address to get positions for
     * @returns Array of positions
     */
    getPositions(address: string): Promise<PoolPosition[]>;
    /**
     * Get portfolio summary for an address
     * @param address The address to get portfolio for
     * @returns Portfolio summary
     */
    getPortfolio(address: string): Promise<PoolPortfolio>;
    /**
     * Get pool statistics
     * @param poolAddress The address of the pool
     * @returns Pool statistics
     */
    getPoolStats(poolAddress: string): Promise<PoolStats>;
    /**
     * Calculate price from sqrtPriceX96
     * @param sqrtPriceX96 The sqrt price X96
     * @param token0Decimals Decimals of token0
     * @param token1Decimals Decimals of token1
     * @returns The price
     */
    private sqrtPriceX96ToPrice;
    /**
     * Approve token for spending
     * @param tokenAddress The address of the token to approve
     * @param amount The amount to approve
     * @returns Transaction receipt
     */
    private approveToken;
    /**
     * Deploy liquidity to a pool
     * @param token0 Address of token0
     * @param token1 Address of token1
     * @param fee Fee tier
     * @param amount0 Amount of token0 to add
     * @param amount1 Amount of token1 to add
     * @param recipient Recipient of the position
     * @param tickLower Lower tick
     * @param tickUpper Upper tick
     * @returns Transaction result with tokenId, liquidity, amount0, and amount1
     */
    deployLiquidity(token0: string, token1: string, fee: number, amount0: string, amount1: string, recipient: string, tickLower?: number, // Full range by default
    tickUpper?: number): Promise<{
        tokenId: string;
        liquidity: string;
        amount0: string;
        amount1: string;
    }>;
    /**
     * Encode price sqrt for pool initialization
     * @param reserve1 Reserve of token1
     * @param reserve0 Reserve of token0
     * @returns Encoded sqrt price
     */
    private encodePriceSqrt;
    /**
     * Calculate price range from base price
     * @param sqrtPriceX96 The sqrt price X96
     * @param feeTier The fee tier
     * @param token0Decimals Decimals of token0
     * @param token1Decimals Decimals of token1
     * @param rangeType The range type (NARROW, COMMON, WIDE, INFINITE)
     * @returns The price range
     */
    calculatePriceRange(sqrtPriceX96: string, feeTier: number, token0Decimals: number, token1Decimals: number, rangeType: RangeType): PriceRange;
}
