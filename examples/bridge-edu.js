// Example of bridging EDU tokens from BSC to Arbitrum using LayerZero

const { ethers } = require("ethers");
const { Bridge } = require("../dist/index.cjs");

// This example requires a private key to sign transactions
// Replace with your own private key and NEVER share it or commit it to version control
const PRIVATE_KEY = 'PRIVATE_KEY';

async function main() {
  try {
    // Initialize provider for BSC
    const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    
    // Initialize signer
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const address = await signer.getAddress();
    console.log('Using address:', address);
    
    // Initialize Bridge
    const bridge = new Bridge(signer);
    
    // Amount of EDU to bridge (in tokens, not wei)
    const amount = '2';
    
    // Gas on destination (in ETH)
    const gasOnDestination = '0.0005';
    
    console.log(`Preparing to bridge ${amount} EDU from BSC to Arbitrum...`);
    console.log(`Gas on destination: ${gasOnDestination} ETH`);
    
    // Step 1: Get BNB price for reference
    const bnbPrice = await bridge.getBnbPrice();
    console.log(`Current BNB price: $${bnbPrice.toFixed(2)}`);
    
    // Step 2: Estimate the fee for bridging
    const fee = await bridge.estimateBridgeFee(amount, address, gasOnDestination);
    console.log(`Estimated fee: ${fee} BNB (approximately $${(Number(fee) * bnbPrice).toFixed(2)})`);
    
    // Step 3: Check if the user has enough BNB for the transaction
    const hasEnoughBnb = await bridge.hasEnoughBnb(address, fee);
    if (!hasEnoughBnb) {
      console.error(`Not enough BNB for the transaction. Need at least ${fee} BNB.`);
      return;
    }
    console.log('You have enough BNB for the transaction.');
    
    // Step 4: Check if the user has enough EDU tokens
    const hasEnoughEdu = await bridge.hasEnoughEdu(address, amount);
    if (!hasEnoughEdu) {
      console.error(`Not enough EDU tokens. Need at least ${amount} EDU.`);
      return;
    }
    console.log('You have enough EDU tokens for the bridge.');
    
    // Step 5: Check if EDU tokens are approved for the bridge
    const isApproved = await bridge.isEduApproved(address, amount);
    if (!isApproved) {
      console.log('Approving EDU tokens for the bridge...');
      const approveTx = await bridge.approveEdu(amount);
      console.log(`Approval transaction sent: ${approveTx.hash}`);
      await approveTx.wait();
      console.log('Approval confirmed!');
    } else {
      console.log('EDU tokens already approved for the bridge.');
    }
    
    // Step 6: Execute the bridge transaction
    console.log('Executing bridge transaction...');
    const tx = await bridge.bridgeEduFromBscToArb(amount, address, gasOnDestination);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    
    console.log(`
Bridge transaction completed successfully!
- ${amount} EDU tokens are being transferred from BSC to Arbitrum
- You will receive ${gasOnDestination} ETH on Arbitrum for gas
- The tokens should arrive on Arbitrum in approximately 3-5 minutes
- You can check your balance on Arbitrum after that time
    `);
    
    console.log(`View transaction on BSC Explorer: https://bscscan.com/tx/${tx.hash}`);
    console.log(`Check your Arbitrum balance: https://arbiscan.io/address/${address}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example (after adding your private key)
main();
