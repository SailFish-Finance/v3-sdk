import { ethers, Signer, Provider } from 'ethers';
import BigNumber from 'bignumber.js';
import { 
  ADDRESSES, 
  ROUTER_ABI, 
  ERC20_ABI 
} from './constants';
import { 
  ExactInputParams, 
  ExactInputSingleParams, 
  ExactOutputParams, 
  ExactOutputSingleParams,
  SwapOptions,
  TradeType
} from './types';

/**
 * SailFish Router class for executing swaps
 */
export class Router {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private routerContract: ethers.Contract;

  /**
   * Create a new Router instance
   * @param providerOrSigner An ethers Provider or Signer
   */
  constructor(providerOrSigner: Provider | Signer) {
    if ('provider' in providerOrSigner && typeof providerOrSigner.provider !== 'undefined') {
      // It's a signer
      this.signer = providerOrSigner as Signer;
      this.provider = (providerOrSigner as Signer).provider as Provider;
    } else {
      // It's a provider
      this.provider = providerOrSigner as Provider;
    }

    this.routerContract = new ethers.Contract(
      ADDRESSES.SWAP_ROUTER,
      ROUTER_ABI,
      this.signer || this.provider
    );
  }

  /**
   * Check if the router has a signer
   * @returns True if the router has a signer
   */
  private hasSigner(): boolean {
    if (!this.signer) {
      throw new Error('This operation requires a signer');
    }
    return true;
  }

  /**
   * Approve a token for spending by the router
   * @param tokenAddress Token address
   * @param amount Amount to approve
   * @returns Transaction response
   */
  public async approveToken(
    tokenAddress: string,
    amount: ethers.BigNumberish
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      this.signer
    );
    
