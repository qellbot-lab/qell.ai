'use client';

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';
import { ReactNode, useState } from 'react';

import '@rainbow-me/rainbowkit/styles.css';

/**
 * Web3 Providers 包装组件
 * 提供 Wagmi, RainbowKit, React Query 上下文
 */
export function Web3Provider({ children }: { children: ReactNode }) {
    // 确保 QueryClient 在客户端创建一次
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        // 自定义主题以匹配蓝紫渐变风格
                        accentColor: '#4D7CFF', // 品牌蓝
                        accentColorForeground: 'white',
                        borderRadius: 'large',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                    modalSize="compact"
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
