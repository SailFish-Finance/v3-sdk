import axios from "axios";
import { BigNumberish, ethers, Provider, Signer } from "ethers";
import { BSC_ABI } from "./constants";

/**
 * Bridge class for bridging tokens between chains
 */
export class Bridge {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  /**
   * Create a new Bridge instance
   * @param providerOrSigner An ethers Provider or Signer
   */
  constructor(providerOrSigner: Provider | Signer) {
    if (
      "provider" in providerOrSigner &&
      typeof providerOrSigner.provider !== "undefined"
    ) {
      // It's a signer
      this.signer = providerOrSigner as Signer;
      this.provider = (providerOrSigner as Signer).provider as Provider;
    } else {
      // It's a provider
      this.provider = providerOrSigner as Provider;
    }
  }

  /**
   * Check if the bridge has a signer
   * @returns True if the bridge has a signer
   * @private
   */
  private hasSigner(): boolean {
    if (!this.signer) {
      throw new Error("This operation requires a signer");
    }
    return true;
  }

  /**
   * Get the BNB price in USD
   * @returns The BNB price in USD
   */
  public async getBnbPrice(): Promise<number> {
    try {
      const response = await axios.get(
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BNB&tsyms=USD"
      );
      return response.data.RAW.BNB.USD.PRICE;
    } catch (error) {
      console.error("Error fetching BNB price:", error);
      throw new Error("Failed to fetch BNB price");
    }
  }

