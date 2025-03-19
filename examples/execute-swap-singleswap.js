// Example of executing a swap using the SailFish DEX v3 SDK

const { ethers } = require("ethers");
const { Quoter, Router, TradeType } = require("../dist/index.cjs");

// This example requires a private key to sign transactions
// Replace with your own private key and NEVER share it or commit it to version control
const PRIVATE_KEY = 'PRIVATE_KEY';

async function main() {
  try {
    // Initialize provider
    const provider = new ethers.JsonRpcProvider('https://rpc.edu-chain.raas.gelato.cloud');
    
    // Initialize signer
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const address = await signer.getAddress();
    console.log('Using address:', address);
    
    // Initialize Quoter and Router
    const quoter = new Quoter(provider);
    const router = new Router(signer);
    
    // Token addresses
    const WEDU = '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12';
    const USDC = '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342';
    
    // Amount to swap (0.1 WEDU)
    const amountIn = '0.1';
    const amountInWei = ethers.parseEther(amountIn);
    
    console.log(`Swapping ${amountIn} WEDU for USDC...`);
    
    // Get the best route
    const routes = await quoter.getBestRoute(WEDU, USDC);
    
    if (routes.routes.length === 0) {
      console.log('No routes found for WEDU -> USDC');
      return;
    }
    
    // Get a quote
    const quote = await quoter.getQuote(
      WEDU,
      USDC,
      amountIn,
      '0',
      TradeType.EXACT_INPUT
    );
    
    console.log('Quote received:');
    console.log('- Amount in:', quote.amountIn, 'WEDU');
    console.log('- Amount out:', quote.amountOut, 'USDC');
    console.log('- Execution price: 1 WEDU =', quote.executionPrice, 'USDC');
    console.log('- Price impact:', quote.priceImpact, '%');
    console.log('- Fee tier:', quote.feeTier / 10000, '%');
    console.log('- Pool address:', quote.poolAddress);
    
    // Create swap parameters
    const swapParams = await router.createSwapTransaction(
      WEDU,
      USDC,
      quote.feeTier, // Use the fee tier from the quote
      amountInWei,
      ethers.parseUnits(quote.amountOut, 6), // USDC has 6 decimals
      TradeType.EXACT_INPUT,
      {
        slippagePercentage: 0.5, // 0.5% slippage tolerance
        recipient: address
      }
    );
    
    console.log('Executing swap...');
    
    // Execute the swap
    const tx = await router.exactInputSingle(swapParams);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    
    console.log('Swap completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example (after adding your private key)
main();
