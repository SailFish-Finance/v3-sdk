import { Provider, Signer, ethers, BigNumberish } from 'ethers';
import { TradeType as TradeType$1 } from '@uniswap/sdk-core';
export { CurrencyAmount, Percent, Token as SdkToken, TradeType } from '@uniswap/sdk-core';
import React from 'react';
import BigNumber from 'bignumber.js';
export { Pool as SdkPool, Route as SdkRoute, Trade as SdkTrade, SwapQuoter } from '@uniswap/v3-sdk';

/**
 * Bridge class for bridging tokens between chains
 */
declare class Bridge {
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

declare const BSC_ABI: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    inputs: ({
        internalType: string;
        name: string;
        type: string;
        components?: undefined;
    } | {
        components: {
            internalType: string;
            name: string;
            type: string;
        }[];
        internalType: string;
        name: string;
        type: string;
    })[];
    name: string;
    outputs: never[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];
declare const ADDRESSES: {
    WEDU: string;
    UNIVERSAL_ROUTER: string;
    PERSONAL_ASSET_MANAGER_FACTORY: string;
    ASSET_HELPER: string;
    UNISWAP_V3_FACTORY: string;
    NONFUNGIBLE_POSITION_MANAGER: string;
    SWAP_ROUTER: string;
    QUOTER: string;
    QUOTER_V2: string;
    TICK_LENS: string;
    USDC: string;
};
declare const CHAIN_ID = 41923;
declare const RPC_URL = "https://rpc.edu-chain.raas.gelato.cloud";
declare const MAX_INT128: bigint;
declare const MAX_UINT256: bigint;
declare const ROUTER_ABI: ({
    type: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    name?: undefined;
    outputs?: undefined;
} | {
    type: string;
    stateMutability: string;
    inputs?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
        components: {
            name: string;
            type: string;
            internalType: string;
        }[];
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
})[];
declare const ERC20_ABI: string[];
declare const QUOTER_V2_ABI: ({
    type: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    name?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
        components: {
            name: string;
            type: string;
            internalType: string;
        }[];
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
})[];
declare const UNISWAP_V3_FACTORY_ABI: {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
}[];
declare const NFT_POSITION_MANGER_ABI: ({
    type: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    type: string;
    stateMutability: string;
    inputs?: undefined;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
        components: {
            name: string;
            type: string;
            internalType: string;
        }[];
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        indexed: boolean;
        internalType: string;
    }[];
    anonymous: boolean;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: never[];
    stateMutability?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
})[];
declare const UNISWAP_V3_POOL_ABI: {
    type: string;
    name: string;
    inputs: never[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
}[];
declare const FEE_TIERS: {
    LOWEST: number;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
};
declare const FEE_TO_TICK_SPACING: {
    [FEE_TIERS.LOWEST]: number;
    [FEE_TIERS.LOW]: number;
    [FEE_TIERS.MEDIUM]: number;
    [FEE_TIERS.HIGH]: number;
};
declare const SUBGRAPH_URL = "https://api.goldsky.com/api/public/project_cm1s79wa2tlb701tbchmeaflf/subgraphs/sailfish-v3-occ-mainnet/1.0.3/gn";

interface Token {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}
interface Pool {
    id: string;
    token0: Token;
    token1: Token;
    feeTier: number;
    liquidity: string;
    token0Price?: string;
    token1Price?: string;
    sqrtPriceX96?: string;
    tick?: number;
}
interface Route {
    type: 'direct' | 'indirect';
    path: Pool[];
    intermediaryToken?: Token;
    totalFee: number;
}
interface RouteWithQuote extends Route {
    quote: {
        amountIn: string;
        amountOut: string;
        midPrice: {
            numerator: BigNumberish;
            denominator: BigNumberish;
            toSignificant: (significantDigits: number) => string;
        };
        priceImpact: {
            numerator: BigNumberish;
            denominator: BigNumberish;
            toSignificant: (significantDigits: number) => string;
            lessThan: (other: any) => boolean;
        };
        gasEstimate?: string;
    };
}
interface RoutesResult {
    type: 'direct' | 'indirect';
    routes: Route[];
}
interface QuoteExactInputSingleParams {
    tokenIn: string;
    tokenOut: string;
    amountIn: BigNumberish;
    fee: number;
    sqrtPriceLimitX96?: BigNumberish;
}
interface QuoteExactOutputSingleParams {
    tokenIn: string;
    tokenOut: string;
    amount: BigNumberish;
    fee: number;
    sqrtPriceLimitX96?: BigNumberish;
}
interface PoolInfo {
    token0: string;
    token1: string;
    fee: number;
    liquidity: BigNumberish;
    sqrtPriceX96: BigNumberish;
    tick: number;
    reserve0?: {
        balance: BigNumberish;
        name: string;
        decimals: number;
    };
    reserve1?: {
        balance: BigNumberish;
        name: string;
        decimals: number;
    };
}
interface SwapOptions {
    slippagePercentage?: number;
    deadline?: number;
    recipient?: string;
}
declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
interface ExactInputSingleParams {
    tokenIn: string;
    tokenOut: string;
    fee: number;
    recipient: string;
    deadline: number;
    amountIn: BigNumberish;
    amountOutMinimum: BigNumberish;
    sqrtPriceLimitX96: BigNumberish;
}
interface ExactOutputSingleParams {
    tokenIn: string;
    tokenOut: string;
    fee: number;
    recipient: string;
    deadline: number;
    amountOut: BigNumberish;
    amountInMaximum: BigNumberish;
    sqrtPriceLimitX96: BigNumberish;
}
interface ExactInputParams {
    path: string;
    recipient: string;
    deadline: number;
    amountIn: BigNumberish;
    amountOutMinimum: BigNumberish;
}
interface ExactOutputParams {
    path: string;
    recipient: string;
    deadline: number;
    amountOut: BigNumberish;
    amountInMaximum: BigNumberish;
}
interface QuoteResult {
    amountIn: string;
    amountOut: string;
    route: Route;
    priceImpact: string;
    executionPrice: string;
    intermediaryToken?: string;
    feeTier: number[];
    poolAddress: string[];
    gasEstimate?: string;
}

/**
 * SailFish Quoter class for getting quotes and finding routes
 */
declare class Quoter {
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
    getQuote(tokenIn: string, tokenOut: string, amountIn: string, amountOut: string, tradeType: TradeType$1): Promise<QuoteResult>;
    /**
     * Get all available fee tiers for a token pair
     * @param tokenA First token address
     * @param tokenB Second token address
     * @returns Promise resolving to an array of available fee tiers
     */
    getAvailableFeeTiers(tokenA: string, tokenB: string): Promise<number[]>;
}

/**
 * SailFish Router class for executing swaps
 */
declare class Router {
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
    theme?: "sailer" | "edu.fun";
}
declare const BridgeWidget: React.FC<BridgeWidgetProps>;

/**
 * Create a Token object from an address
 * @param address Token address
 * @param provider Ethers provider
 * @returns Promise resolving to a Token object
 */
declare function getTokenInfo(address: string, provider: ethers.Provider): Promise<Token>;
/**
 * Get pool address for a token pair and fee
 * @param tokenA First token address
 * @param tokenB Second token address
 * @param fee Fee tier
 * @param provider Ethers provider
 * @returns Pool address
 */
declare function getPoolAddress(tokenA: string, tokenB: string, fee: number, provider: ethers.Provider): Promise<string>;
/**
 * Get pool information
 * @param poolAddress Pool address
 * @param provider Ethers provider
 * @returns Pool information
 */
declare function getPoolInfo(poolAddress: string, provider: ethers.Provider): Promise<PoolInfo>;
/**
 * Sort tokens by address
 * @param tokenA First token
 * @param tokenB Second token
 * @returns Sorted tokens [token0, token1]
 */
declare function sortTokens(tokenA: string, tokenB: string): [string, string];
/**
 * Encode path for multi-hop swaps
 * @param path Array of token addresses and fees
 * @returns Encoded path
 */
declare function encodePath(path: {
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
declare function calculatePriceFromSqrtPriceX96(sqrtPriceX96: BigNumber | string | number, token0Decimals: number, token1Decimals: number): number;
/**
 * Calculate amount of token1 for a given amount of token0 and liquidity
 * @param amount0 Amount of token0
 * @param sqrtPriceX96 Square root price in X96 format
 * @param sqrtPriceX96Upper Upper square root price in X96 format
 * @returns Amount of token1
 */
declare function amount1(liquidity: string | number | BigNumber, sqrtPriceX96Lower: string | number | BigNumber, sqrtPriceX96: string | number | BigNumber): BigNumber;
/**
 * Calculate liquidity for a given amount of token0
 * @param amount0 Amount of token0
 * @param sqrtPriceX96 Square root price in X96 format
 * @param sqrtPriceX96Upper Upper square root price in X96 format
 * @returns Liquidity
 */
declare function liquidity0(amount0: string | number | BigNumber, sqrtPriceX96: string | number | BigNumber, sqrtPriceX96Upper: string | number | BigNumber): BigNumber;
/**
 * Calculate tick from price
 * @param price Price
 * @returns Tick
 */
declare function priceToTick(price: number): number;
/**
 * Calculate price from tick
 * @param tick Tick
 * @returns Price
 */
declare function tickToPrice(tick: number): number;
/**
 * Calculate square root price in X96 format from tick
 * @param tick Tick
 * @returns Square root price in X96 format
 */
declare function tickToSqrtPriceX96(tick: number): BigNumber;

interface PoolPosition {
    poolAddress: string;
    tokenId: string;
    token0: Token;
    token1: Token;
    fee: string;
    tickLower: string;
    tickUpper: string;
    liquidity: string;
    amount0: string;
    amount1: string;
    tokensOwed0: string;
    tokensOwed1: string;
    isBelowPrice1: boolean;
    isAbovePrice1: boolean;
    isInRange: boolean;
    tickCurrent: string;
    currentPrice: string;
    sqrtPriceX96: string;
    feeGrowthInside0LastX128: string;
    feeGrowthInside1LastX128: string;
    feesEarned0: string;
    feesEarned1: string;
    totalValueLocked: string;
    positionValue: string;
    apr: string;
    createdAt: string;
    nftPositionManagerId: string;
    owner: string;
}
interface PoolPortfolio {
    positions: PoolPosition[];
    totalValueLocked: string;
    totalFees: string;
    totalPositions: number;
    totalFeesEarned0: string;
    totalFeesEarned1: string;
    totalPositionsInRange: number;
    totalPositionsOutOfRange: number;
    totalApr: string;
}
interface AddLiquidityParams {
    token0: Token;
    token1: Token;
    fee: number;
    recipient: string;
    amount0Desired: string;
    amount1Desired: string;
    amount0Min: string;
    amount1Min: string;
    tickLower: number;
    tickUpper: number;
    deadline?: number;
    useNative?: boolean;
}
interface IncreaseLiquidityParams {
    tokenId: string;
    amount0Desired: string;
    amount1Desired: string;
    amount0Min: string;
    amount1Min: string;
    deadline?: number;
}
interface DecreaseLiquidityParams {
    tokenId: string;
    liquidity: string;
    amount0Min: string;
    amount1Min: string;
    deadline?: number;
    percentageToRemove?: number;
}
interface CollectFeesParams {
    tokenId: string;
    recipient: string;
    amount0Max?: BigNumberish;
    amount1Max?: BigNumberish;
}
interface PoolInitializeParams {
    token0: Token;
    token1: Token;
    fee: number;
    sqrtPriceX96: BigNumberish;
}
interface PositionDetails {
    tickLower: number;
    tickUpper: number;
    liquidity: string;
    token0: Token;
    token1: Token;
    fee: number;
    poolAddress: string;
    nftPositionManagerId: string;
    owner: string;
    feesEarned0: string;
    feesEarned1: string;
    createdAt: string;
}
interface TickData {
    tickIdx: number;
    liquidityNet: string;
    liquidityGross: string;
}
interface BarChartTick {
    tickIdx: number;
    liquidityActive: number;
    liquidityLockedToken0: number;
    liquidityLockedToken1: number;
    price0: number;
    price1: number;
    isCurrent: boolean;
}
declare enum PositionRange {
    IS_BELOW = "IS_BELOW",
    IS_ABOVE = "IS_ABOVE",
    IS_IN_RANGE = "IS_IN_RANGE"
}
interface PriceRange {
    minPrice: number;
    maxPrice: number;
    tickLower: number;
    tickUpper: number;
    minSqrtPriceX96: string;
    maxSqrtPriceX96: string;
}
type RangeType = "NARROW" | "COMMON" | "WIDE" | "INFINITE";
interface PoolRewards {
    tokenId: string;
    rewardToken: Token;
    rewardAmount: string;
    rewardRate: string;
    rewardPeriodEnd: string;
    earned: string;
    apr: string;
}
interface PoolStats {
    poolAddress: string;
    token0: Token;
    token1: Token;
    fee: number;
    liquidity: string;
    volume24h: string;
    volume7d: string;
    fees24h: string;
    fees7d: string;
    tvl: string;
    apr: string;
    priceChange24h: string;
    token0Price: string;
    token1Price: string;
    tick: number;
}

/**
 * PoolManager class for managing liquidity pools
 */
declare class PoolManager {
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

export { ADDRESSES, type AddLiquidityParams, BSC_ABI, type BarChartTick, Bridge, BridgeWidget, CHAIN_ID, type CollectFeesParams, type DecreaseLiquidityParams, ERC20_ABI, type ExactInputParams, type ExactInputSingleParams, type ExactOutputParams, type ExactOutputSingleParams, FEE_TIERS, FEE_TO_TICK_SPACING, type IncreaseLiquidityParams, MAX_INT128, MAX_UINT256, NFT_POSITION_MANGER_ABI, type Pool, type PoolInfo, type PoolInitializeParams, PoolManager, type PoolPortfolio, type PoolPosition, type PoolRewards, type PoolStats, type PositionDetails, PositionRange, type PriceRange, QUOTER_V2_ABI, type QuoteExactInputSingleParams, type QuoteExactOutputSingleParams, type QuoteResult, Quoter, ROUTER_ABI, RPC_URL, type RangeType, type Route, type RouteWithQuote, Router, type RoutesResult, SUBGRAPH_URL, type SwapOptions, type TickData, type Token, UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_POOL_ABI, amount1, calculatePriceFromSqrtPriceX96, encodePath, getPoolAddress, getPoolInfo, getTokenInfo, liquidity0, priceToTick, sortTokens, tickToPrice, tickToSqrtPriceX96 };
