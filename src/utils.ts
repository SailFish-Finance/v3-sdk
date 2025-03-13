import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Token, PoolInfo } from './types';
import { 
  ADDRESSES, 
  ERC20_ABI, 
  UNISWAP_V3_FACTORY_ABI, 
  UNISWAP_V3_POOL_ABI 
} from './constants';

/**
 * Create a Token object from an address
 * @param address Token address
 * @param provider Ethers provider
 * @returns Promise resolving to a Token object
 */
export async function getTokenInfo(
  address: string,
  provider: ethers.Provider
): Promise<Token> {
  const tokenContract = new ethers.Contract(address, ERC20_ABI, provider);
  
  const [decimals, symbol, name] = await Promise.all([
    tokenContract.decimals(),
    tokenContract.symbol(),
    tokenContract.symbol() // Using symbol as name since most ERC20s don't have a name() function
  ]);

  return {
    address,
    decimals: Number(decimals),
    symbol,
    name
  };
}

/**
 * Get pool address for a token pair and fee
 * @param tokenA First token address
 * @param tokenB Second token address
 * @param fee Fee tier
 * @param provider Ethers provider
 * @returns Pool address
 */
export async function getPoolAddress(
  tokenA: string,
  tokenB: string,
  fee: number,
  provider: ethers.Provider
): Promise<string> {
  const factoryContract = new ethers.Contract(
    ADDRESSES.UNISWAP_V3_FACTORY,
    UNISWAP_V3_FACTORY_ABI,
    provider
  );

  return factoryContract.getPool(tokenA, tokenB, fee);
}

/**
 * Get pool information
 * @param poolAddress Pool address
 * @param provider Ethers provider
 * @returns Pool information
 */
export async function getPoolInfo(
  poolAddress: string,
  provider: ethers.Provider
): Promise<PoolInfo> {
  const poolContract = new ethers.Contract(
    poolAddress,
    UNISWAP_V3_POOL_ABI,
    provider
  );

  const [token0, token1, fee, liquidity, slot0] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider);
  const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider);
  
  const [reserve0, reserve1] = await Promise.all([
    {
      balance: await token0Contract.balanceOf(poolAddress),
      name: await token0Contract.symbol(),
      decimals: await token0Contract.decimals(),
    },
    {
      balance: await token1Contract.balanceOf(poolAddress),
      name: await token1Contract.symbol(),
      decimals: await token1Contract.decimals(),
    },
  ]);

  return {
    token0,
    token1,
    fee: Number(fee),
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: Number(slot0[1]),
    reserve0,
    reserve1,
  };
}

/**
 * Sort tokens by address
 * @param tokenA First token
 * @param tokenB Second token
 * @returns Sorted tokens [token0, token1]
 */
export function sortTokens(tokenA: string, tokenB: string): [string, string] {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
}

/**
 * Encode path for multi-hop swaps
 * @param path Array of token addresses and fees
 * @returns Encoded path
 */
export function encodePath(path: { token: string; fee: number }[]): string {
  let encoded = '';
  for (let i = 0; i < path.length; i++) {
    encoded += path[i].token;
    if (i < path.length - 1) {
      encoded += toHex(path[i].fee, 3);
    }
  }
  return encoded;
}

/**
 * Convert a number to a hex string with specified byte length
 * @param num Number to convert
 * @param length Byte length
 * @returns Hex string
 */
function toHex(num: number, length: number): string {
  return '0x' + num.toString(16).padStart(length * 2, '0');
}

/**
 * Calculate price from sqrtPriceX96
 * @param sqrtPriceX96 Square root price in X96 format
 * @param token0Decimals Decimals of token0
 * @param token1Decimals Decimals of token1
 * @returns Price of token1 in terms of token0
 */
export function calculatePriceFromSqrtPriceX96(
  sqrtPriceX96: BigNumber | string | number,
  token0Decimals: number,
  token1Decimals: number
): number {
  // Convert to BigNumber if it's not already
  const sqrtPriceX96BN = new BigNumber(sqrtPriceX96.toString());
  
  // Q96 = 2^96
  const Q96 = new BigNumber(2).pow(96);
  
  // Convert to decimal for the sqrt price
  const sqrtPriceDecimal = sqrtPriceX96BN.div(Q96);
  
  // Square it to get the price
  const price = sqrtPriceDecimal.pow(2);
  
  // Adjust for decimals
  const adjustedPrice = price.times(new BigNumber(10).pow(token0Decimals - token1Decimals));
  
  return adjustedPrice.toNumber();
}

/**
 * Calculate amount of token1 for a given amount of token0 and liquidity
 * @param amount0 Amount of token0
 * @param sqrtPriceX96 Square root price in X96 format
 * @param sqrtPriceX96Upper Upper square root price in X96 format
 * @returns Amount of token1
 */
export function amount1(
  liquidity: string | number | BigNumber,
  sqrtPriceX96Lower: string | number | BigNumber,
  sqrtPriceX96: string | number | BigNumber
): BigNumber {
  const liquidityBN = new BigNumber(liquidity.toString());
  const sqrtPriceX96LowerBN = new BigNumber(sqrtPriceX96Lower.toString());
  const sqrtPriceX96BN = new BigNumber(sqrtPriceX96.toString());
  
  return liquidityBN.times(sqrtPriceX96BN.minus(sqrtPriceX96LowerBN)).div(new BigNumber(2).pow(96));
}

/**
 * Calculate liquidity for a given amount of token0
 * @param amount0 Amount of token0
 * @param sqrtPriceX96 Square root price in X96 format
 * @param sqrtPriceX96Upper Upper square root price in X96 format
 * @returns Liquidity
 */
export function liquidity0(
  amount0: string | number | BigNumber,
  sqrtPriceX96: string | number | BigNumber,
  sqrtPriceX96Upper: string | number | BigNumber
): BigNumber {
  const amount0BN = new BigNumber(amount0.toString());
  const sqrtPriceX96BN = new BigNumber(sqrtPriceX96.toString());
  const sqrtPriceX96UpperBN = new BigNumber(sqrtPriceX96Upper.toString());
  
  return amount0BN
    .times(sqrtPriceX96BN)
    .times(sqrtPriceX96UpperBN)
    .div(sqrtPriceX96UpperBN.minus(sqrtPriceX96BN))
    .div(new BigNumber(2).pow(96));
}

/**
 * Calculate tick from price
 * @param price Price
 * @returns Tick
 */
export function priceToTick(price: number): number {
  return Math.floor(Math.log(price) / Math.log(1.0001));
}

/**
 * Calculate price from tick
 * @param tick Tick
 * @returns Price
 */
export function tickToPrice(tick: number): number {
  return Math.pow(1.0001, tick);
}

/**
 * Calculate square root price in X96 format from tick
 * @param tick Tick
 * @returns Square root price in X96 format
 */
export function tickToSqrtPriceX96(tick: number): BigNumber {
  const price = tickToPrice(tick);
  const sqrtPrice = Math.sqrt(price);
  return new BigNumber(sqrtPrice).times(new BigNumber(2).pow(96));
}
