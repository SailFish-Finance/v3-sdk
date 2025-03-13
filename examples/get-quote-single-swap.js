// Example of using the SailFish DEX v3 SDK

const { ethers } = require("ethers");
const { Quoter, Router, TradeType } = require("../dist");

async function main() {
  try {
    // Initialize provider
    const provider = new ethers.JsonRpcProvider(
      "https://rpc.edu-chain.raas.gelato.cloud"
    );

    // Initialize Quoter
    const quoter = new Quoter(provider);

    // Token addresses
    const WEDU = "0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12";
    const USDC = "0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342";

    console.log("Getting best route for WEDU -> USDC...");

    // Get the best route
    const routes = await quoter.getBestRoute(WEDU, USDC);
    console.log("Found routes:", routes.routes.length);

    if (routes.routes.length > 0) {
      console.log("Best route type:", routes.routes[0].type);
      console.log(
        "Best route path:",
        routes.routes[0].path.map((p) => p.id)
      );

      // Get a quote for swapping 1 WEDU to USDC
      console.log("Getting quote for 1 WEDU -> USDC...");
      const quote = await quoter.getQuote(
        WEDU,
        USDC,
        "10000.0", // amountIn
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
      console.log("- Gas estimate:", quote.gasEstimate);
    } else {
      console.log("No routes found for WEDU -> USDC");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
