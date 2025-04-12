# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.11] - 2025-04-11

### Added

- **PoolManager Class**: Added comprehensive functionality for managing liquidity pools
  - Initialize new pools with specified tokens and fee tiers
  - Add, increase, and decrease liquidity in pools
  - Collect fees earned from positions
  - View detailed portfolio information
  - Calculate price ranges for different strategies (narrow, common, wide, infinite)
  - Burn positions
  - Get detailed pool statistics

- **Native EDU Support**: Improved liquidity functions to handle native EDU when WEDU is involved
  - Added automatic handling of native EDU in `addLiquidity`, `deployLiquidity`, `increaseLiquidity`, and `decreaseLiquidity` functions
  - Implemented multicall pattern for better transaction efficiency and user experience
  - Added automatic unwrapping of WEDU to native EDU when removing liquidity
  - Updated documentation to clarify that WEDU represents EDU when dealing with liquidity

- **Pool Types**: Added type definitions for pool positions, portfolio, and various parameters needed for pool operations

- **Examples**: Added example files demonstrating how to use the PoolManager functionality
  - initialize-pool.js: Shows how to initialize a new pool with TOKEN and WEDU, including proper sqrtPriceX96 calculation
  - add-liquidity.js: Demonstrates adding liquidity to a pool with a specific price ratio (1,000 tokens = 1 EDU)
  - remove-liquidity.js: Shows how to remove a percentage of liquidity from an existing position
  - view-portfolio.js: Demonstrates how to view detailed portfolio information
  - collect-fees.js: Shows how to collect fees earned from a position
  - deploy-liquidity.js: Demonstrates deploying liquidity to a pool and calculating different price range strategies

### Changed

- Updated README.md to include information about the new PoolManager functionality
- Updated JSBI dependency to version 3.1.4 to ensure compatibility with the Uniswap SDK
- Ensured all examples use the correct token ordering:
  - TOKEN (0x83EDba5941A7Dd7EAf67ca852CD0Bda70d170116) as token0 (lower address)
  - WEDU (0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12) as token1 (higher address)
- Added proper sqrtPriceX96 calculation using encodePriceSqrt function in initialize-pool.js
- Removed internal token approval handling from liquidity functions, allowing for more flexibility in approval management
- Updated `addLiquidity`, `deployLiquidity`, `increaseLiquidity`, and `decreaseLiquidity` functions to use multicall for better transaction efficiency
- Added support for full range ticks from examples in liquidity functions

## [1.1.10] - Previous Release

Initial release of the SailFish DEX v3 SDK with the following features:
- Route Finding
- Quote Generation
- Fee Information
- Swap Execution
- Multi-hop Support
- Token Approval
- Token Bridging
- UI Components