    return tokenContract.approve(ADDRESSES.SWAP_ROUTER, amount);
  }

  /**
   * Check if a token is approved for spending by the router
   * @param tokenAddress Token address
   * @param amount Amount to check
   * @returns True if the token is approved for the amount
   */
  public async isTokenApproved(
    tokenAddress: string,
    amount: ethers.BigNumberish
  ): Promise<boolean> {
    this.hasSigner();
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      this.provider
    );
    
    const signerAddress = await this.signer!.getAddress();
    const allowance = await tokenContract.allowance(signerAddress, ADDRESSES.SWAP_ROUTER);
    
    return ethers.getBigInt(allowance) >= ethers.getBigInt(amount);
  }

  /**
   * Execute an exact input swap (swap a fixed amount of input token for as much output token as possible)
   * @param params Swap parameters
   * @returns Transaction response
   */
  public async exactInputSingle(
    params: ExactInputSingleParams
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    const value = params.tokenIn.toLowerCase() === ADDRESSES.WEDU.toLowerCase() 
      ? params.amountIn 
      : 0;
    
    return this.routerContract.exactInputSingle(params, { value });
  }

  /**
   * Execute an exact output swap (swap as little input token as possible for a fixed amount of output token)
   * @param params Swap parameters
   * @returns Transaction response
   */
  public async exactOutputSingle(
    params: ExactOutputSingleParams
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    const value = params.tokenIn.toLowerCase() === ADDRESSES.WEDU.toLowerCase() 
      ? params.amountInMaximum 
      : 0;
    
    return this.routerContract.exactOutputSingle(params, { value });
  }

  /**
   * Execute a multi-hop exact input swap
   * @param params Swap parameters
   * @returns Transaction response
   */
  public async exactInput(
    params: ExactInputParams
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    // Check if the first token in the path is WEDU
    const isFirstTokenWETH = params.path.startsWith(ADDRESSES.WEDU.toLowerCase().slice(2));
    const value = isFirstTokenWETH ? params.amountIn : 0;
    
    return this.routerContract.exactInput(params, { value });
  }

  /**
   * Execute a multi-hop exact output swap
   * @param params Swap parameters
   * @returns Transaction response
   */
  public async exactOutput(
    params: ExactOutputParams
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    // Check if the last token in the path is WEDU (path is reversed for exactOutput)
    const isLastTokenWETH = params.path.endsWith(ADDRESSES.WEDU.toLowerCase().slice(2));
    const value = isLastTokenWETH ? params.amountInMaximum : 0;
    
    return this.routerContract.exactOutput(params, { value });
  }

  /**
   * Execute a swap with multiple calls in a single transaction
   * @param calls Array of encoded function calls
   * @param value ETH value to send with the transaction
   * @returns Transaction response
   */
  public async multicall(
    calls: string[],
    value: ethers.BigNumberish = 0
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    return this.routerContract.multicall(calls, { value });
  }

  /**
   * Unwrap WEDU to native ETH
   * @param amountMinimum Minimum amount to unwrap
   * @param recipient Recipient address
   * @returns Transaction response
   */
  public async unwrapWETH9(
    amountMinimum: ethers.BigNumberish,
    recipient: string
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    return this.routerContract.unwrapWETH9(amountMinimum, recipient);
  }

  /**
   * Refund any ETH left from a swap
   * @returns Transaction response
   */
  public async refundETH(): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    return this.routerContract.refundETH();
  }

  /**
   * Sweep any tokens left from a swap
   * @param token Token address
   * @param amountMinimum Minimum amount to sweep
   * @param recipient Recipient address
   * @returns Transaction response
   */
  public async sweepToken(
    token: string,
    amountMinimum: ethers.BigNumberish,
    recipient: string
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();
    
    return this.routerContract.sweepToken(token, amountMinimum, recipient);
  }

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
  public async createSwapTransaction(
    tokenIn: string,
    tokenOut: string,
    fee: number,
    amountIn: ethers.BigNumberish,
    amountOut: ethers.BigNumberish,
    tradeType: TradeType,
    options: SwapOptions = {}
  ): Promise<ExactInputSingleParams | ExactOutputSingleParams> {
    const recipient = options.recipient || (this.signer ? await this.signer.getAddress() : '');
    const deadline = options.deadline || Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const slippagePercentage = options.slippagePercentage || 0.5; // 0.5% default slippage
    
    // Calculate slippage-adjusted amounts
    const slippageFactor = new BigNumber(1).minus(new BigNumber(slippagePercentage).div(100));
    
    if (tradeType === TradeType.EXACT_INPUT) {
      const amountOutMinimum = new BigNumber(amountOut.toString()).times(slippageFactor).toFixed(0);
      
      return {
        tokenIn,
        tokenOut,
        fee,
        recipient,
        deadline,
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96: 0
      };
    } else {
      const amountInMaximum = new BigNumber(amountIn.toString()).div(slippageFactor).toFixed(0);
      
      return {
        tokenIn,
        tokenOut,
        fee,
        recipient,
        deadline,
        amountOut,
        amountInMaximum,
        sqrtPriceLimitX96: 0
      };
    }
  }

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
  public async createMultihopSwapTransaction(
    tokenIn: string,
    intermediaryToken: string,
    tokenOut: string,
    feeTier1: number,
    feeTier2: number,
    amountIn: ethers.BigNumberish,
    amountOut: ethers.BigNumberish,
    tradeType: TradeType,
    options: SwapOptions = {}
  ): Promise<ExactInputParams | ExactOutputParams> {
    const recipient = options.recipient || (this.signer ? await this.signer.getAddress() : '');
    const deadline = options.deadline || Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const slippagePercentage = options.slippagePercentage || 0.5; // 0.5% default slippage
    
    // Calculate slippage-adjusted amounts
    const slippageFactor = new BigNumber(1).minus(new BigNumber(slippagePercentage).div(100));
    
    // Create the path by encoding the tokens and fees
    let path: string;
    
    if (tradeType === TradeType.EXACT_INPUT) {
      // For exact input, the path is tokenIn -> intermediaryToken -> tokenOut
      path = ethers.solidityPacked(
        ['address', 'uint24', 'address', 'uint24', 'address'],
        [
          tokenIn,
          feeTier1,
          intermediaryToken,
          feeTier2,
          tokenOut
        ]
      );
      
      const amountOutMinimum = new BigNumber(amountOut.toString()).times(slippageFactor).toFixed(0);
      
      return {
        path,
        recipient,
        deadline,
        amountIn,
        amountOutMinimum
      };
    } else {
      // For exact output, the path is tokenOut -> intermediaryToken -> tokenIn (reversed)
      path = ethers.solidityPacked(
        ['address', 'uint24', 'address', 'uint24', 'address'],
        [
          tokenOut,
          feeTier2,
          intermediaryToken,
          feeTier1,
          tokenIn
        ]
      );
      
      const amountInMaximum = new BigNumber(amountIn.toString()).div(slippageFactor).toFixed(0);
      
      return {
        path,
        recipient,
        deadline,
        amountOut,
        amountInMaximum
      };
    }
  }
}
