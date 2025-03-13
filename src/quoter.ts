import { ethers, BigNumberish } from 'ethers';
import { request, gql } from 'graphql-request';
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Route, SwapQuoter, Trade } from '@uniswap/v3-sdk';
import BigNumber from 'bignumber.js';
import { 
  ADDRESSES, 
  CHAIN_ID, 
  QUOTER_V2_ABI, 
  SUBGRAPH_URL,
  FEE_TIERS
} from './constants';
import { 
  PoolInfo, 
  QuoteExactInputSingleParams, 
  QuoteExactOutputSingleParams, 
  QuoteResult, 
  Route as RouteType, 
  RoutesResult, 
  Token as TokenType 
} from './types';
import { getPoolInfo, getTokenInfo, sortTokens } from './utils';

/**
 * SailFish Quoter class for getting quotes and finding routes
 */
export class Quoter {
  private provider: ethers.Provider;
  private quoterContract: ethers.Contract;

  /**
   * Create a new Quoter instance
   * @param provider An ethers Provider
   */
  constructor(provider: ethers.Provider) {
    this.provider = provider;
    this.quoterContract = new ethers.Contract(
      ADDRESSES.QUOTER_V2,
      QUOTER_V2_ABI,
      this.provider
    );
  }

  /**
   * Get the best route for a swap
   * @param tokenInAddress Input token address
   * @param tokenOutAddress Output token address
   * @returns Promise resolving to the best route
   */
  public async getBestRoute(
    tokenInAddress: string,
    tokenOutAddress: string
  ): Promise<RoutesResult> {
    const routes = await this.findAllRoutes(tokenInAddress, tokenOutAddress);
    return routes;
  }

  /**
   * Find all possible routes for a swap
   * @param tokenInAddress Input token address
   * @param tokenOutAddress Output token address
   * @returns Promise resolving to all possible routes
   */
  public async findAllRoutes(
    tokenInAddress: string,
    tokenOutAddress: string
  ): Promise<RoutesResult> {
    try {
      // First, try to find direct routes
      const directPools = await this.queryDirectPools(
        tokenInAddress.toLowerCase(),
        tokenOutAddress.toLowerCase()
      );

      // If direct routes exist, return them
      if (directPools.pools.length > 0) {
        return {
          type: 'direct',
          routes: directPools.pools
            .map((pool: any) => ({
              type: 'direct',
              path: [
                {
                  id: pool.id,
                  token0: {
                    address: pool.token0.id,
                    symbol: pool.token0.symbol,
                    decimals: Number(pool.token0.decimals),
                    name: pool.token0.name,
                  },
                  token1: {
                    address: pool.token1.id,
                    symbol: pool.token1.symbol,
                    decimals: Number(pool.token1.decimals),
                    name: pool.token1.name,
                  },
                  feeTier: Number(pool.feeTier),
                  liquidity: pool.liquidity,
                  token0Price: pool.token0Price,
                  token1Price: pool.token1Price,
                },
              ],
              totalFee: Number(pool.feeTier),
            }))
            .sort(
              (a: RouteType, b: RouteType) =>
                Number(b.path[0].liquidity) - Number(a.path[0].liquidity)
            ),
        };
      }

      // If no direct routes, look for indirect routes
      const indirectPools = await this.queryIndirectPools(
        tokenInAddress.toLowerCase(),
        tokenOutAddress.toLowerCase()
      );

      // Find common tokens between pools containing tokenIn and tokenOut
      const intermediaryTokens = this.findIntermediaryTokens(
        indirectPools.pools0,
        indirectPools.pools1
      );

      // Construct indirect routes
      const routes = this.constructIndirectRoutes(
        indirectPools.pools0,
        indirectPools.pools1,
        intermediaryTokens
      );

      return {
        type: 'indirect',
        routes: routes,
      };
    } catch (error) {
      console.error('Error finding routes:', error);
      throw error;
    }
  }

