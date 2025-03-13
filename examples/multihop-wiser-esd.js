// Example of a multi-hop swap between WISER and ESD using WEDU as intermediary token

const { ethers } = require("ethers");
const { Quoter, Router, TradeType } = require("../dist");

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
    const WISER = '0xF9E03759752BE9fAA70a5556f103dbD385a2471C';
    const WEDU = '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12';
    const ESD = '0xd282dE0c2bd41556c887f319A5C19fF441dCdf90';
    
    // Amount to swap (100 WISER)
    const amountIn = '50';
    
    // Get token decimals
    const wiserContract = new ethers.Contract(
      WISER,
      ['function decimals() view returns (uint8)'],
      provider
    );
    const esdContract = new ethers.Contract(
      ESD,
      ['function decimals() view returns (uint8)'],
      provider
    );
    
    const wiserDecimals = await wiserContract.decimals();
    const esdDecimals = await esdContract.decimals();
    
    console.log(`WISER decimals: ${wiserDecimals}`);
    console.log(`ESD decimals: ${esdDecimals}`);
    
    const amountInWei = ethers.parseUnits(amountIn, wiserDecimals);
    
    console.log(`Swapping ${amountIn} WISER for ESD via WEDU...`);
    
    // First, check if there's a direct route
    console.log('Checking for direct route...');
    const directRoutes = await quoter.getBestRoute(WISER, ESD);
    
    if (directRoutes.routes[0].type === "direct") {
      console.log('Direct route found! No need for multi-hop.');
      return;
    }
    
    console.log('No direct route found. Proceeding with multi-hop via WEDU.');
    
    // Get routes for each hop
    const wiserToWeduRoutes = await quoter.getBestRoute(WISER, WEDU);
    const weduToEsdRoutes = await quoter.getBestRoute(WEDU, ESD);
    
    if (wiserToWeduRoutes.routes.length === 0 || weduToEsdRoutes.routes.length === 0) {
      console.log('Could not find routes for one or both hops.');
      return;
    }
    
    // Get fee tiers for each hop
    const feeTier1 = wiserToWeduRoutes.routes[0].path[0].feeTier;
    const feeTier2 = weduToEsdRoutes.routes[0].path[0].feeTier;
    
    console.log(`Fee tier for WISER -> WEDU: ${feeTier1 / 10000}%`);
    console.log(`Fee tier for WEDU -> ESD: ${feeTier2 / 10000}%`);
    
    // Get quotes for each hop to estimate the final output
    const quote1 = await quoter.getQuote(
      WISER,
      WEDU,
      amountIn,
      '0',
      TradeType.EXACT_INPUT
    );
    
    const quote2 = await quoter.getQuote(
      WEDU,
      ESD,
      quote1.amountOut,
      '0',
      TradeType.EXACT_INPUT
    );
    
    console.log('Multi-hop quote:');
    console.log(`- First hop: ${amountIn} WISER -> ${quote1.amountOut} WEDU`);
    console.log(`  Pool: ${quote1.poolAddress}`);
    console.log(`- Second hop: ${quote1.amountOut} WEDU -> ${quote2.amountOut} ESD`);
    console.log(`  Pool: ${quote2.poolAddress}`);
    console.log(`- Total output: ${quote2.amountOut} ESD`);
    console.log(`- Combined price impact: ${(Number(quote1.priceImpact) + Number(quote2.priceImpact)).toFixed(2)}%`);
    
    // Check if WISER is approved for spending
    const isApproved = await router.isTokenApproved(WISER, amountInWei);
    
    if (!isApproved) {
      console.log('Approving WISER for spending...');
      const approveTx = await router.approveToken(WISER, amountInWei);
      console.log(`Approval transaction sent: ${approveTx.hash}`);
      await approveTx.wait();
      console.log('Approval confirmed!');
    } else {
      console.log('WISER already approved for spending.');
    }
    
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
        recipient: address
      }
    );
    
    console.log('Executing multi-hop swap...');
    
    // Execute the swap
    const tx = await router.exactInput(swapParams);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    
    console.log('Multi-hop swap completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example (after adding your private key)
main();
