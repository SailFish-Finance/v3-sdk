// Contract addresses
export const ADDRESSES = {
  WEDU: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12',
  UNIVERSAL_ROUTER: '0x2f336145125f48d053EE0272EB02288cd40b808e',
  PERSONAL_ASSET_MANAGER_FACTORY: '0x08210F57aa7F2219ddE1B267BB101C7a11a2Ed83',
  ASSET_HELPER: '0x8D541EC50b550CB1Fe14Cf72Eebf2bA40c0414D4',
  UNISWAP_V3_FACTORY: '0x963A7f4eB46967A9fd3dFbabD354fC294FA2BF5C',
  NONFUNGIBLE_POSITION_MANAGER: '0x79cc7deA5eE05735a7503A32Dc4251C7f79F3Baf',
  SWAP_ROUTER: '0x1a1e967e523435CeF20642e3D7811F7d0da9a704',
  QUOTER: '0x14b4D9238550dc75Cf164FDa471Aa1d8A6A2b0c6',
  QUOTER_V2: '0x83EE12582E3448Ab69E664A2ba69b6AedE112205',
  TICK_LENS: '0xE5D80F26C7dfE594d22e813761104e6c217794Cf',
};

// Chain information
export const CHAIN_ID = 41923;
export const RPC_URL = 'https://rpc.edu-chain.raas.gelato.cloud';

// Constants
export const MAX_INT128 = 2n ** 128n - 1n;
export const MAX_UINT256 = 2n ** 256n - 1n;

