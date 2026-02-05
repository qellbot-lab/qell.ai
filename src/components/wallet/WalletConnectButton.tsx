'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wallet, ChevronDown, Power } from 'lucide-react';

/**
 * 自定义钱包连接按钮
 * 风格与现有 UI 保持一致（蓝紫渐变 + 玻璃拟态）
 */
export function WalletConnectButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            // 未连接状态
                            if (!connected) {
                                return (
                                    <motion.button
                                        onClick={openConnectModal}
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "relative px-6 py-3 rounded-xl font-semibold",
                                            "bg-brand-gradient text-white",
                                            "shadow-double-halo",
                                            "transition-all duration-300",
                                            "flex items-center gap-2",
                                            // 金属拉丝纹理
                                            "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(90deg,transparent_0px,rgba(255,255,255,0.03)_1px,transparent_2px)] before:pointer-events-none before:rounded-xl"
                                        )}
                                    >
                                        {/* 顶部高光 */}
                                        <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                        <Wallet className="w-5 h-5" />
                                        Connect Wallet
                                    </motion.button>
                                );
                            }

                            // 错误链状态
                            if (chain.unsupported) {
                                return (
                                    <motion.button
                                        onClick={openChainModal}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "px-6 py-3 rounded-xl font-semibold",
                                            "bg-status-error/20 border border-status-error/50",
                                            "text-status-error",
                                            "shadow-glow-pink",
                                            "flex items-center gap-2"
                                        )}
                                    >
                                        Wrong Network
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.button>
                                );
                            }

                            // 已连接状态
                            return (
                                <div className="flex items-center gap-2">
                                    {/* 链选择器 */}
                                    <motion.button
                                        onClick={openChainModal}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "px-4 py-3 rounded-xl",
                                            "bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]",
                                            "border border-brand-purple/20",
                                            "flex items-center gap-2",
                                            "hover:border-brand-blue/40 transition-colors"
                                        )}
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                className="w-5 h-5 rounded-full overflow-hidden"
                                                style={{ background: chain.iconBackground }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        className="w-5 h-5"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <span className="text-sm text-white/80">{chain.name}</span>
                                        <ChevronDown className="w-4 h-4 text-white/50" />
                                    </motion.button>

                                    {/* 账户信息 */}
                                    <motion.button
                                        onClick={openAccountModal}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "px-4 py-3 rounded-xl",
                                            "bg-brand-gradient",
                                            "shadow-double-halo",
                                            "flex items-center gap-3",
                                            "relative overflow-hidden"
                                        )}
                                    >
                                        {/* 顶部高光 */}
                                        <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                                        {/* 余额 */}
                                        {account.displayBalance && (
                                            <span className="text-sm font-medium">
                                                {account.displayBalance}
                                            </span>
                                        )}

                                        {/* 地址 */}
                                        <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded-lg">
                                            {account.displayName}
                                        </span>

                                        <Power className="w-4 h-4 text-white/70" />
                                    </motion.button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
