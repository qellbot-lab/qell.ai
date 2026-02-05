"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    current: number;
    total: number;
    className?: string;
    showLabel?: boolean;
    accentColor?: "green" | "purple" | "brand";
}

/**
 * 进度条组件（用于显示 Vault 容量）
 */
export function ProgressBar({
    current,
    total,
    className,
    showLabel = true,
    accentColor = "brand",
}: ProgressBarProps) {
    const percentage = Math.min((current / total) * 100, 100);
    const remaining = Math.max(total - current, 0);

    const colorVariants = {
        green: "bg-gradient-to-r from-status-success to-status-success/70",
        purple: "bg-gradient-to-r from-brand-purple to-brand-blue",
        brand: "bg-brand-gradient", // 蓝紫流光渐变
    };

    return (
        <div className={cn("space-y-2", className)}>
            {showLabel && (
                <div className="flex justify-between text-xs">
                    <span className="text-white/60">
                        {(remaining / 1000).toFixed(2)}K left
                    </span>
                    <span className="text-white/60">
                        {(current / 1000).toFixed(2)}K / {(total / 1000).toFixed(2)}K
                    </span>
                </div>
            )}
            {/* 深紫色轨道 */}
            <div className="h-2 bg-dark-elevated rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full", colorVariants[accentColor])}
                />
            </div>
        </div>
    );
}