// ABIs
export const ROUTER_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_factory", type: "address", internalType: "address" },
      { name: "_WETH9", type: "address", internalType: "address" },
      { name: "initCodeHash", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "WETH9",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "exactInput",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct ISwapRouter.ExactInputParams",
        components: [
          { name: "path", type: "bytes", internalType: "bytes" },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountIn",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountOutMinimum",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "exactInputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct ISwapRouter.ExactInputSingleParams",
        components: [
          { name: "tokenIn", type: "address", internalType: "address" },
          {
            name: "tokenOut",
            type: "address",
            internalType: "address",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountIn",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountOutMinimum",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "exactOutput",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct ISwapRouter.ExactOutputParams",
        components: [
          { name: "path", type: "bytes", internalType: "bytes" },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountOut",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountInMaximum",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    outputs: [{ name: "amountIn", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "exactOutputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct ISwapRouter.ExactOutputSingleParams",
        components: [
          { name: "tokenIn", type: "address", internalType: "address" },
          {
            name: "tokenOut",
            type: "address",
            internalType: "address",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "deadline",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountOut",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountInMaximum",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
    ],
    outputs: [{ name: "amountIn", type: "uint256", internalType: "uint256" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "factory",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "multicall",
    inputs: [{ name: "data", type: "bytes[]", internalType: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "refundETH",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "selfPermit",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "v", type: "uint8", internalType: "uint8" },
      { name: "r", type: "bytes32", internalType: "bytes32" },
      { name: "s", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "selfPermitAllowed",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "expiry", type: "uint256", internalType: "uint256" },
      { name: "v", type: "uint8", internalType: "uint8" },
      { name: "r", type: "bytes32", internalType: "bytes32" },
      { name: "s", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "selfPermitAllowedIfNecessary",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "nonce", type: "uint256", internalType: "uint256" },
      { name: "expiry", type: "uint256", internalType: "uint256" },
      { name: "v", type: "uint8", internalType: "uint8" },
      { name: "r", type: "bytes32", internalType: "bytes32" },
      { name: "s", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "selfPermitIfNecessary",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "v", type: "uint8", internalType: "uint8" },
      { name: "r", type: "bytes32", internalType: "bytes32" },
      { name: "s", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "sweepToken",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      {
        name: "amountMinimum",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "recipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "sweepTokenWithFee",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      {
        name: "amountMinimum",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "recipient", type: "address", internalType: "address" },
      { name: "feeBips", type: "uint256", internalType: "uint256" },
      { name: "feeRecipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "uniswapV3SwapCallback",
    inputs: [
      { name: "amount0Delta", type: "int256", internalType: "int256" },
      { name: "amount1Delta", type: "int256", internalType: "int256" },
      { name: "_data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unwrapWETH9",
    inputs: [
      {
        name: "amountMinimum",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "recipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "unwrapWETH9WithFee",
    inputs: [
      {
        name: "amountMinimum",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "recipient", type: "address", internalType: "address" },
      { name: "feeBips", type: "uint256", internalType: "uint256" },
      { name: "feeRecipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
];

export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address,address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function deposit() public payable",
];

export const QUOTER_V2_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_factory", type: "address", internalType: "address" },
      { name: "_WETH9", type: "address", internalType: "address" },
      { name: "initCodeHash", type: "bytes32", internalType: "bytes32" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "WETH9",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "factory",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "quoteExactInput",
    inputs: [
      { name: "path", type: "bytes", internalType: "bytes" },
      { name: "amountIn", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amountOut", type: "uint256", internalType: "uint256" },
      {
        name: "sqrtPriceX96AfterList",
        type: "uint160[]",
        internalType: "uint160[]",
      },
      {
        name: "initializedTicksCrossedList",
        type: "uint32[]",
        internalType: "uint32[]",
      },
      { name: "gasEstimate", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "quoteExactInputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
        components: [
          { name: "tokenIn", type: "address", internalType: "address" },
          {
            name: "tokenOut",
            type: "address",
            internalType: "address",
          },
          {
            name: "amountIn",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "fee", type: "uint24", internalType: "uint24" },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
    ],
    outputs: [
      { name: "amountOut", type: "uint256", internalType: "uint256" },
      {
        name: "sqrtPriceX96After",
        type: "uint160",
        internalType: "uint160",
      },
      {
        name: "initializedTicksCrossed",
        type: "uint32",
        internalType: "uint32",
      },
      { name: "gasEstimate", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "quoteExactOutput",
    inputs: [
      { name: "path", type: "bytes", internalType: "bytes" },
      { name: "amountOut", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "amountIn", type: "uint256", internalType: "uint256" },
      {
        name: "sqrtPriceX96AfterList",
        type: "uint160[]",
        internalType: "uint160[]",
      },
      {
        name: "initializedTicksCrossedList",
        type: "uint32[]",
        internalType: "uint32[]",
      },
      { name: "gasEstimate", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "quoteExactOutputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
        components: [
          { name: "tokenIn", type: "address", internalType: "address" },
          {
            name: "tokenOut",
            type: "address",
            internalType: "address",
          },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "fee", type: "uint24", internalType: "uint24" },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
    ],
    outputs: [
      { name: "amountIn", type: "uint256", internalType: "uint256" },
      {
        name: "sqrtPriceX96After",
        type: "uint160",
        internalType: "uint160",
      },
      {
        name: "initializedTicksCrossed",
        type: "uint32",
        internalType: "uint32",
      },
      { name: "gasEstimate", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "uniswapV3SwapCallback",
    inputs: [
      { name: "amount0Delta", type: "int256", internalType: "int256" },
      { name: "amount1Delta", type: "int256", internalType: "int256" },
      { name: "path", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "view",
  },
];

export const UNISWAP_V3_FACTORY_ABI = [
  {
    type: "function",
    name: "getPool",
    inputs: [
      { name: "tokenA", type: "address", internalType: "address" },
      { name: "tokenB", type: "address", internalType: "address" },
      { name: "fee", type: "uint24", internalType: "uint24" }
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  }
];

export const UNISWAP_V3_POOL_ABI = [
  {
    type: "function",
    name: "slot0",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160", internalType: "uint160" },
      { name: "tick", type: "int24", internalType: "int24" },
      { name: "observationIndex", type: "uint16", internalType: "uint16" },
      { name: "observationCardinality", type: "uint16", internalType: "uint16" },
      { name: "observationCardinalityNext", type: "uint16", internalType: "uint16" },
      { name: "feeProtocol", type: "uint8", internalType: "uint8" },
      { name: "unlocked", type: "bool", internalType: "bool" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "token0",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "token1",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "fee",
    inputs: [],
    outputs: [{ name: "", type: "uint24", internalType: "uint24" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "liquidity",
    inputs: [],
    outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
    stateMutability: "view"
  }
];

// Fee tiers
export const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.3%
  HIGH: 10000    // 1%
};

// Fee tier to tick spacing mapping
export const FEE_TO_TICK_SPACING = {
  [FEE_TIERS.LOWEST]: 1,
  [FEE_TIERS.LOW]: 10,
  [FEE_TIERS.MEDIUM]: 60,
  [FEE_TIERS.HIGH]: 200
};

// Subgraph endpoint
export const SUBGRAPH_URL = 'https://api.goldsky.com/api/public/project_cm5nst0b7iiqy01t6hxww7gao/subgraphs/sailfish-v3-occ-mainnet/1.0.0/gn';