  /**
   * Query direct pools for a token pair
   * @param token0 First token address
   * @param token1 Second token address
   * @returns Promise resolving to direct pools
   */
  private async queryDirectPools(token0: string, token1: string): Promise<any> {
    const query = gql`
      query findDirectPools($token0: String!, $token1: String!) {
        pools(
          where: {
            and: [
              { token0_in: [$token0, $token1] }
              { token1_in: [$token0, $token1] }
              { liquidity_gt: 0 }
            ]
          }
        ) {
          id
          token0 {
            id
            symbol
            decimals
            name
          }
          token1 {
            id
            symbol
            decimals
            name
          }
          feeTier
          liquidity
          token0Price
          token1Price
        }
      }
    `;

    return request(SUBGRAPH_URL, query, {
      token0,
      token1,
    });
  }

  /**
   * Query indirect pools for a token pair
   * @param tokenIn Input token address
   * @param tokenOut Output token address
   * @returns Promise resolving to indirect pools
   */
  private async queryIndirectPools(tokenIn: string, tokenOut: string): Promise<any> {
    const query = gql`
      query findIndirectPools($tokenIn: String!, $tokenOut: String!) {
        # First, find pools containing tokenIn
        pools0: pools(
          where: {
            or: [
              {
                token0: $tokenIn
                liquidity_gt: 0
              }
              {
                token1: $tokenIn
                liquidity_gt: 0
              }
            ]
          }
        ) {
          id
          token0 {
            id
            symbol
            decimals
            name
          }
          token1 {
            id
            symbol
            decimals
            name
          }
          feeTier
          liquidity
        }
        # Then, find pools containing tokenOut
        pools1: pools(
          where: {
            or: [
              {
                token0: $tokenOut
                liquidity_gt: 0
              }
              {
                token1: $tokenOut
                liquidity_gt: 0
              }
            ]
          }
        ) {
          id
          token0 {
            id
            symbol
            decimals
            name
          }
          token1 {
            id
            symbol
            decimals
            name
          }
          feeTier
          liquidity
        }
      }
    `;

    return request(SUBGRAPH_URL, query, {
      tokenIn,
      tokenOut,
    });
  }

  /**
   * Find intermediary tokens between two sets of pools
   * @param pools0 First set of pools
   * @param pools1 Second set of pools
   * @returns Array of intermediary tokens
   */
  private findIntermediaryTokens(pools0: any[], pools1: any[]): string[] {
    const tokens0 = new Set<string>();
    const tokens1 = new Set<string>();

    // Collect all tokens from first hop pools
    pools0.forEach((pool: any) => {
      tokens0.add(pool.token0.id);
      tokens0.add(pool.token1.id);
    });

    // Collect all tokens from second hop pools
    pools1.forEach((pool: any) => {
      tokens1.add(pool.token0.id);
      tokens1.add(pool.token1.id);
    });

    // Find intersection of tokens (potential intermediary tokens)
    return Array.from(tokens0).filter((token) => tokens1.has(token));
  }

  /**
   * Construct indirect routes from pools and intermediary tokens
   * @param pools0 First set of pools
   * @param pools1 Second set of pools
   * @param intermediaryTokens Array of intermediary tokens
   * @returns Array of indirect routes
   */
  private constructIndirectRoutes(
    pools0: any[],
    pools1: any[],
    intermediaryTokens: string[]
  ): RouteType[] {
    const routes: RouteType[] = [];

    intermediaryTokens.forEach((intermediaryToken) => {
      const firstHopPools = pools0.filter(
        (pool: any) =>
          pool.token0.id === intermediaryToken ||
          pool.token1.id === intermediaryToken
      );

      const secondHopPools = pools1.filter(
        (pool: any) =>
          pool.token0.id === intermediaryToken ||
          pool.token1.id === intermediaryToken
      );

      firstHopPools.forEach((firstPool: any) => {
        secondHopPools.forEach((secondPool: any) => {
          const intermediaryTokenDetails = {
            address: intermediaryToken,
            symbol:
              firstPool.token0.id === intermediaryToken
                ? firstPool.token0.symbol
                : firstPool.token1.symbol,
            decimals:
              firstPool.token0.id === intermediaryToken
                ? Number(firstPool.token0.decimals)
                : Number(firstPool.token1.decimals),
            name:
              firstPool.token0.id === intermediaryToken
                ? firstPool.token0.name
                : firstPool.token1.name,
          };

          routes.push({
            type: 'indirect',
            path: [
              {
                id: firstPool.id,
                token0: {
                  address: firstPool.token0.id,
                  symbol: firstPool.token0.symbol,
                  decimals: Number(firstPool.token0.decimals),
                  name: firstPool.token0.name,
                },
                token1: {
                  address: firstPool.token1.id,
                  symbol: firstPool.token1.symbol,
                  decimals: Number(firstPool.token1.decimals),
                  name: firstPool.token1.name,
                },
                feeTier: Number(firstPool.feeTier),
                liquidity: firstPool.liquidity,
              },
              {
                id: secondPool.id,
                token0: {
                  address: secondPool.token0.id,
                  symbol: secondPool.token0.symbol,
                  decimals: Number(secondPool.token0.decimals),
                  name: secondPool.token0.name,
                },
                token1: {
                  address: secondPool.token1.id,
                  symbol: secondPool.token1.symbol,
                  decimals: Number(secondPool.token1.decimals),
                  name: secondPool.token1.name,
                },
                feeTier: Number(secondPool.feeTier),
                liquidity: secondPool.liquidity,
              },
            ],
            intermediaryToken: intermediaryTokenDetails,
            totalFee: (Number(firstPool.feeTier) + Number(secondPool.feeTier)) / 1000000,
          });
        });
      });
    });

    return routes.sort(
      (a: RouteType, b: RouteType) =>
        Number(b.path[0].liquidity) +
        Number(b.path[1].liquidity) -
        (Number(a.path[0].liquidity) + Number(a.path[1].liquidity))
    );
  }

