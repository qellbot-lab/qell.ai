# 技术实现概览 (Technical Overview)

本文档详细介绍了 Orderly Earn 项目的当前技术架构、技术栈选择以及关键功能的实现细节。

## 1. 项目概述 (Project Overview)

Orderly Earn 是一个基于 Arbitrum 网络的 DeFi 收益聚合前端。用户可以存入 USDC 等资产，通过智能合约策略获得自动化的年化收益 (APR)。

**核心功能**：
- **存取款**：支持 USDC 的存入 (Deposit) 和取出 (Withdraw)。
- **收益展示**：实时显示 TVL (总锁仓量)、APR (年化收益率) 和用户持仓。
- **钱包连接**：集成 RainbowKit 支持多种 EVM 钱包。
- **高级 UI**：采用 Linear 风格的高级玻璃拟态设计体系。

## 2. 技术栈 (Tech Stack)

### 前端框架 (Frontend Core)
- **Next.js 16 (App Router)**: 使用最新的 React Server Components 架构，提供极佳的首屏加载性能和 SEO。
- **TypeScript**: 全项目严格类型检查，确保代码健壮性。
- **React 19**: 利用最新的 React Hooks 和并发特性。

### 样式与设计系统 (Styling)
- **Tailwind CSS v4**: 用于构建原子化 CSS，配合自定义配置 (`tailwind.config.ts`) 实现设计规范。
- **Framer Motion**: 用于实现复杂的交互动画（这是 Linear 风格的核心），如流光边框、平滑过渡等。
- **Design Tokens**: 在 `globals.css` 中定义了深色系品牌变量 (`--brand-blue`, `--brand-purple`) 和玻璃拟态效果。

### Web3 交互 (Web3 Integration)
- **Wagmi v2**: 提供了最现代化的 React Hooks (`useAccount`, `useReadContract`, `useWriteContract`) 用于区块链交互。
- **Viem**: 底层以太坊交互库，替代 ethers.js，体积更小，性能更强。
- **RainbowKit**: 提供了开箱即用的、美观的钱包连接 UI 组件。
- **TanStack Query (React Query)**: 管理链上数据的缓存、自动刷新和加载状态。

### 智能合约 (Smart Contract)
- **Solidity 0.8.20**: 合约开发语言。
- **OpenZeppelin**: 使用标准库 (`ERC20`, `Ownable`, `Pausable`, `ReentrancyGuard`) 确保安全性。

## 3. 前端架构详解

### 目录结构
```bash
src/
├── app/                 # Next.js App Router 页面
│   ├── layout.tsx       # 全局布局 (包含 Web3Provider)
│   ├── page.tsx         # 根路径重定向
│   ├── globals.css      # 全局样式与 Tailwind 变量
│   └── vaults/          # 核心业务模块
│       ├── page.tsx     # [列表页] 展示所有 Vault
│       └── [id]/        # [详情页] 单个 Vault 操作
├── components/          # 组件库
│   ├── ui/              # 基础 UI (Button, Slider, ProgressBar)
│   ├── vault/           # 业务组件 (VaultCard)
│   └── providers/       # 上下文 (Web3Provider)
├── lib/                 # 工具库
│   ├── utils.ts         # className 合并, 格式化函数
│   ├── wagmi.ts         # 链配置
│   └── data.ts          # 模拟数据/常量定义
```

### 关键组件设计

#### 1. 玻璃拟态设计系统 (Glassmorphism System)
为了实现“Linear 风格”，我们没有简单使用透明度，而是构建了一个复合图层系统：
- **背景层**：深邃的径向渐变 (`radial-gradient`) + 噪点纹理 (`bg-noise`)。
- **光效层**：使用 `ambient-light` 类在页面角落添加模糊的品牌色光晕。
- **卡片层**：`VaultCard` 组件使用了 `backdrop-blur-[24px]` 和微弱的白色边框 (`border-white/5`)，配合双层阴影 (`shadow-double-halo`) 制造深度感。

#### 2. 交互式滑块 (AmountSlider)
这是一个完全重构的自定义组件，解决了原生 input 的样式限制：
- **结构**：使用 Flexbox 容器实现了手柄 (Thumb)、轨道 (Track) 和刻度 (Ticks) 的绝对垂直居中。
- **动画**：使用 Framer Motion 实现拖动时的平滑弹簧动画。
- **反馈**：手柄带有呼吸灯效果 (`pulse-glow`)，刻度点在被经过时会高亮放大。

## 4. Web3 集成实现

### Provider 配置 (`src/components/providers/Web3Provider.tsx`)
我们封装了一个全局 Provider，它包裹了整个应用：
1. **WagmiProvider**: 注入链连接配置。
2. **QueryClientProvider**: 处理数据缓存。
3. **RainbowKitProvider**: 提供 UI 主题。

### 钱包连接
在 `globals.css` 中我们删除了 WalletConnect 的 Project ID 占位符（由用户在 Vercel 环境变量中配置），目前支持 Arbitrum One 主网。连接状态通过 Wagmi 的 `useAccount` 钩子实时监听，并在 `useEffect` 中处理 hydration 问题。

## 5. 智能合约架构 (QuantellVault)
 
目前的 `QuantellVault.sol` 是一个基于 ERC4626 思想简化的金库合约。

### 核心逻辑
- **Deposit**: 用户转入 USDC -> 合约记录 `userInfo[user].depositAmount`。
- **Yield**: 系统通过 `ratePerSecond` (每秒利率) 实时计算收益。
  - `APR 10%` = `1000 basis points`。
  - 收益计算公式：`Principal * Rate * TimeDelta`。
- **Withdraw**: 取款时，合约先计算待领取收益 (`pendingRewards`)，然后将 `Principal + Rewards` 一次性转回给用户。

### 安全机制
- **nonReentrant**: 防止重入攻击。
- **Pausable**: 紧急情况下管理员可以暂停存款。
- **SafeERC20**: 处理非标 ERC20 代币的转账返回值问题。

---

## 下一步技术规划
1. **前端对接合约**：
   - 生成合约 ABI 文件。
   - 使用 `useWriteContract` 替换当前的模拟 Log。
   - 使用 `useReadContract` 读取链上真实的 TVL 和 APR。
2. **多链支持**：配置 Wagmi 支持更多 L2 网络。
