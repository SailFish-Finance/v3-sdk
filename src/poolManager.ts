import { BigNumber } from 'bignumber.js';
import { ethers, Contract, BigNumberish, formatUnits, parseUnits } from 'ethers';
import JSBI from 'jsbi';
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { Pool, Position, nearestUsableTick, TickMath } from '@uniswap/v3-sdk';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import { NFT_POSITION_MANGER_ABI, ADDRESSES, SUBGRAPH_URL } from './constants';
import { Quoter } from './quoter';

import {
  AddLiquidityParams,
  BarChartTick,
  CollectFeesParams,
  DecreaseLiquidityParams,
  IncreaseLiquidityParams,
  PoolInitializeParams,
  PoolPortfolio,
  PoolPosition,
  PoolRewards,
  PoolStats,
  PositionRange,
  PriceRange,
  RangeType,
  TickData
} from './poolTypes';
import { PoolInfo, Token as SdkToken } from './types';

// Constants
const MAX_INT128 = JSBI.subtract(
  JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128)),
  JSBI.BigInt(1)
);

const FEE_TO_TICKSPACING: { [x: number]: number } = {
  100: 1,    // 0.01% fee tier -> 1 tick spacing
  500: 10,   // 0.05% fee tier -> 10 tick spacing
  3000: 60,  // 0.3% fee tier -> 60 tick spacing
  10000: 200 // 1% fee tier -> 200 tick spacing
};

/**
 * PoolManager class for managing liquidity pools
 */
export class PoolManager {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private nftPositionManagerAddress: string;
  private uniswapV3FactoryAddress: string;
  private nftPositionManagerAbi: any;
  private uniswapV3FactoryAbi: any;
  private erc20Abi: any;
  private chainId: number;
  private nativeWrappedTokenAddress: string;

  /**
   * Constructor for PoolManager
   * @param provider Ethers provider
   * @param signer Optional ethers signer for transactions
   * @param config Configuration options
   */
  constructor(
    provider: ethers.Provider,
    signer?: ethers.Signer,
    config?: {
      nftPositionManagerAddress: string;
      uniswapV3FactoryAddress: string;
      nftPositionManagerAbi?: any;
      uniswapV3FactoryAbi?: any;
      erc20Abi?: any;
      chainId: number;
      nativeWrappedTokenAddress: string;
    }
  ) {
    this.provider = provider;
    this.signer = signer;
    
    // Set default ABIs if not provided
    this.nftPositionManagerAbi = config?.nftPositionManagerAbi || NFT_POSITION_MANGER_ABI;
    
    this.uniswapV3FactoryAbi = config?.uniswapV3FactoryAbi || [
      "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
      "function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)"
    ];
    
    this.erc20Abi = config?.erc20Abi || [
      "function balanceOf(address owner) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function decimals() external view returns (uint8)",
      "function symbol() external view returns (string)",
      "function name() external view returns (string)"
    ];
    
    // Set addresses and chain ID
    this.nftPositionManagerAddress = config?.nftPositionManagerAddress || '';
    this.uniswapV3FactoryAddress = config?.uniswapV3FactoryAddress || '';
    this.chainId = config?.chainId || 1;
    this.nativeWrappedTokenAddress = config?.nativeWrappedTokenAddress || '';
  }

