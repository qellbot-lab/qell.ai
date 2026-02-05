/**
 * QuantellVault 合约配置
 * 部署在 Arbitrum One 网络
 */

// Arbitrum One 上的 USDC 合约地址
export const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" as const;

// 已部署的 QuantellVault 合约地址
export const QUANTELL_VAULT_ADDRESS = "0x558A4A393524485D20f516fe11EDA007b6E28038" as const;

// QuantellVault ABI (仅包含前端交互所需的函数)
export const quantellVaultAbi = [
    // ============ 用户函数 ============
    {
        name: "deposit",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "amount", type: "uint256" }],
        outputs: [],
    },
    {
        name: "withdraw",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },
    {
        name: "claimRewards",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },

    // ============ 查询函数 ============
    {
        name: "getBalance",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getPendingRewards",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getUserInfo",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [
            { name: "depositAmount", type: "uint256" },
            { name: "depositTimestamp", type: "uint256" },
            { name: "pendingRewards", type: "uint256" },
            { name: "claimedRewards", type: "uint256" },
        ],
    },
    {
        name: "totalDeposits",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "aprBasisPoints",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "minDeposit",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "maxTotalDeposits",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getRewardsPoolBalance",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },

    // ============ 事件 ============
    {
        name: "Deposited",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
        ],
    },
    {
        name: "Withdrawn",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "principal", type: "uint256", indexed: false },
            { name: "rewards", type: "uint256", indexed: false },
        ],
    },
    {
        name: "RewardsClaimed",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "rewards", type: "uint256", indexed: false },
        ],
    },
] as const;

// 标准 ERC20 ABI (用于 USDC approve)
export const erc20Abi = [
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "decimals",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
    },
] as const;
