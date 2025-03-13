// Example of multi-hop swaps using the SailFish DEX v3 SDK

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
    const WISER = "0xF9E03759752BE9fAA70a5556f103dbD385a2471C";
    const ESD = "0xd282dE0c2bd41556c887f319A5C19fF441dCdf90";

    console.log("Finding routes for WISER -> ESD (potentially multi-hop)...");

    // Get the best route
    const routes = await quoter.getBestRoute(WISER, ESD);
    console.log("Found routes:", routes.routes.length);

    if (routes.routes.length > 0) {
      const bestRoute = routes.routes[0];
      console.log("Best route type:", bestRoute.type);

      if (bestRoute.type === "direct") {
        console.log("Direct route found:");
        console.log("- Pool:", bestRoute.path[0].id);
        console.log("- Fee tier:", bestRoute.path[0].feeTier);
      } else {
        console.log("Multi-hop route found:");
        console.log("- First hop pool:", bestRoute.path[0].id);
        console.log("- Second hop pool:", bestRoute.path[1].id);
        console.log(
          "- Intermediary token address:",
          bestRoute.intermediaryToken.address
        );
        console.log(
          "- Intermediary token:",
          bestRoute.intermediaryToken.symbol
        );
        console.log("- Total fee:", bestRoute.totalFee);
      }

      // Get a quote for swapping 1 WEDU
      console.log("Getting quote for 1 WISER -> ESD...");
      const quote = await quoter.getQuote(
        WISER,
        ESD,
        "1.0", // amountIn
        "0", // amountOut (not used for EXACT_INPUT)
        TradeType.EXACT_INPUT
      );

      console.log("Quote result:");
      console.log("- Amount in:", quote.amountIn, "WISER");
      console.log("- Amount out:", quote.amountOut, "ESD");
      console.log("- Execution price: 1 WISER =", quote.executionPrice, "ESD");
      console.log("- Price impact:", quote.priceImpact, "%");
      console.log("- Fee tier:", quote.feeTier);
      console.log("- Pool address(es):", quote.poolAddress);

      // For multi-hop routes, we can also demonstrate how to execute them
      if (bestRoute.type === "indirect") {
        console.log("\nTo execute this multi-hop swap, see multihop-wiser-esd.js in examples folder.");
        // console.log("1. Create a path by encoding the tokens and fees");
        // console.log(
        //   "2. Use the router.exactInput method instead of exactInputSingle"
        // );

        // Example code for creating the path (not executed)
        //         console.log("\nExample code:");
        //         console.log(`
        // const path = ethers.solidityPacked(
        //   ['address', 'uint24', 'address', 'uint24', 'address'],
        //   [
        //     WISER,
        //     bestRoute.path[0].feeTier,
        //     bestRoute.intermediaryToken.address,
        //     bestRoute.path[1].feeTier,
        //     ESD
        //   ]
        // );

        // const params = {
        //   path,
        //   recipient: YOUR_ADDRESS,
        //   deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
        //   amountIn: ethers.parseEther('1.0'),
        //   amountOutMinimum: ethers.parseUnits(quote.amountOut, 6) * 995n / 1000n // 0.5% slippage
        // };

        // const tx = await router.exactInput(params);
        //         `);
      }
    } else {
      throw new Error("No routes found for WISER -> ESD");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
