export declare const BSC_ABI: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    inputs: ({
        internalType: string;
        name: string;
        type: string;
        components?: undefined;
    } | {
        components: {
            internalType: string;
            name: string;
            type: string;
        }[];
        internalType: string;
        name: string;
        type: string;
    })[];
    name: string;
    outputs: never[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];
export declare const ADDRESSES: {
    WEDU: string;
    UNIVERSAL_ROUTER: string;
    PERSONAL_ASSET_MANAGER_FACTORY: string;
    ASSET_HELPER: string;
    UNISWAP_V3_FACTORY: string;
    NONFUNGIBLE_POSITION_MANAGER: string;
    SWAP_ROUTER: string;
    QUOTER: string;
    QUOTER_V2: string;
    TICK_LENS: string;
    USDC: string;
};
export declare const CHAIN_ID = 41923;
export declare const RPC_URL = "https://rpc.edu-chain.raas.gelato.cloud";
export declare const MAX_INT128: bigint;
export declare const MAX_UINT256: bigint;
export declare const ROUTER_ABI: ({
    type: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    name?: undefined;
    outputs?: undefined;
} | {
    type: string;
    stateMutability: string;
    inputs?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
        components: {
            name: string;
            type: string;
            internalType: string;
        }[];
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
})[];
export declare const ERC20_ABI: string[];
export declare const QUOTER_V2_ABI: ({
    type: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    name?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
        components: {
            name: string;
            type: string;
            internalType: string;
        }[];
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
})[];
export declare const UNISWAP_V3_FACTORY_ABI: {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
}[];
export declare const NFT_POSITION_MANGER_ABI: ({
    type: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    type: string;
    stateMutability: string;
    inputs?: undefined;
    name?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
        components: {
            name: string;
            type: string;
            internalType: string;
        }[];
    }[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        indexed: boolean;
        internalType: string;
    }[];
    anonymous: boolean;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    inputs: never[];
    stateMutability?: undefined;
    outputs?: undefined;
    anonymous?: undefined;
})[];
export declare const UNISWAP_V3_POOL_ABI: {
    type: string;
    name: string;
    inputs: never[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
}[];
export declare const FEE_TIERS: {
    LOWEST: number;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
};
export declare const FEE_TO_TICK_SPACING: {
    [FEE_TIERS.LOWEST]: number;
    [FEE_TIERS.LOW]: number;
    [FEE_TIERS.MEDIUM]: number;
    [FEE_TIERS.HIGH]: number;
};
export declare const SUBGRAPH_URL = "https://api.goldsky.com/api/public/project_cm1s79wa2tlb701tbchmeaflf/subgraphs/sailfish-v3-occ-mainnet/1.0.3/gn";
