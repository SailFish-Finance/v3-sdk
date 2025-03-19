// Example of bridging EDU tokens from Arbitrum to EDUCHAIN

const { ethers } = require("ethers");
const { Bridge } = require("../dist/index.cjs");

// This example requires a private key to sign transactions
// Replace with your own private key and NEVER share it or commit it to version control
const PRIVATE_KEY = 'PRIVATE_KEY';

async function main() {
  try {
    // Initialize provider for Arbitrum
    const provider = new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
    
    // Initialize signer
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const address = await signer.getAddress();
    console.log('Using address:', address);
    
    // Initialize Bridge
    const bridge = new Bridge(signer);
    
    // Amount of EDU to bridge (in tokens, not wei)
    const amount = '2';
    
    console.log(`Preparing to bridge ${amount} EDU from Arbitrum to EDUCHAIN...`);
    
    // Step 1: Check if the user has enough EDU tokens on Arbitrum
    const hasEnoughEdu = await bridge.hasEnoughEduOnArb(address, amount);
    if (!hasEnoughEdu) {
      console.error(`Not enough EDU tokens on Arbitrum. Need at least ${amount} EDU.`);
      return;
    }
    console.log('You have enough EDU tokens for the bridge.');
    
    // Step 2: Check if EDU tokens are approved for the bridge
    const isApproved = await bridge.isEduApprovedOnArb(address, amount);
    if (!isApproved) {
      console.log('Approving EDU tokens for the bridge...');
      const approveTx = await bridge.approveEduOnArb(amount);
      console.log(`Approval transaction sent: ${approveTx.hash}`);
      await approveTx.wait();
      console.log('Approval confirmed!');
    } else {
      console.log('EDU tokens already approved for the bridge.');
    }
    
    // Step 3: Execute the bridge transaction
    console.log('Executing bridge transaction...');
    const tx = await bridge.bridgeEduFromArbToEdu(amount);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block', receipt.blockNumber);
    console.log('Gas used:', receipt.gasUsed.toString());
    
    console.log(`
Bridge transaction completed successfully!
- ${amount} EDU tokens are being transferred from Arbitrum to EDUCHAIN
- The tokens should arrive on EDUCHAIN in approximately 15-20 minutes
- You can check your balance on EDUCHAIN after that time
    `);
    
    console.log(`View transaction on Arbiscan: https://arbiscan.io/tx/${tx.hash}`);
    console.log(`Check your EDUCHAIN balance: https://educhain.blockscout.com/address/${address}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example (after adding your private key)
main();