  /**
   * Get a quote for an exact input swap
   * @param params Quote parameters
   * @returns Promise resolving to the quote result
   */
  public async quoteExactInputSingle(
    params: {
      tokenIn: string;
      tokenOut: string;
      amountIn: BigNumberish;
      fee: number;
      sqrtPriceLimitX96?: BigNumberish;
    }
  ): Promise<ethers.Result> {
    return this.quoterContract.quoteExactInputSingle.staticCall(params);
  }

  /**
   * Get a quote for an exact output swap
   * @param params Quote parameters
   * @returns Promise resolving to the quote result
   */
  public async quoteExactOutputSingle(
    params: {
      tokenIn: string;
      tokenOut: string;
      amount: BigNumberish;
      fee: number;
      sqrtPriceLimitX96?: BigNumberish;
    }
  ): Promise<ethers.Result> {
    return this.quoterContract.quoteExactOutputSingle.staticCall(params);
  }

  /**
   * Get a quote for a swap
   * @param tokenIn Input token address
   * @param tokenOut Output token address
   * @param amountIn Amount of input token (for exact input swaps)
   * @param amountOut Amount of output token (for exact output swaps)
   * @param tradeType Trade type (exact input or exact output)
   * @returns Promise resolving to the quote result
   */
  public async getQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    amountOut: string,
    tradeType: TradeType
  ): Promise<QuoteResult> {
    // Get the best route
    const routeResult = await this.getBestRoute(tokenIn, tokenOut);
    if (!routeResult.routes.length) {
      throw new Error('No route found');
    }

    // Get token info
    const tokenInInfo = await getTokenInfo(tokenIn, this.provider);
    const tokenOutInfo = await getTokenInfo(tokenOut, this.provider);

    // Create SDK tokens
    const sdkTokenIn = new Token(
      CHAIN_ID,
      tokenIn,
      tokenInInfo.decimals,
      tokenInInfo.symbol,
      tokenInInfo.name
    );

    const sdkTokenOut = new Token(
      CHAIN_ID,
      tokenOut,
      tokenOutInfo.decimals,
      tokenOutInfo.symbol,
      tokenOutInfo.name
    );

    // Get the best route
    const bestRoute = routeResult.routes[0];

    // Handle direct and indirect routes differently
    if (bestRoute.type === 'direct') {
      const poolAddress = bestRoute.path[0].id;
      const poolInfo = await getPoolInfo(poolAddress, this.provider);
      const fee = poolInfo.fee;

      // Create quote parameters and get quote from contract
      let quoteResult;
      if (tradeType === TradeType.EXACT_INPUT) {
        const params = {
          tokenIn,
          tokenOut,
          amountIn: ethers.parseUnits(amountIn, tokenInInfo.decimals),
          fee,
          sqrtPriceLimitX96: 0
        };
        quoteResult = await this.quoteExactInputSingle(params);
      } else {
        const params = {
          tokenIn,
          tokenOut,
          amount: ethers.parseUnits(amountOut, tokenOutInfo.decimals),
          fee,
          sqrtPriceLimitX96: 0
        };
        quoteResult = await this.quoteExactOutputSingle(params);
      }

      // Create SDK pools
      const pool = new Pool(
        sdkTokenIn,
        sdkTokenOut,
        poolInfo.fee,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        poolInfo.tick
      );

      // Create a route
      const route = new Route([pool], sdkTokenIn, sdkTokenOut);

      // Create a trade
      let trade;
      if (tradeType === TradeType.EXACT_INPUT) {
        const amountInWei = ethers.parseUnits(amountIn, tokenInInfo.decimals);
        const currencyAmountIn = CurrencyAmount.fromRawAmount(
          sdkTokenIn,
          amountInWei.toString()
        );
        
        const currencyAmountOut = CurrencyAmount.fromRawAmount(
          sdkTokenOut,
          quoteResult[0].toString()
        );
        
        trade = Trade.createUncheckedTrade({
          route,
          inputAmount: currencyAmountIn,
          outputAmount: currencyAmountOut,
          tradeType: TradeType.EXACT_INPUT,
        });
      } else {
        const amountOutWei = ethers.parseUnits(amountOut, tokenOutInfo.decimals);
        const currencyAmountOut = CurrencyAmount.fromRawAmount(
          sdkTokenOut,
          amountOutWei.toString()
        );
        
        const currencyAmountIn = CurrencyAmount.fromRawAmount(
          sdkTokenIn,
          quoteResult[0].toString()
        );
        
        trade = Trade.createUncheckedTrade({
          route,
          inputAmount: currencyAmountIn,
          outputAmount: currencyAmountOut,
          tradeType: TradeType.EXACT_OUTPUT,
        });
      }

      // Format the result
      const formattedAmountIn = ethers.formatUnits(
        trade.inputAmount.quotient.toString(),
        tokenInInfo.decimals
      );
      
      const formattedAmountOut = ethers.formatUnits(
        trade.outputAmount.quotient.toString(),
        tokenOutInfo.decimals
      );

      return {
        amountIn: formattedAmountIn,
        amountOut: formattedAmountOut,
        route: bestRoute,
        priceImpact: trade.priceImpact.toSignificant(2),
        executionPrice: trade.executionPrice.toSignificant(6),
        feeTier: [poolInfo.fee],
        poolAddress: [poolAddress],
        gasEstimate: quoteResult[3].toString()
      };
    } else {
      // For indirect routes, we need to do two quotes
      const intermediaryToken = bestRoute.intermediaryToken as TokenType;
      const sdkIntermediaryToken = new Token(
        CHAIN_ID,
        intermediaryToken.address,
        intermediaryToken.decimals,
        intermediaryToken.symbol,
        intermediaryToken.name
      );

      // Get pool info for both hops
      const poolAddress1 = bestRoute.path[0].id;
      const poolAddress2 = bestRoute.path[1].id;
      const poolInfo1 = await getPoolInfo(poolAddress1, this.provider);
      const poolInfo2 = await getPoolInfo(poolAddress2, this.provider);

      // Create SDK pools
      const pool1 = new Pool(
        sdkTokenIn,
        sdkIntermediaryToken,
        poolInfo1.fee,
        poolInfo1.sqrtPriceX96.toString(),
        poolInfo1.liquidity.toString(),
        poolInfo1.tick
      );

      const pool2 = new Pool(
        sdkIntermediaryToken,
        sdkTokenOut,
        poolInfo2.fee,
        poolInfo2.sqrtPriceX96.toString(),
        poolInfo2.liquidity.toString(),
        poolInfo2.tick
      );

      // Create a route
      const route = new Route([pool1, pool2], sdkTokenIn, sdkTokenOut);

      // Create a trade
      let trade;
      if (tradeType === TradeType.EXACT_INPUT) {
        const amountInWei = ethers.parseUnits(amountIn, tokenInInfo.decimals);
        const currencyAmountIn = CurrencyAmount.fromRawAmount(
          sdkTokenIn,
          amountInWei.toString()
        );
        
        // Get quote from contract
        const quoteParams = SwapQuoter.quoteCallParameters(
          route,
          currencyAmountIn,
          TradeType.EXACT_INPUT,
          { useQuoterV2: true }
        );
        
        const quoteCallReturnData = await this.provider.call({
          to: ADDRESSES.QUOTER_V2,
          data: quoteParams.calldata,
        });
        
        const amountOut = ethers.AbiCoder.defaultAbiCoder().decode(
          ['uint256'],
          quoteCallReturnData
        )[0];
        
        const currencyAmountOut = CurrencyAmount.fromRawAmount(
          sdkTokenOut,
          amountOut.toString()
        );
        
        trade = Trade.createUncheckedTrade({
          route,
          inputAmount: currencyAmountIn,
          outputAmount: currencyAmountOut,
          tradeType: TradeType.EXACT_INPUT,
        });
      } else {
        const amountOutWei = ethers.parseUnits(amountOut, tokenOutInfo.decimals);
        const currencyAmountOut = CurrencyAmount.fromRawAmount(
          sdkTokenOut,
          amountOutWei.toString()
        );
        
        // Get quote from contract
        const quoteParams = SwapQuoter.quoteCallParameters(
          route,
          currencyAmountOut,
          TradeType.EXACT_OUTPUT,
          { useQuoterV2: true }
        );
        
        const quoteCallReturnData = await this.provider.call({
          to: ADDRESSES.QUOTER_V2,
          data: quoteParams.calldata,
        });
        
        const amountIn = ethers.AbiCoder.defaultAbiCoder().decode(
          ['uint256'],
          quoteCallReturnData
        )[0];
        
        const currencyAmountIn = CurrencyAmount.fromRawAmount(
          sdkTokenIn,
          amountIn.toString()
        );
        
        trade = Trade.createUncheckedTrade({
          route,
          inputAmount: currencyAmountIn,
          outputAmount: currencyAmountOut,
          tradeType: TradeType.EXACT_OUTPUT,
        });
      }

      // Format the result
      const formattedAmountIn = ethers.formatUnits(
        trade.inputAmount.quotient.toString(),
        tokenInInfo.decimals
      );
      
      const formattedAmountOut = ethers.formatUnits(
        trade.outputAmount.quotient.toString(),
        tokenOutInfo.decimals
      );

      return {
        amountIn: formattedAmountIn,
        amountOut: formattedAmountOut,
        route: bestRoute,
        priceImpact: trade.priceImpact.toSignificant(2),
        executionPrice: trade.executionPrice.toSignificant(6),
        feeTier: [poolInfo1.fee, poolInfo2.fee], // Combined fee for multi-hop
        intermediaryToken: intermediaryToken.address,
        poolAddress: [poolAddress1,poolAddress2], // Both pool addresses for multi-hop
        gasEstimate: '0' // Gas estimate not available for multi-hop swaps
      };
    }
  }

  /**
   * Get all available fee tiers for a token pair
   * @param tokenA First token address
   * @param tokenB Second token address
   * @returns Promise resolving to an array of available fee tiers
   */
  public async getAvailableFeeTiers(
    tokenA: string,
    tokenB: string
  ): Promise<number[]> {
    const [token0, token1] = sortTokens(tokenA, tokenB);
    const availableFeeTiers: number[] = [];

    // Check each fee tier
    for (const feeTier of Object.values(FEE_TIERS)) {
      const factoryContract = new ethers.Contract(
        ADDRESSES.UNISWAP_V3_FACTORY,
        ['function getPool(address, address, uint24) view returns (address)'],
        this.provider
      );

      const poolAddress = await factoryContract.getPool(token0, token1, feeTier);

      // If pool exists and has liquidity, add fee tier to available tiers
      if (poolAddress !== ethers.ZeroAddress) {
        const poolContract = new ethers.Contract(
          poolAddress,
          ['function liquidity() view returns (uint128)'],
          this.provider
        );

        const liquidity = await poolContract.liquidity();
        if (liquidity > 0) {
          availableFeeTiers.push(Number(feeTier));
        }
      }
    }

    return availableFeeTiers;
  }
}
