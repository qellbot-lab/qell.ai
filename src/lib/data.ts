/**
 * Vault 数据类型定义
 */
export interface Vault {
    id: string;
    name: string;
    asset: "USDC" | "USDT" | "ETH";
    chain: "Arbitrum" | "Ethereum" | "Base";
    apr: number;
    hasPointBooster: boolean;
    tvl: number; // Total Value Locked
    capacity: number; // 最大容量
    minDeposit: number;
    userPosition?: number; // 用户已质押金额
    description?: string;
}

/**
 * Mock 数据：Vault 列表
 */
export const mockVaults: Vault[] = [
    {
        id: "genesis-usdc",
        name: "Quantell Genesis Vault - USDC",
        asset: "USDC",
        chain: "Arbitrum",
        apr: 10,
        hasPointBooster: true,
        tvl: 39490,
        capacity: 500000,
        minDeposit: 100,
        userPosition: 0,
        description:
            "Quantell Genesis Vault offers stable, predictable yield powered by stable yield farming strategy, designed for users who prioritize low-risk capital growth.",
    },
    {
        id: "luxe-usdc",
        name: "Quantell Luxe Vault - USDC",
        asset: "USDC",
        chain: "Arbitrum",
        apr: 30,
        hasPointBooster: true,
        tvl: 1000000,
        capacity: 1000000,
        minDeposit: 100000,
        userPosition: 0,
        description: "High-yield Quantell vault with advanced DeFi strategies.",
    },
];

/**
 * Mock 用户钱包数据
 */
export const mockWallet = {
    connected: false,
    address: "0x1234...5678",
    balances: {
        USDC: 841.1,
        USDT: 1200,
        ETH: 0.5,
    },
};
