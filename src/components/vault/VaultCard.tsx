"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Vault } from "@/lib/data";
import { formatCompactNumber, formatPercentage, cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { Coins } from "lucide-react";

interface VaultCardProps {
    vault: Vault;
    index: number;
}

/**
 * Vault 卡片组件 - 玻璃拟态 + 流光边框 + 双层光晕
 */
export function VaultCard({ vault, index }: VaultCardProps) {
    const { id, name, asset, apr, hasPointBooster, tvl, capacity, userPosition } = vault;
    const isLocked = id === "luxe-usdc"; // 锁定金库示例

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="relative group"
        >
            {/* 流光边框容器 */}
            <div
                className={cn(
                    "absolute -inset-[1px] rounded-[26px] opacity-40 group-hover:opacity-100 transition-opacity duration-500",
                    isLocked
                        ? "bg-gradient-to-br from-gray-600/20 to-purple-900/10"
                        : "bg-gradient-to-br from-brand-blue/40 via-brand-purple/30 to-brand-blue/20 animate-border-flow bg-[length:300%_100%]"
                )}
            />

            {/* 卡片主体 */}
            <div
                className={cn(
                    "relative",
                    // 玻璃拟态背景 - 更新为更通透的样式 (Ref: Detail Page)
                    "bg-[rgba(255,255,255,0.02)] backdrop-blur-[24px]",
                    "rounded-3xl p-8",
                    "border border-white/5", // 添加微弱边框
                    "transition-all duration-500 ease-out",
                    // 双层光晕
                    isLocked
                        ? "opacity-60"
                        : "shadow-glass group-hover:shadow-double-halo-hover" // 默认 shadow-glass, hover 增强
                )}
            >
                {/* 顶部高光线 - 调整为更细腻的样式 */}
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

                {/* Header: 名称 + Badge */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            "bg-gradient-to-br from-brand-blue/20 to-brand-purple/10",
                            "border border-white/5 shadow-inner"
                        )}>
                            <Coins className="w-6 h-6 text-brand-blue" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>
                            <p className="text-sm text-white/40 font-medium">{asset}</p>
                        </div>
                    </div>
                    {hasPointBooster && (
                        <span className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase",
                            "bg-status-success/10 border border-status-success/20 text-status-success shadow-[0_0_10px_rgba(45,212,191,0.15)]"
                        )}>
                            Point Booster
                        </span>
                    )}
                </div>

                {/* 数据指标 - 调整对齐和层级 */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                        <p className="text-xs text-white/40 mb-2 font-medium tracking-wide uppercase">APR</p>
                        <p className="text-2xl font-bold flex items-baseline gap-1.5">
                            <span className="text-gradient-brand">
                                {formatPercentage(apr)}
                            </span>
                            {hasPointBooster && (
                                <span className="text-[10px] text-status-success font-semibold border border-status-success/20 px-1 rounded transform -translate-y-1">XP</span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-white/40 mb-2 font-medium tracking-wide uppercase">TVL</p>
                        <p className="text-2xl font-bold text-white/90">{formatCompactNumber(tvl)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-white/40 mb-2 font-medium tracking-wide uppercase">Your Position</p>
                        <p className={cn(
                            "text-2xl font-bold",
                            userPosition ? "text-white/90" : "text-white/20"
                        )}>
                            {userPosition ? formatCompactNumber(userPosition) : "--"}
                        </p>
                    </div>
                </div>

                {/* 进度条 - 蓝紫渐变 */}
                <div className="mb-8 pl-1">
                    <ProgressBar current={tvl} total={capacity} accentColor="brand" />
                </div>

                {/* CTA 按钮 - 加宽加高 */}
                <Link href={`/vaults/${id}`} className="block">
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg shadow-lg group-hover:scale-[1.01] transition-transform"
                        disabled={isLocked}
                    >
                        {isLocked ? "Coming Soon" : "Deposit Now"}
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}

