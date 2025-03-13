import { BigNumberish } from 'ethers';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface Pool {
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

export interface Route {
  type: 'direct' | 'indirect';
  path: Pool[];
  intermediaryToken?: Token;
  totalFee: number;
}

export interface RouteWithQuote extends Route {
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

export interface RoutesResult {
  type: 'direct' | 'indirect';
  routes: Route[];
}

export interface QuoteExactInputSingleParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: BigNumberish;
  fee: number;
  sqrtPriceLimitX96?: BigNumberish;
}

export interface QuoteExactOutputSingleParams {
  tokenIn: string;
  tokenOut: string;
  amount: BigNumberish;
  fee: number;
  sqrtPriceLimitX96?: BigNumberish;
}

export interface PoolInfo {
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

export interface SwapOptions {
  slippagePercentage?: number;
  deadline?: number;
  recipient?: string;
}

export enum TradeType {
  EXACT_INPUT = 0,
  EXACT_OUTPUT = 1
}

export interface ExactInputSingleParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  deadline: number;
  amountIn: BigNumberish;
  amountOutMinimum: BigNumberish;
  sqrtPriceLimitX96: BigNumberish;
}

export interface ExactOutputSingleParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  deadline: number;
  amountOut: BigNumberish;
  amountInMaximum: BigNumberish;
  sqrtPriceLimitX96: BigNumberish;
}

export interface ExactInputParams {
  path: string;
  recipient: string;
  deadline: number;
  amountIn: BigNumberish;
  amountOutMinimum: BigNumberish;
}

export interface ExactOutputParams {
  path: string;
  recipient: string;
  deadline: number;
  amountOut: BigNumberish;
  amountInMaximum: BigNumberish;
}

export interface QuoteResult {
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
