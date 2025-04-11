# SailFish DEX v3 SDK

![SailfishDef](https://github.com/user-attachments/assets/351ccdb5-0c1d-4658-a2a0-3fe3f8278022)

A TypeScript SDK for interacting with SailFish DEX v3 on EDUCHAIN. This SDK provides functionality for finding swap routes, getting quotes, and executing swaps.

## Installation

```bash
npm install @sailfishdex/v3-sdk
```

## Features

- **Route Finding**: Find the best route for a swap pair, whether direct or multi-hop
- **Quote Generation**: Get accurate quotes with execution price and price impact
- **Fee Information**: Get fee tier and pool address information with each quote
- **Swap Execution**: Execute swaps with slippage protection
- **Multi-hop Support**: Full support for multi-hop routes
- **Token Approval**: Methods for checking and approving token allowances
- **Token Bridging**: Bridge EDU tokens between BSC, Arbitrum, and EDUCHAIN
- **UI Components**: Ready-to-use React components for token bridging
- **Liquidity Pool Management**: Comprehensive tools for managing liquidity pools
  - Initialize new pools
  - Add, increase, and decrease liquidity
  - Collect fees from positions
  - View detailed portfolio information
  - Calculate price ranges for different strategies

## Usage

### Importing the SDK

```javascript
const { Quoter, Router, TradeType } = require('@sailfishdex/v3-sdk');
// or using ES modules
import { Quoter, Router, TradeType } from '@sailfishdex/v3-sdk';
```

### Initializing

```javascript
const { ethers } = require("ethers");

// Initialize provider
const provider = new ethers.JsonRpcProvider(
  "https://rpc.edu-chain.raas.gelato.cloud"
);

// Initialize Quoter (for finding routes and getting quotes)
const quoter = new Quoter(provider);

// Initialize Router (for executing swaps)
// For read-only operations, you can pass the provider
const readOnlyRouter = new Router(provider);

// For transactions, you need a signer
const signer = new ethers.Wallet(privateKey, provider);
const router = new Router(signer);
```

### Finding Routes

```javascript
// Token addresses
const WEDU = "0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12";
const USDC = "0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342";

// Get the best route
const routes = await quoter.getBestRoute(WEDU, USDC);

console.log("Found routes:", routes.routes.length);
console.log("Best route type:", routes.routes[0].type);
console.log(
  "Best route path:",
  routes.routes[0].path.map((p) => p.id)
);
```

### Getting Quotes

```javascript
// Get a quote for swapping 1 WEDU to USDC
const quote = await quoter.getQuote(
  WEDU,
  USDC,
  "1.0", // amountIn
  "0", // amountOut (not used for EXACT_INPUT)
  TradeType.EXACT_INPUT
);

console.log("Quote result:");
console.log("- Amount in:", quote.amountIn, "WEDU");
console.log("- Amount out:", quote.amountOut, "USDC");
console.log("- Execution price: 1 WEDU =", quote.executionPrice, "USDC");
console.log("- Price impact:", quote.priceImpact, "%");
console.log("- Fee tier:", quote.feeTier / 10000, "%");
console.log("- Pool address:", quote.poolAddress);
```

### Executing a Swap

```javascript
// Amount to swap (0.1 WEDU)
const amountIn = "0.1";
const amountInWei = ethers.parseEther(amountIn);

// Get a quote
const quote = await quoter.getQuote(
  WEDU,
  USDC,
  amountIn,
  "0",
  TradeType.EXACT_INPUT
);

// Create swap parameters
const swapParams = await router.createSwapTransaction(
  WEDU,
  USDC,
  quote.feeTier,
  amountInWei,
  ethers.parseUnits(quote.amountOut, 6), // USDC has 6 decimals
  TradeType.EXACT_INPUT,
  {
    slippagePercentage: 0.5, // 0.5% slippage tolerance
    recipient: address,
  }
);

// Execute the swap
const tx = await router.exactInputSingle(swapParams);
console.log("Transaction sent:", tx.hash);

// Wait for transaction to be mined
const receipt = await tx.wait();
console.log("Transaction confirmed in block", receipt.blockNumber);
```

### Multi-hop Swaps

```javascript
// Token addresses
const WISER = "0xF9E03759752BE9fAA70a5556f103dbD385a2471C";
const WEDU = "0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12";
const ESD = "0xd282dE0c2bd41556c887f319A5C19fF441dCdf90";

// Get routes for each hop
const wiserToWeduRoutes = await quoter.getBestRoute(WISER, WEDU);
const weduToEsdRoutes = await quoter.getBestRoute(WEDU, ESD);

// Get fee tiers for each hop
const feeTier1 = wiserToWeduRoutes.routes[0].path[0].feeTier;
const feeTier2 = weduToEsdRoutes.routes[0].path[0].feeTier;

// Get quotes for each hop
const quote1 = await quoter.getQuote(
  WISER,
  WEDU,
  amountIn,
  "0",
  TradeType.EXACT_INPUT
);

const quote2 = await quoter.getQuote(
  WEDU,
  ESD,
  quote1.amountOut,
  "0",
  TradeType.EXACT_INPUT
);

// Create multi-hop swap parameters
const swapParams = await router.createMultihopSwapTransaction(
  WISER,
  WEDU,
  ESD,
  feeTier1,
  feeTier2,
  amountInWei,
  ethers.parseUnits(quote2.amountOut, esdDecimals),
  TradeType.EXACT_INPUT,
  {
    slippagePercentage: 1.0, // 1% slippage tolerance for multi-hop
    recipient: address,
  }
);

// Execute the swap
const tx = await router.exactInput(swapParams);
```

### Token Approval

```javascript
// Check if a token is approved for spending
const isApproved = await router.isTokenApproved(tokenAddress, amount);

// Approve a token for spending
if (!isApproved) {
  const approveTx = await router.approveToken(tokenAddress, amount);
  await approveTx.wait();
  console.log("Token approved for spending");
}
```

### Bridging EDU Tokens

The SDK provides functionality to bridge EDU tokens between different chains:

#### BSC to Arbitrum

```javascript
const { ethers } = require("ethers");
const { Bridge } = require("sailfish-v3-sdk");

// Initialize provider for BSC
const provider = new ethers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);
const signer = new ethers.Wallet(privateKey, provider);

// Initialize Bridge
const bridge = new Bridge(signer);

// Amount of EDU to bridge
const amount = "100";
const address = await signer.getAddress();

// Estimate the fee
const fee = await bridge.estimateBridgeFee(amount, address);
console.log(`Estimated fee: ${fee} BNB`);

// Check if EDU tokens are approved
const isApproved = await bridge.isEduApproved(address, amount);
if (!isApproved) {
  const approveTx = await bridge.approveEdu(amount);
  await approveTx.wait();
}

// Execute the bridge transaction
const tx = await bridge.bridgeEduFromBscToArb(amount, address);
console.log("Transaction sent:", tx.hash);
```

#### Arbitrum to EDUCHAIN

```javascript
const { ethers } = require("ethers");
const { Bridge } = require("sailfish-v3-sdk");

// Initialize provider for Arbitrum
const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
const signer = new ethers.Wallet(privateKey, provider);

// Initialize Bridge
const bridge = new Bridge(signer);

// Amount of EDU to bridge
const amount = "100";
const address = await signer.getAddress();

// Check if EDU tokens are approved on Arbitrum
const isApproved = await bridge.isEduApprovedOnArb(address, amount);
if (!isApproved) {
  const approveTx = await bridge.approveEduOnArb(amount);
  await approveTx.wait();
}

// Execute the bridge transaction
const tx = await bridge.bridgeEduFromArbToEdu(amount);
console.log("Transaction sent:", tx.hash);
```

### Bridging Widget

The SDK provides a ready to use Bridging Widget to bridge EDU tokens between different chains.

#### Themes

For now you can make use of the `sailer` or `edu.fun` theme

```javascript
<BridgeWidget
...
theme="sailer" />
```

## API Reference

### Quoter

The `Quoter` class is used for finding routes and getting quotes.

#### Constructor

```javascript
const quoter = new Quoter(provider);
```

#### Methods

- **getBestRoute(tokenInAddress, tokenOutAddress)**: Find the best route for a swap pair
- **getQuote(tokenIn, tokenOut, amountIn, amountOut, tradeType)**: Get a quote for a swap
- **getAvailableFeeTiers(tokenA, tokenB)**: Get all available fee tiers for a token pair

### Router

The `Router` class is used for executing swaps.

#### Constructor

```javascript
const router = new Router(providerOrSigner);
```

#### Methods

- **approveToken(tokenAddress, amount)**: Approve a token for spending
- **isTokenApproved(tokenAddress, amount)**: Check if a token is approved for spending
- **exactInputSingle(params)**: Execute an exact input swap
- **exactOutputSingle(params)**: Execute an exact output swap
- **exactInput(params)**: Execute a multi-hop exact input swap
- **exactOutput(params)**: Execute a multi-hop exact output swap
- **createSwapTransaction(tokenIn, tokenOut, fee, amountIn, amountOut, tradeType, options)**: Create a swap transaction
- **createMultihopSwapTransaction(tokenIn, intermediaryToken, tokenOut, feeTier1, feeTier2, amountIn, amountOut, tradeType, options)**: Create a multi-hop swap transaction

### Bridge

The `Bridge` class is used for bridging EDU tokens between chains.

#### Constructor

```javascript
const bridge = new Bridge(providerOrSigner);
```

#### Methods

- **getBnbPrice()**: Get the current BNB price in USD
- **estimateBridgeFee(amount, address, gasOnDestination)**: Estimate the fee for bridging EDU tokens from BSC to Arbitrum
- **hasEnoughBnb(address, fee)**: Check if the user has enough BNB for the bridge transaction
- **hasEnoughEdu(address, amount)**: Check if the user has enough EDU tokens for the bridge transaction
- **approveEdu(amount)**: Approve EDU tokens for the bridge
- **isEduApproved(address, amount)**: Check if EDU tokens are approved for the bridge
- **bridgeEduFromBscToArb(amount, address, gasOnDestination)**: Bridge EDU tokens from BSC to Arbitrum
- **hasEnoughEduOnArb(address, amount)**: Check if the user has enough EDU tokens on Arbitrum
- **isEduApprovedOnArb(address, amount)**: Check if EDU tokens are approved for the bridge on Arbitrum
- **approveEduOnArb(amount)**: Approve EDU tokens for the bridge on Arbitrum
- **bridgeEduFromArbToEdu(amount)**: Bridge EDU tokens from Arbitrum to EDUCHAIN

### PoolManager

The `PoolManager` class is used for managing liquidity pools.

#### Constructor

```javascript
const poolManager = new PoolManager(provider, signer, config);
```

Where `config` is an optional object with the following properties:
```javascript
{
  nftPositionManagerAddress: string, // Address of the NFT Position Manager contract
  uniswapV3FactoryAddress: string,   // Address of the Uniswap V3 Factory contract
  nftPositionManagerAbi?: any,       // Optional ABI for the NFT Position Manager
  uniswapV3FactoryAbi?: any,         // Optional ABI for the Uniswap V3 Factory
  erc20Abi?: any,                    // Optional ABI for ERC20 tokens
  chainId: number,                   // Chain ID (41923 for EDUCHAIN)
  nativeWrappedTokenAddress: string  // Address of the wrapped native token (WEDU)
}
```

> **Note**: When dealing with liquidity operations, WEDU represents the wrapped version of native EDU. The SDK automatically handles native EDU when WEDU is used in liquidity functions, allowing you to directly use native EDU in your transactions.

#### Methods

- **initializePool(params)**: Initialize a new pool with specified tokens and fee tier
- **getPoolInfo(poolAddress)**: Get detailed information about a pool
- **addLiquidity(params)**: Add liquidity to an existing pool. Takes an `AddLiquidityParams` object with detailed parameters and assumes the pool already exists.
- **deployLiquidity(token0, token1, fee, amount0, amount1, recipient, tickLower, tickUpper)**: A convenience function that both creates a pool (if it doesn't exist) and adds liquidity to it. Handles token sorting automatically and calculates sqrtPriceX96 based on token amounts.
- **increaseLiquidity(params)**: Increase liquidity in an existing position
- **decreaseLiquidity(params)**: Decrease liquidity in an existing position
- **collectFees(params)**: Collect fees earned from a position
- **burnPosition(tokenId)**: Burn a position NFT
- **getPositions(address)**: Get all positions for an address
- **getPortfolio(address)**: Get portfolio summary for an address
- **getPoolStats(poolAddress)**: Get statistics for a pool
- **calculatePriceRange(sqrtPriceX96, feeTier, token0Decimals, token1Decimals, rangeType)**: Calculate price range for different strategies

### TradeType

An enum representing the type of trade:

- **TradeType.EXACT_INPUT**: Swap a fixed amount of input token for as much output token as possible
- **TradeType.EXACT_OUTPUT**: Swap as little input token as possible for a fixed amount of output token

## Examples

The SDK includes several examples in the `examples` directory:

### Swap Examples
- **basic-usage.js**: Demonstrates how to get the best route and quote for a swap
- **execute-swap.js**: Shows how to execute a direct swap transaction
- **multi-hop-swap.js**: Illustrates working with multi-hop routes
- **multihop-wiser-esd.js**: Specific example of a multi-hop swap between WISER and ESD tokens using WEDU as an intermediary token

### Bridge Examples
- **bridge-edu.js**: Shows how to bridge EDU tokens from BSC to Arbitrum using LayerZero
- **bridge-arb-to-edu.js**: Shows how to bridge EDU tokens from Arbitrum to EDUCHAIN
- **bridge-widget-usage.js**: Demonstrates how to use the BridgeWidget React component in a web application

### Liquidity Pool Management Examples
- **initialize-pool.js**: Shows how to initialize a new pool with WEDU and a custom token
- **add-liquidity.js**: Demonstrates adding liquidity to a pool with a specific price ratio
- **remove-liquidity.js**: Shows how to remove a percentage of liquidity from an existing position
- **view-portfolio.js**: Demonstrates how to view detailed portfolio information
- **collect-fees.js**: Shows how to collect fees earned from a position
- **deploy-liquidity.js**: Demonstrates deploying liquidity to a pool and calculating different price range strategies

## Contract Addresses

The SDK uses the following contract addresses on EDUCHAIN:

- **WEDU**: 0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12
- **UniversalRouter**: 0x2f336145125f48d053EE0272EB02288cd40b808e
- **UniswapV3Factory**: 0x963A7f4eB46967A9fd3dFbabD354fC294FA2BF5C
- **NonfungiblePositionManager**: 0x79cc7deA5eE05735a7503A32Dc4251C7f79F3Baf
- **SwapRouter**: 0x1a1e967e523435CeF20642e3D7811F7d0da9a704
- **Quoter**: 0x14b4D9238550dc75Cf164FDa471Aa1d8A6A2b0c6
- **QuoterV2**: 0x83EE12582E3448Ab69E664A2ba69b6AedE112205

## License

MIT