  /**
   * Estimate the fee for bridging EDU tokens from BSC to Arbitrum
   * @param amount Amount of EDU tokens to bridge
   * @param address User's address
   * @param gasOnDestination Amount of ETH to receive on Arbitrum for gas (in ETH)
   * @returns The estimated fee in BNB
   */
  public async estimateBridgeFee(
    amount: string,
    address: string,
    gasOnDestination: string = "0.0005"
  ): Promise<string> {
    this.hasSigner();

    try {
      // BSC OFT contract address
      const bscOft = "0x67fb304001aD03C282266B965b51E97Aa54A2FAB";

      // EDU token on BSC
      const eduTokenAddress = "0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639";

      // Get EDU token decimals
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        ["function decimals() view returns (uint8)"],
        this.provider
      );

      const decimals = await eduContract.decimals();

      // Create contract instance
      const bscOftContract = new ethers.Contract(
        bscOft,
        BSC_ABI,
        this.provider
      );

      // LayerZero chainId for Arbitrum
      const dstChainId = 110;

      // Parse amount with correct decimals
      const amountBigInt = ethers.parseUnits(amount, decimals);

      // Don't use ZRO token for payment
      const useZro = 0;

      // Encode the destination address
      const toAddress = ethers.zeroPadValue(address, 32);

      // Adapter params type
      const type = 2;

      // Gas limit for the transaction on the destination chain
      const gasLimit = 500000;

      // Amount of ETH to airdrop on the destination chain for gas
      const gasAirdrop = ethers.parseEther(gasOnDestination);

      // Encode the adapter params
      const adapterParams = ethers.solidityPacked(
        ["uint16", "uint256", "uint256", "address"],
        [type, gasLimit, gasAirdrop, address]
      );

      // Estimate the fee
      const result = await bscOftContract.estimateSendFee(
        dstChainId,
        toAddress,
        amountBigInt,
        useZro,
        adapterParams
      );

      // Return the fee in BNB
      return ethers.formatEther(result[0]);
    } catch (error) {
      console.error("Error estimating bridge fee:", error);
      throw new Error("Failed to estimate bridge fee");
    }
  }

  /**
   * Check if the user has enough BNB for the bridge transaction
   * @param address User's address
   * @param fee Estimated fee in BNB
   * @returns True if the user has enough BNB
   */
  public async hasEnoughBnb(address: string, fee: string): Promise<boolean> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.getBigInt(balance) >= ethers.parseEther(fee);
    } catch (error) {
      console.error("Error checking BNB balance:", error);
      throw new Error("Failed to check BNB balance");
    }
  }

  /**
   * Check if the user has enough EDU tokens for the bridge transaction
   * @param address User's address
   * @param amount Amount of EDU tokens to bridge
   * @returns True if the user has enough EDU tokens
   */
  public async hasEnoughEdu(address: string, amount: string): Promise<boolean> {
    try {
      // EDU token on BSC
      const eduTokenAddress = "0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639";

      // Get EDU token decimals and balance
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        [
          "function decimals() view returns (uint8)",
          "function balanceOf(address) view returns (uint256)",
        ],
        this.provider
      );

      let decimals;
      try {
        decimals = await eduContract.decimals();
      } catch (error) {
        // console.log("Error fetching EDU decimals. Using default value of 18");
        decimals = 18;
      }

      let balance;
      try {
        balance = await eduContract.balanceOf(address);
      } catch (error) {
        // console.log('Error fetching EDU balance. Using 0 as default');
        balance = 0;
      }

      return ethers.getBigInt(balance) >= ethers.parseUnits(amount, decimals);
    } catch (error) {
      // console.log('Error checking EDU balance:', error);
      // console.log('Returning false for hasEnoughEdu check');
      return false;
    }
  }

  /**
   * Approve EDU tokens for the bridge
   * @param amount Amount of EDU tokens to approve
   * @returns Transaction response
   */
  public async approveEdu(amount: string): Promise<ethers.TransactionResponse> {
    this.hasSigner();

    try {
      // EDU token on BSC
      const eduTokenAddress = "0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639";

      // BSC OFT contract address
      const bscOft = "0x67fb304001aD03C282266B965b51E97Aa54A2FAB";

      // Get EDU token decimals
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        [
          "function decimals() view returns (uint8)",
          "function approve(address, uint256) returns (bool)",
        ],
        this.signer
      );

      const decimals = await eduContract.decimals();

      // Approve the maximum amount
      return eduContract.approve(bscOft, ethers.MaxUint256);
    } catch (error) {
      console.error("Error approving EDU tokens:", error);
      throw new Error("Failed to approve EDU tokens");
    }
  }

  /**
   * Check if EDU tokens are approved for the bridge
   * @param address User's address
   * @param amount Amount of EDU tokens to bridge
   * @returns True if EDU tokens are approved
   */
  public async isEduApproved(
    address: string,
    amount: string
  ): Promise<boolean> {
    try {
      // EDU token on BSC
      const eduTokenAddress = "0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639";

      // BSC OFT contract address
      const bscOft = "0x67fb304001aD03C282266B965b51E97Aa54A2FAB";

      // Get EDU token decimals and allowance
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        [
          "function decimals() view returns (uint8)",
          "function allowance(address, address) view returns (uint256)",
        ],
        this.provider
      );

      const decimals = await eduContract.decimals();
      const allowance = await eduContract.allowance(address, bscOft);

      return ethers.getBigInt(allowance) >= ethers.parseUnits(amount, decimals);
    } catch (error) {
      console.error("Error checking EDU allowance:", error);
      throw new Error("Failed to check EDU allowance");
    }
  }

  /**
   * Bridge EDU tokens from BSC to Arbitrum
   * @param amount Amount of EDU tokens to bridge
   * @param address User's address
   * @param gasOnDestination Amount of ETH to receive on Arbitrum for gas (in ETH)
   * @returns Transaction response
   */
  public async bridgeEduFromBscToArb(
    amount: string,
    address: string,
    gasOnDestination: string = "0.0005"
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();

    try {
      // BSC OFT contract address
      const bscOft = "0x67fb304001aD03C282266B965b51E97Aa54A2FAB";

      // EDU token on BSC
      const eduTokenAddress = "0xBdEAe1cA48894A1759A8374D63925f21f2Ee2639";

      // Get EDU token decimals
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        ["function decimals() view returns (uint8)"],
        this.provider
      );

      const decimals = await eduContract.decimals();

      // Create contract instance
      const bscOftContract = new ethers.Contract(bscOft, BSC_ABI, this.signer);

      // LayerZero chainId for Arbitrum
      const dstChainId = 110;

      // Parse amount with correct decimals
      const amountBigInt = ethers.parseUnits(amount, decimals);

      // Encode the destination address
      const toAddress = ethers.zeroPadValue(address, 32);

      // Adapter params type
      const type = 2;

      // Gas limit for the transaction on the destination chain
      const gasLimit = 500000;

      // Amount of ETH to airdrop on the destination chain for gas
      const gasAirdrop = ethers.parseEther(gasOnDestination);

      // Encode the adapter params
      const adapterParams = ethers.solidityPacked(
        ["uint16", "uint256", "uint256", "address"],
        [type, gasLimit, gasAirdrop, address]
      );

      // Estimate the fee
      const result = await bscOftContract.estimateSendFee(
        dstChainId,
        toAddress,
        amountBigInt,
        0, // useZro
        adapterParams
      );

      // Execute the bridge transaction
      return bscOftContract.sendFrom(
        address,
        dstChainId,
        toAddress,
        amountBigInt,
        {
          refundAddress: address,
          zroPaymentAddress: address,
          adapterParams: adapterParams,
        },
        {
          value: result[0],
        }
      );
    } catch (error) {
      console.error("Error bridging EDU tokens:", error);
      throw new Error("Failed to bridge EDU tokens");
    }
  }

  /**
   * Check if EDU tokens are approved for the bridge on Arbitrum
   * @param address User's address
   * @param amount Amount of EDU tokens to bridge
   * @returns True if EDU tokens are approved
   */
  public async isEduApprovedOnArb(
    address: string,
    amount: string
  ): Promise<boolean> {
    try {
      // EDU token on Arbitrum
      const eduTokenAddress = "0xf8173a39c56a554837C4C7f104153A005D284D11";

      // Contract address for bridging from Arbitrum to EDUCHAIN
      const contractAddr = "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8";

      // Get EDU token decimals and allowance
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        [
          "function decimals() view returns (uint8)",
          "function allowance(address, address) view returns (uint256)",
        ],
        this.provider
      );

      const decimals = await eduContract.decimals();
      const allowance = await eduContract.allowance(address, contractAddr);

      return ethers.getBigInt(allowance) >= ethers.parseUnits(amount, decimals);
    } catch (error) {
      console.error("Error checking EDU allowance on Arbitrum:", error);
      throw new Error("Failed to check EDU allowance on Arbitrum");
    }
  }

  /**
   * Approve EDU tokens for the bridge on Arbitrum
   * @param amount Amount of EDU tokens to approve
   * @returns Transaction response
   */
  public async approveEduOnArb(
    amount: string
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();

    try {
      // EDU token on Arbitrum
      const eduTokenAddress = "0xf8173a39c56a554837C4C7f104153A005D284D11";

      // Contract address for bridging from Arbitrum to EDUCHAIN
      const contractAddr = "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8";

      // Get EDU token decimals
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        [
          "function decimals() view returns (uint8)",
          "function approve(address, uint256) returns (bool)",
        ],
        this.signer
      );

      // Approve the maximum amount
      return eduContract.approve(contractAddr, ethers.MaxUint256);
    } catch (error) {
      console.error("Error approving EDU tokens on Arbitrum:", error);
      throw new Error("Failed to approve EDU tokens on Arbitrum");
    }
  }

  /**
   * Check if the user has enough EDU tokens on Arbitrum for the bridge transaction
   * @param address User's address
   * @param amount Amount of EDU tokens to bridge
   * @returns True if the user has enough EDU tokens
   */
  public async hasEnoughEduOnArb(
    address: string,
    amount: string
  ): Promise<boolean> {
    try {
      // EDU token on Arbitrum
      const eduTokenAddress = "0xf8173a39c56a554837C4C7f104153A005D284D11";

      // Get EDU token decimals and balance
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        [
          "function decimals() view returns (uint8)",
          "function balanceOf(address) view returns (uint256)",
        ],
        this.provider
      );

      let decimals;
      try {
        decimals = await eduContract.decimals();
      } catch (error) {
        // console.log(
        //   "Error fetching EDU decimals on Arbitrum. Using default value of 18"
        // );
        decimals = 18;
      }

      let balance;
      try {
        balance = await eduContract.balanceOf(address);
      } catch (error) {
        // console.log(
        //   "Error fetching EDU balance on Arbitrum. Using 0 as default"
        // );
        balance = 0;
      }

      return ethers.getBigInt(balance) >= ethers.parseUnits(amount, decimals);
    } catch (error) {
      // console.log("Error checking EDU balance on Arbitrum:", error);
      // console.log("Returning false for hasEnoughEduOnArb check");
      return false;
    }
  }

  /**
   * Bridge EDU tokens from Arbitrum to EDUCHAIN
   * @param amount Amount of EDU tokens to bridge
   * @returns Transaction response
   */
  public async bridgeEduFromArbToEdu(
    amount: string
  ): Promise<ethers.TransactionResponse> {
    this.hasSigner();

    try {
      // Contract address for bridging from Arbitrum to EDUCHAIN
      const contractAddr = "0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8";

      // EDU token on Arbitrum
      const eduTokenAddress = "0xf8173a39c56a554837C4C7f104153A005D284D11";

      // Get EDU token decimals
      const eduContract = new ethers.Contract(
        eduTokenAddress,
        ["function decimals() view returns (uint8)"],
        this.provider
      );

      const decimals = await eduContract.decimals();

      // Create contract instance
      const contract = new ethers.Contract(
        contractAddr,
        ["function depositERC20(uint256 amount)"],
        this.signer
      );

      // Parse amount with correct decimals
      const amountBigInt = ethers.parseUnits(amount, decimals);

      // Execute the bridge transaction
      return contract.depositERC20(amountBigInt);
    } catch (error) {
      console.error(
        "Error bridging EDU tokens from Arbitrum to EDUCHAIN:",
        error
      );
      throw new Error("Failed to bridge EDU tokens from Arbitrum to EDUCHAIN");
    }
  }
}
