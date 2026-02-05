import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

/**
 * WalletConnect Cloud Project ID
 * 获取方式：https://cloud.walletconnect.com/
 * 注意：这个 ID 是公开的，不是敏感信息
 */
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfae8';

/**
 * Wagmi + RainbowKit 配置
 * 支持 Arbitrum 主网和测试网
 */
export const config = getDefaultConfig({
    appName: 'Quantell Earn',
    projectId: WALLETCONNECT_PROJECT_ID,
    chains: [arbitrum, arbitrumSepolia],
    ssr: true, // Next.js App Router 需要开启 SSR 模式
});

// 导出支持的链，用于 UI 显示
export const supportedChains = [arbitrum, arbitrumSepolia];

// 默认链
export const defaultChain = arbitrum;