  /**
   * Initialize a new pool
   * @param params Pool initialization parameters
   * @returns The address of the created pool
   */
  async initializePool(params: PoolInitializeParams): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer is required for initializing a pool');
    }

    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    try {
      const tx = await nftPositionManager.createAndInitializePoolIfNecessary(
        params.token0.address,
        params.token1.address,
        params.fee,
        params.sqrtPriceX96
      );
      
      const receipt = await tx.wait();
      
      // Extract pool address from transaction receipt
      // This is a simplified approach; in a real implementation, you would need to parse the event logs
      const factory = new Contract(
        this.uniswapV3FactoryAddress,
        this.uniswapV3FactoryAbi,
        this.provider
      );
      
      const poolAddress = await factory.getPool(
        params.token0.address,
        params.token1.address,
        params.fee
      );
      
      return poolAddress;
    } catch (error: any) {
      throw new Error(`Failed to initialize pool: ${error.message}`);
    }
  }

  /**
   * Get pool information
   * @param poolAddress The address of the pool
   * @returns Pool information
   */
  async getPoolInfo(poolAddress: string): Promise<PoolInfo> {
    const poolContract = new Contract(
      poolAddress,
      IUniswapV3PoolABI.abi,
      this.provider
    );

    try {
      const [token0, token1, fee, liquidity, slot0] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ]);

      const token0Contract = new Contract(token0, this.erc20Abi, this.provider);
      const token1Contract = new Contract(token1, this.erc20Abi, this.provider);
      
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
    } catch (error: any) {
      throw new Error(`Failed to get pool info: ${error.message}`);
    }
  }

  /**
   * Add liquidity to a pool
   * @param params Parameters for adding liquidity
   * @returns Transaction result with tokenId, liquidity, amount0, and amount1
   */
  async addLiquidity(params: AddLiquidityParams): Promise<{
    tokenId: string;
    liquidity: string;
    amount0: string;
    amount1: string;
  }> {
    if (!this.signer) {
      throw new Error('Signer is required for adding liquidity');
    }

    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    // Set default deadline if not provided
    const deadline = params.deadline || Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {
      const mintParams = {
        token0: params.token0.address,
        token1: params.token1.address,
        fee: params.fee,
        tickLower: params.tickLower,
        tickUpper: params.tickUpper,
        amount0Desired: params.amount0Desired,
        amount1Desired: params.amount1Desired,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        recipient: params.recipient,
        deadline
      };

      // Check if one of the tokens is WEDU (native EDU)
      const isToken0Native = params.token0.address.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
      const isToken1Native = params.token1.address.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
      const useNative = params.useNative || isToken0Native || isToken1Native;
      
      // Determine value to send with transaction if using native EDU
      const value = useNative 
        ? (isToken0Native 
            ? params.amount0Desired 
            : isToken1Native 
              ? params.amount1Desired 
              : 0)
        : 0;

      // Use multicall for better handling of native EDU
      const multicallData = [];
      
      // Add mint call to multicall
      multicallData.push(
        nftPositionManager.interface.encodeFunctionData("mint", [mintParams])
      );
      
      // Add refundETH call to multicall to handle any leftover ETH
      if (useNative) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("refundETH", [])
        );
      }
      
      // Execute multicall
      const tx = await nftPositionManager.multicall(multicallData, { value });
      const receipt = await tx.wait();

      // Parse the event logs to get the result
      const events = receipt.logs.map((log: any) => {
        try {
          return nftPositionManager.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      // When adding liquidity, two events are emitted:
      // 1. Transfer event for the NFT creation
      // 2. IncreaseLiquidity event for the liquidity addition
      const transferEvent = events.find((event: any) => event.name === 'Transfer');
      const increaseLiquidityEvent = events.find((event: any) => event.name === 'IncreaseLiquidity');
      
      // Create result object with transaction hash
      const result: any = {
        transactionHash: receipt.hash
      };
      
      // Add data from events if available
      if (transferEvent && transferEvent.args.tokenId) {
        result.tokenId = transferEvent.args.tokenId.toString();
      } else if (increaseLiquidityEvent && increaseLiquidityEvent.args.tokenId) {
        result.tokenId = increaseLiquidityEvent.args.tokenId.toString();
      }
      
      if (increaseLiquidityEvent) {
        if (increaseLiquidityEvent.args.liquidity) {
          result.liquidity = increaseLiquidityEvent.args.liquidity.toString();
        }
        if (increaseLiquidityEvent.args.amount0) {
          result.amount0 = increaseLiquidityEvent.args.amount0.toString();
        }
        if (increaseLiquidityEvent.args.amount1) {
          result.amount1 = increaseLiquidityEvent.args.amount1.toString();
        }
      }
      
      if (!transferEvent || !increaseLiquidityEvent) {
        console.warn('Could not parse all events from transaction logs. Returning partial data.');
        console.log('Events:', events);
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Failed to add liquidity: ${error.message}`);
    }
  }

  /**
   * Increase liquidity in an existing position
   * @param params Parameters for increasing liquidity
   * @returns Transaction result with liquidity, amount0, and amount1
   */
  async increaseLiquidity(params: IncreaseLiquidityParams): Promise<{
    liquidity: string;
    amount0: string;
    amount1: string;
  }> {
    if (!this.signer) {
      throw new Error('Signer is required for increasing liquidity');
    }

    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    // Set default deadline if not provided
    const deadline = params.deadline || Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {
      // Get position details to check if one of the tokens is WEDU
      const position = await nftPositionManager.positions(params.tokenId);
      const isToken0Native = position.token0.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
      const isToken1Native = position.token1.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
      const useNative = isToken0Native || isToken1Native;
      
      // Get signer address for recipient
      const signerAddress = await this.signer.getAddress();
      
      const increaseLiquidityParams = {
        tokenId: params.tokenId,
        amount0Desired: params.amount0Desired,
        amount1Desired: params.amount1Desired,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        deadline
      };
      
      // Determine value to send with transaction if using native EDU
      const value = useNative 
        ? (isToken0Native 
            ? params.amount0Desired 
            : isToken1Native 
              ? params.amount1Desired 
              : 0)
        : 0;
      
      // Use multicall for better handling of native EDU
      const multicallData = [];
      
      // Add increaseLiquidity call to multicall
      multicallData.push(
        nftPositionManager.interface.encodeFunctionData("increaseLiquidity", [increaseLiquidityParams])
      );
      
      // Add refundETH call to multicall to handle any leftover ETH
      if (useNative) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("refundETH", [])
        );
      }
      
      // Execute multicall
      const tx = await nftPositionManager.multicall(multicallData, { value });
      const receipt = await tx.wait();

      // Parse the event logs to get the result
      const events = receipt.logs.map((log: any) => {
        try {
          return nftPositionManager.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      const increaseLiquidityEvent = events.find((event: any) => event.name === 'IncreaseLiquidity');
      
      // Create result object with transaction hash
      const result: any = {
        transactionHash: receipt.hash
      };
      
      // Add data from events if available
      if (increaseLiquidityEvent) {
        if (increaseLiquidityEvent.args.liquidity) {
          result.liquidity = increaseLiquidityEvent.args.liquidity.toString();
        }
        if (increaseLiquidityEvent.args.amount0) {
          result.amount0 = increaseLiquidityEvent.args.amount0.toString();
        }
        if (increaseLiquidityEvent.args.amount1) {
          result.amount1 = increaseLiquidityEvent.args.amount1.toString();
        }
      }
      
      if (!increaseLiquidityEvent) {
        console.warn('Could not parse IncreaseLiquidity event from transaction logs. Returning partial data.');
        console.log('Events:', events);
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Failed to increase liquidity: ${error.message}`);
    }
  }

  /**
   * Decrease liquidity in an existing position
   * @param params Parameters for decreasing liquidity
   * @returns Transaction result with amount0 and amount1
   */
  async decreaseLiquidity(params: DecreaseLiquidityParams): Promise<{
    amount0: string;
    amount1: string;
  }> {
    if (!this.signer) {
      throw new Error('Signer is required for decreasing liquidity');
    }

    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    // Set default deadline if not provided
    const deadline = params.deadline || Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {
      // Get position details to check if one of the tokens is WEDU
      const position = await nftPositionManager.positions(params.tokenId);
      const isToken0Native = position.token0.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
      const isToken1Native = position.token1.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
      const useNative = isToken0Native || isToken1Native;
      
      // Get signer address for recipient
      const signerAddress = await this.signer.getAddress();
      
      // If percentageToRemove is provided, calculate the liquidity to remove
      let liquidity = params.liquidity;
      if (params.percentageToRemove) {
        liquidity = new BigNumber(position.liquidity.toString())
          .times(params.percentageToRemove)
          .toFixed(0);
      }

      const decreaseLiquidityParams = {
        tokenId: params.tokenId,
        liquidity,
        amount0Min: params.amount0Min,
        amount1Min: params.amount1Min,
        deadline
      };
      
      // Use multicall for better handling of native EDU
      const multicallData = [];
      
      // Add decreaseLiquidity call to multicall
      multicallData.push(
        nftPositionManager.interface.encodeFunctionData("decreaseLiquidity", [decreaseLiquidityParams])
      );
      
      // Add collect call to multicall to collect the tokens
      const collectParams = {
        tokenId: params.tokenId,
        recipient: useNative ? await nftPositionManager.getAddress() : signerAddress,
        amount0Max: MAX_INT128.toString(),
        amount1Max: MAX_INT128.toString()
      };
      
      multicallData.push(
        nftPositionManager.interface.encodeFunctionData("collect", [collectParams])
      );
      
      // If one of the tokens is WEDU, add unwrapWETH9 to unwrap the native EDU
      if (useNative) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("unwrapWETH9", [
            0, // amountMinimum (0 to unwrap all)
            signerAddress // recipient
          ])
        );
      }
      
      // If token0 is not WEDU, add sweepToken to collect token0
      if (!isToken0Native) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("sweepToken", [
            position.token0,
            0, // amountMinimum (0 to sweep all)
            signerAddress // recipient
          ])
        );
      }
      
      // If token1 is not WEDU, add sweepToken to collect token1
      if (!isToken1Native) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("sweepToken", [
            position.token1,
            0, // amountMinimum (0 to sweep all)
            signerAddress // recipient
          ])
        );
      }
      
      // Add refundETH call to multicall to handle any leftover ETH
      multicallData.push(
        nftPositionManager.interface.encodeFunctionData("refundETH", [])
      );
      
      // If we're removing 100% of the liquidity, add burn call to multicall
      if (params.percentageToRemove === 1) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("burn", [params.tokenId])
        );
      }
      
      // Execute multicall
      const tx = await nftPositionManager.multicall(multicallData);
      const receipt = await tx.wait();

      // Parse the event logs to get the result
      const events = receipt.logs.map((log: any) => {
        try {
          return nftPositionManager.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      const decreaseLiquidityEvent = events.find((event: any) => event.name === 'DecreaseLiquidity');
      
      // Create result object with transaction hash
      const result: any = {
        transactionHash: receipt.hash
      };
      
      // Add data from events if available
      if (decreaseLiquidityEvent) {
        if (decreaseLiquidityEvent.args.amount0) {
          result.amount0 = decreaseLiquidityEvent.args.amount0.toString();
        }
        if (decreaseLiquidityEvent.args.amount1) {
          result.amount1 = decreaseLiquidityEvent.args.amount1.toString();
        }
      }
      
      if (!decreaseLiquidityEvent) {
        console.warn('Could not parse DecreaseLiquidity event from transaction logs. Returning partial data.');
        console.log('Events:', events);
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Failed to decrease liquidity: ${error.message}`);
    }
  }

  /**
   * Collect fees from a position
   * @param params Parameters for collecting fees
   * @returns Transaction result with amount0 and amount1
   */
  async collectFees(params: CollectFeesParams): Promise<{
    amount0: string;
    amount1: string;
  }> {
    if (!this.signer) {
      throw new Error('Signer is required for collecting fees');
    }

    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    try {
      const collectParams = {
        tokenId: params.tokenId,
        recipient: params.recipient,
        amount0Max: params.amount0Max || MAX_INT128.toString(),
        amount1Max: params.amount1Max || MAX_INT128.toString()
      };

      const tx = await nftPositionManager.collect(collectParams);
      const receipt = await tx.wait();

      // Parse the event logs to get the result
      const events = receipt.logs.map((log: any) => {
        try {
          return nftPositionManager.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      const collectEvent = events.find((event: any) => event.name === 'Collect');
      
      // Create result object with transaction hash
      const result: any = {
        transactionHash: receipt.hash
      };
      
      // Add data from events if available
      if (collectEvent) {
        if (collectEvent.args.amount0) {
          result.amount0 = collectEvent.args.amount0.toString();
        }
        if (collectEvent.args.amount1) {
          result.amount1 = collectEvent.args.amount1.toString();
        }
      }
      
      if (!collectEvent) {
        console.warn('Could not parse Collect event from transaction logs. Returning partial data.');
        console.log('Events:', events);
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Failed to collect fees: ${error.message}`);
    }
  }

  /**
   * Burn a position NFT
   * @param tokenId The ID of the position token to burn
   * @returns Transaction receipt
   */
  async burnPosition(tokenId: string): Promise<ethers.TransactionReceipt> {
    if (!this.signer) {
      throw new Error('Signer is required for burning a position');
    }

    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    try {
      const tx = await nftPositionManager.burn(tokenId);
      return await tx.wait();
    } catch (error: any) {
      throw new Error(`Failed to burn position: ${error.message}`);
    }
  }

  /**
   * Get all positions for an address
   * @param address The address to get positions for
   * @returns Array of positions
   */
  async getPositions(address: string): Promise<PoolPosition[]> {
    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.provider
    );

    const factory = new Contract(
      this.uniswapV3FactoryAddress,
      this.uniswapV3FactoryAbi,
      this.provider
    );

    try {
      // Get number of positions
      const balance = await nftPositionManager.balanceOf(address);

      // Get all position IDs
      const positionIds = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftPositionManager.tokenOfOwnerByIndex(address, i);
        positionIds.push(tokenId);
      }

      // Get details for each position
      const positions = await Promise.all(
        positionIds.map(async (tokenId) => {
          const position = await nftPositionManager.positions(tokenId);
          const poolAddress = await factory.getPool(
            position.token0,
            position.token1,
            position.fee
          );
          
          const poolContract = new Contract(
            poolAddress,
            IUniswapV3PoolABI.abi,
            this.provider
          );

          const token0Contract = new Contract(position.token0, this.erc20Abi, this.provider);
          const token1Contract = new Contract(position.token1, this.erc20Abi, this.provider);

          const [token0Decimals, token0Symbol, token0Name] = await Promise.all([
            token0Contract.decimals(),
            token0Contract.symbol(),
            token0Contract.name()
          ]);

          const [token1Decimals, token1Symbol, token1Name] = await Promise.all([
            token1Contract.decimals(),
            token1Contract.symbol(),
            token1Contract.name()
          ]);

          const token0: SdkToken = {
            address: position.token0,
            symbol: token0Symbol,
            name: token0Name,
            decimals: Number(token0Decimals)
          };

          const token1: SdkToken = {
            address: position.token1,
            symbol: token1Symbol,
            name: token1Name,
            decimals: Number(token1Decimals)
          };

          // Get unclaimed fees
          const { amount0: unclaimedFee0, amount1: unclaimedFee1 } = await nftPositionManager.collect.staticCall({
            tokenId,
            recipient: address,
            amount0Max: MAX_INT128.toString(),
            amount1Max: MAX_INT128.toString()
          });

          // Get pool state
          const { tick: currentTick, sqrtPriceX96 } = await poolContract.slot0();
          const liquidity = await poolContract.liquidity();

          // Create SDK Pool instance
          const sdkToken0 = new Token(
            this.chainId,
            position.token0,
            Number(token0Decimals),
            token0Symbol,
            token0Name
          );

          const sdkToken1 = new Token(
            this.chainId,
            position.token1,
            Number(token1Decimals),
            token1Symbol,
            token1Name
          );

          const pool = new Pool(
            sdkToken0,
            sdkToken1,
            Number(position.fee),
            sqrtPriceX96.toString(),
            liquidity.toString(),
            Number(currentTick)
          );

          // Create Position instance
          const sdkPosition = new Position({
            pool,
            liquidity: position.liquidity.toString(),
            tickLower: Number(position.tickLower),
            tickUpper: Number(position.tickUpper)
          });

          // Calculate price
          const price = this.sqrtPriceX96ToPrice(
            sqrtPriceX96.toString(),
            Number(token0Decimals),
            Number(token1Decimals)
          );

          // Check if position is in range
          const isInRange = currentTick >= position.tickLower && currentTick < position.tickUpper;

          // Calculate position value and APR (simplified)
          const amount0 = formatUnits(sdkPosition.amount0.quotient.toString(), token0Decimals);
          const amount1 = formatUnits(sdkPosition.amount1.quotient.toString(), token1Decimals);
          
          // This is a simplified calculation; in a real implementation, you would need to get token prices
          const positionValue = "0"; // Placeholder
          const apr = "0"; // Placeholder

          return {
            poolAddress,
            tokenId: tokenId.toString(),
            token0,
            token1,
            fee: position.fee.toString(),
            tickLower: position.tickLower.toString(),
            tickUpper: position.tickUpper.toString(),
            liquidity: position.liquidity.toString(),
            amount0,
            amount1,
            tokensOwed0: formatUnits(position.tokensOwed0.toString(), token0Decimals),
            tokensOwed1: formatUnits(position.tokensOwed1.toString(), token1Decimals),
            isBelowPrice1: currentTick < position.tickLower,
            isAbovePrice1: currentTick > position.tickUpper,
            isInRange,
            tickCurrent: currentTick.toString(),
            currentPrice: price.toString(),
            sqrtPriceX96: sqrtPriceX96.toString(),
            feeGrowthInside0LastX128: position.feeGrowthInside0LastX128.toString(),
            feeGrowthInside1LastX128: position.feeGrowthInside1LastX128.toString(),
            feesEarned0: formatUnits(unclaimedFee0.toString(), token0Decimals),
            feesEarned1: formatUnits(unclaimedFee1.toString(), token1Decimals),
            totalValueLocked: positionValue,
            positionValue,
            apr,
            createdAt: new Date().toISOString(), // Placeholder; in a real implementation, you would get this from events
            nftPositionManagerId: this.nftPositionManagerAddress,
            owner: address
          };
        })
      );

      return positions;
    } catch (error: any) {
      throw new Error(`Failed to get positions: ${error.message}`);
    }
  }

  /**
   * Get portfolio summary for an address
   * @param address The address to get portfolio for
   * @returns Portfolio summary
   */
  async getPortfolio(address: string): Promise<PoolPortfolio> {
    try {
      const positions = await this.getPositions(address);

      // Calculate portfolio summary
      const totalValueLocked = positions.reduce(
        (sum, position) => sum + parseFloat(position.totalValueLocked),
        0
      ).toString();

      const totalFees = positions.reduce(
        (sum, position) => 
          sum + 
          parseFloat(position.feesEarned0) + 
          parseFloat(position.feesEarned1),
        0
      ).toString();

      const totalPositions = positions.length;
      
      const totalFeesEarned0 = positions.reduce(
        (sum, position) => sum + parseFloat(position.feesEarned0),
        0
      ).toString();
      
      const totalFeesEarned1 = positions.reduce(
        (sum, position) => sum + parseFloat(position.feesEarned1),
        0
      ).toString();
      
      const totalPositionsInRange = positions.filter(
        position => position.isInRange
      ).length;
      
      const totalPositionsOutOfRange = positions.filter(
        position => !position.isInRange
      ).length;
      
      // Calculate weighted average APR
      const totalApr = positions.length > 0
        ? (positions.reduce(
            (sum, position) => sum + parseFloat(position.apr) * parseFloat(position.positionValue),
            0
          ) / parseFloat(totalValueLocked)).toString()
        : "0";

      return {
        positions,
        totalValueLocked,
        totalFees,
        totalPositions,
        totalFeesEarned0,
        totalFeesEarned1,
        totalPositionsInRange,
        totalPositionsOutOfRange,
        totalApr
      };
    } catch (error: any) {
      throw new Error(`Failed to get portfolio: ${error.message}`);
    }
  }

  // getTokenUSDValue function removed

  /**
   * Get pool statistics
   * @param poolAddress The address of the pool
   * @returns Pool statistics
   */
  async getPoolStats(poolAddress: string): Promise<PoolStats> {
    try {
      const poolInfo = await this.getPoolInfo(poolAddress);
      
      const token0Contract = new Contract(poolInfo.token0, this.erc20Abi, this.provider);
      const token1Contract = new Contract(poolInfo.token1, this.erc20Abi, this.provider);
      
      const [token0Decimals, token0Symbol, token0Name] = await Promise.all([
        token0Contract.decimals(),
        token0Contract.symbol(),
        token0Contract.name()
      ]);
      
      const [token1Decimals, token1Symbol, token1Name] = await Promise.all([
        token1Contract.decimals(),
        token1Contract.symbol(),
        token1Contract.name()
      ]);
      
      const token0: SdkToken = {
        address: poolInfo.token0,
        symbol: token0Symbol,
        name: token0Name,
        decimals: Number(token0Decimals)
      };
      
      const token1: SdkToken = {
        address: poolInfo.token1,
        symbol: token1Symbol,
        name: token1Name,
        decimals: Number(token1Decimals)
      };
      
      // Calculate token prices
      const sqrtPriceX96 = poolInfo.sqrtPriceX96.toString();
      const token0Price = this.sqrtPriceX96ToPrice(
        sqrtPriceX96,
        Number(token0Decimals),
        Number(token1Decimals)
      );
      
      const token1Price = (1 / parseFloat(token0Price)).toString();
      
      // These would typically come from a subgraph or other data source
      // Placeholders for demonstration
      const volume24h = "0";
      const volume7d = "0";
      const fees24h = "0";
      const fees7d = "0";
      const tvl = "0";
      const apr = "0";
      const priceChange24h = "0";
      
      return {
        poolAddress,
        token0,
        token1,
        fee: poolInfo.fee,
        liquidity: poolInfo.liquidity.toString(),
        volume24h,
        volume7d,
        fees24h,
        fees7d,
        tvl,
        apr,
        priceChange24h,
        token0Price,
        token1Price,
        tick: poolInfo.tick
      };
    } catch (error: any) {
      throw new Error(`Failed to get pool stats: ${error.message}`);
    }
  }

  /**
   * Calculate price from sqrtPriceX96
   * @param sqrtPriceX96 The sqrt price X96
   * @param token0Decimals Decimals of token0
   * @param token1Decimals Decimals of token1
   * @returns The price
   */
  private sqrtPriceX96ToPrice(
    sqrtPriceX96: string,
    token0Decimals: number,
    token1Decimals: number
  ): string {
    // Convert to BigNumber for calculation
    const sqrtPriceX96BN = new BigNumber(sqrtPriceX96);
    const Q96 = new BigNumber(2).pow(96);
    
    // Calculate price = (sqrtPriceX96 / 2^96)^2 * 10^(token0Decimals - token1Decimals)
    const price = sqrtPriceX96BN.div(Q96).pow(2)
      .times(new BigNumber(10).pow(token0Decimals - token1Decimals));
    
    return price.toString();
  }

  /**
   * Approve token for spending
   * @param tokenAddress The address of the token to approve
   * @param amount The amount to approve
   * @returns Transaction receipt
   */
  private async approveToken(
    tokenAddress: string,
    amount: string
  ): Promise<ethers.TransactionReceipt> {
    if (!this.signer) {
      throw new Error('Signer is required for approving tokens');
    }

    const tokenContract = new Contract(
      tokenAddress,
      this.erc20Abi,
      this.signer
    );

    const signerAddress = await this.signer.getAddress();
    const allowance = await tokenContract.allowance(
      signerAddress,
      this.nftPositionManagerAddress
    );

    if (BigNumber(allowance.toString()).lt(amount)) {
      const tx = await tokenContract.approve(
        this.nftPositionManagerAddress,
        ethers.MaxUint256 // Approve maximum amount
      );
      return await tx.wait();
    }

    // Already approved
    return {} as ethers.TransactionReceipt;
  }

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
  async deployLiquidity(
    token0: string,
    token1: string,
    fee: number,
    amount0: string,
    amount1: string,
    recipient: string,
    tickLower: number = -887220, // Full range by default
    tickUpper: number = 887220    // Full range by default
  ): Promise<{
    tokenId: string;
    liquidity: string;
    amount0: string;
    amount1: string;
  }> {
    if (!this.signer) {
      throw new Error('Signer is required for deploying liquidity');
    }

    // Sort tokens if needed
    let sortedToken0 = token0;
    let sortedToken1 = token1;
    let sortedAmount0 = amount0;
    let sortedAmount1 = amount1;

    if (BigNumber(token0).gt(token1)) {
      sortedToken0 = token1;
      sortedToken1 = token0;
      sortedAmount0 = amount1;
      sortedAmount1 = amount0;
    }

    // Calculate sqrtPriceX96 based on token amounts and decimals
    const token0Contract = new Contract(sortedToken0, this.erc20Abi, this.provider);
    const token1Contract = new Contract(sortedToken1, this.erc20Abi, this.provider);
    
    const token0Decimals = await token0Contract.decimals();
    const token1Decimals = await token1Contract.decimals();

    // Adjust amounts for decimals
    const adjustedAmount0 = new BigNumber(sortedAmount0).times(new BigNumber(10).pow(token0Decimals));
    const adjustedAmount1 = new BigNumber(sortedAmount1).times(new BigNumber(10).pow(token1Decimals));

    // Calculate sqrtPriceX96
    const sqrtPriceX96 = this.encodePriceSqrt(adjustedAmount1.toString(), adjustedAmount0.toString());

    // Initialize pool if it doesn't exist
    const nftPositionManager = new Contract(
      this.nftPositionManagerAddress,
      this.nftPositionManagerAbi,
      this.signer
    );

    // Check if pool exists
    const factory = new Contract(
      this.uniswapV3FactoryAddress,
      this.uniswapV3FactoryAbi,
      this.provider
    );
    
    const poolAddress = await factory.getPool(sortedToken0, sortedToken1, fee);
    
    if (poolAddress === ethers.ZeroAddress) {
      // Pool doesn't exist, create it
      await nftPositionManager.createAndInitializePoolIfNecessary(
        sortedToken0,
        sortedToken1,
        fee,
        sqrtPriceX96
      );
    }

    // Add liquidity
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    
    const mintParams = {
      token0: sortedToken0,
      token1: sortedToken1,
      fee: fee,
      tickLower: tickLower,
      tickUpper: tickUpper,
      amount0Desired: sortedAmount0,
      amount1Desired: sortedAmount1,
      amount0Min: 0,
      amount1Min: 0,
      recipient: recipient,
      deadline
    };

    // Check if one of the tokens is WEDU (native EDU)
    const isToken0Native = sortedToken0.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
    const isToken1Native = sortedToken1.toLowerCase() === this.nativeWrappedTokenAddress.toLowerCase();
    const useNative = isToken0Native || isToken1Native;
    
    // Determine value to send with transaction if using native EDU
    const value = isToken0Native 
      ? sortedAmount0 
      : isToken1Native 
        ? sortedAmount1 
        : 0;

    try {
      // Use multicall for better handling of native EDU
      const multicallData = [];
      
      // Add mint call to multicall
      multicallData.push(
        nftPositionManager.interface.encodeFunctionData("mint", [mintParams])
      );
      
      // Add refundETH call to multicall to handle any leftover ETH
      if (useNative) {
        multicallData.push(
          nftPositionManager.interface.encodeFunctionData("refundETH", [])
        );
      }
      
      // Execute multicall
      const tx = await nftPositionManager.multicall(multicallData, { value });
      const receipt = await tx.wait();

      // Parse the event logs to get the result
      const events = receipt.logs.map((log: any) => {
        try {
          return nftPositionManager.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      // When deploying liquidity, two events are emitted:
      // 1. Transfer event for the NFT creation
      // 2. IncreaseLiquidity event for the liquidity addition
      const transferEvent = events.find((event: any) => event.name === 'Transfer');
      const increaseLiquidityEvent = events.find((event: any) => event.name === 'IncreaseLiquidity');
      
      // Create result object with transaction hash
      const result: any = {
        transactionHash: receipt.hash
      };
      
      // Add data from events if available
      if (transferEvent && transferEvent.args.tokenId) {
        result.tokenId = transferEvent.args.tokenId.toString();
      } else if (increaseLiquidityEvent && increaseLiquidityEvent.args.tokenId) {
        result.tokenId = increaseLiquidityEvent.args.tokenId.toString();
      }
      
      if (increaseLiquidityEvent) {
        if (increaseLiquidityEvent.args.liquidity) {
          result.liquidity = increaseLiquidityEvent.args.liquidity.toString();
        }
        if (increaseLiquidityEvent.args.amount0) {
          result.amount0 = increaseLiquidityEvent.args.amount0.toString();
        }
        if (increaseLiquidityEvent.args.amount1) {
          result.amount1 = increaseLiquidityEvent.args.amount1.toString();
        }
      }
      
      if (!transferEvent || !increaseLiquidityEvent) {
        console.warn('Could not parse all events from transaction logs. Returning partial data.');
        console.log('Events:', events);
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Failed to deploy liquidity: ${error.message}`);
    }
  }

  /**
   * Encode price sqrt for pool initialization
   * @param reserve1 Reserve of token1
   * @param reserve0 Reserve of token0
   * @returns Encoded sqrt price
   */
  private encodePriceSqrt(reserve1: string, reserve0: string): string {
    return new BigNumber(reserve1)
      .div(reserve0)
      .sqrt()
      .multipliedBy(new BigNumber(2).pow(96))
      .integerValue(3)
      .toString();
  }

  /**
   * Calculate price range from base price
   * @param sqrtPriceX96 The sqrt price X96
   * @param feeTier The fee tier
   * @param token0Decimals Decimals of token0
   * @param token1Decimals Decimals of token1
   * @param rangeType The range type (NARROW, COMMON, WIDE, INFINITE)
   * @returns The price range
   */
  calculatePriceRange(
    sqrtPriceX96: string,
    feeTier: number,
    token0Decimals: number,
    token1Decimals: number,
    rangeType: RangeType
  ): PriceRange {
    // Define range presets
    const RANGES = {
      NARROW: 0.05, // ±5%
      COMMON: 0.1, // ±10%
      WIDE: 0.2, // ±20%
      INFINITE: null, // Full range
    };

    // Get current tick from sqrt price
    const currentTick = TickMath.getTickAtSqrtRatio(JSBI.BigInt(sqrtPriceX96));

    // Handle infinite range
    if (rangeType === "INFINITE") {
      const minTick = TickMath.MIN_TICK;
      const maxTick = TickMath.MAX_TICK;

      const minSqrtPriceX96 = TickMath.getSqrtRatioAtTick(minTick);
      const maxSqrtPriceX96 = TickMath.getSqrtRatioAtTick(maxTick);

      const minPrice = this.sqrtPriceX96ToPrice(
        minSqrtPriceX96.toString(),
        token0Decimals,
        token1Decimals
      );
      
      const maxPrice = this.sqrtPriceX96ToPrice(
        maxSqrtPriceX96.toString(),
        token0Decimals,
        token1Decimals
      );

      return {
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        tickLower: minTick,
        tickUpper: maxTick,
        minSqrtPriceX96: minSqrtPriceX96.toString(),
        maxSqrtPriceX96: maxSqrtPriceX96.toString(),
      };
    }

    // Get percentage range based on type
    const percentRange = RANGES[rangeType];
    if (percentRange === undefined) {
      throw new Error(
        "Invalid range type. Use NARROW, COMMON, WIDE, or INFINITE"
      );
    }

    // Calculate tick range
    // Multiply by tickSpacing to ensure valid ticks
    const tickSpacing = FEE_TO_TICKSPACING[feeTier];
    const tickRange = Math.floor(percentRange * 100);

    const minTick =
      Math.ceil((currentTick - tickRange) / tickSpacing) * tickSpacing;
    const maxTick =
      Math.floor((currentTick + tickRange) / tickSpacing) * tickSpacing;

    // Ensure ticks are within bounds
    const boundedMinTick = Math.max(minTick, TickMath.MIN_TICK);
    const boundedMaxTick = Math.min(maxTick, TickMath.MAX_TICK);

    // Convert ticks back to sqrtPriceX96
    const minSqrtPriceX96 = TickMath.getSqrtRatioAtTick(boundedMinTick);
    const maxSqrtPriceX96 = TickMath.getSqrtRatioAtTick(boundedMaxTick);

    // Convert to actual prices
    const minPrice = parseFloat(this.sqrtPriceX96ToPrice(
      minSqrtPriceX96.toString(),
      token0Decimals,
      token1Decimals
    ));
    
    const maxPrice = parseFloat(this.sqrtPriceX96ToPrice(
      maxSqrtPriceX96.toString(),
      token0Decimals,
      token1Decimals
    ));

    return {
      minPrice,
      maxPrice,
      tickLower: boundedMinTick,
      tickUpper: boundedMaxTick,
      minSqrtPriceX96: minSqrtPriceX96.toString(),
      maxSqrtPriceX96: maxSqrtPriceX96.toString(),
    };
  }
}
