import { BigNumberish } from 'ethers';
import { Token } from './types';
export interface PoolPosition {
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
export interface PoolPortfolio {
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
export interface AddLiquidityParams {
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
export interface IncreaseLiquidityParams {
    tokenId: string;
    amount0Desired: string;
    amount1Desired: string;
    amount0Min: string;
    amount1Min: string;
    deadline?: number;
}
export interface DecreaseLiquidityParams {
    tokenId: string;
    liquidity: string;
    amount0Min: string;
    amount1Min: string;
    deadline?: number;
    percentageToRemove?: number;
}
export interface CollectFeesParams {
    tokenId: string;
    recipient: string;
    amount0Max?: BigNumberish;
    amount1Max?: BigNumberish;
}
export interface PoolInitializeParams {
    token0: Token;
    token1: Token;
    fee: number;
    sqrtPriceX96: BigNumberish;
}
export interface PositionDetails {
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
export interface TickData {
    tickIdx: number;
    liquidityNet: string;
    liquidityGross: string;
}
export interface BarChartTick {
    tickIdx: number;
    liquidityActive: number;
    liquidityLockedToken0: number;
    liquidityLockedToken1: number;
    price0: number;
    price1: number;
    isCurrent: boolean;
}
export declare enum PositionRange {
    IS_BELOW = "IS_BELOW",
    IS_ABOVE = "IS_ABOVE",
    IS_IN_RANGE = "IS_IN_RANGE"
}
export interface PriceRange {
    minPrice: number;
    maxPrice: number;
    tickLower: number;
    tickUpper: number;
    minSqrtPriceX96: string;
    maxSqrtPriceX96: string;
}
export type RangeType = "NARROW" | "COMMON" | "WIDE" | "INFINITE";
export interface PoolRewards {
    tokenId: string;
    rewardToken: Token;
    rewardAmount: string;
    rewardRate: string;
    rewardPeriodEnd: string;
    earned: string;
    apr: string;
}
export interface PoolStats {
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
