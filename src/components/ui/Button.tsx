"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "ghost" | "error";
    children: ReactNode;
    isLoading?: boolean;
}

/**
 * 通用按钮组件 - 蓝紫渐变 + 金属拉丝纹理
 */
export function Button({
    variant = "primary",
    children,
    className,
    disabled,
    isLoading,
    ...props
}: ButtonProps) {
    const baseStyles = cn(
        "relative px-6 py-3 rounded-xl font-semibold",
        "transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "overflow-hidden"
    );

    const variants = {
        // 主按钮：蓝紫渐变 + 微弱金属拉丝
        primary: cn(
            "bg-brand-gradient text-white",
            "shadow-double-halo",
            "hover:shadow-[0_0_40px_rgba(77,124,255,0.4),0_0_60px_rgba(157,80,187,0.3)]",
            // 金属拉丝纹理叠加
            "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(90deg,transparent_0px,rgba(255,255,255,0.03)_1px,transparent_2px)] before:pointer-events-none"
        ),
        // 次要按钮：透明带边框
        secondary: cn(
            "bg-dark-surface/50 backdrop-blur-sm",
            "border border-white/10",
            "text-white/80 hover:text-white",
            "hover:bg-dark-elevated/50 hover:border-brand-blue/30"
        ),
        // 幽灵按钮
        ghost: cn(
            "text-white/60 hover:text-white",
            "hover:bg-white/5"
        ),
        // 错误/禁用态：灰色渐变 + 霓虹粉提示
        error: cn(
            "bg-disabled-gradient text-white/60",
            "border border-status-error/30",
            "shadow-glow-pink"
        ),
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -1 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* 顶部高光线 */}
            {variant === "primary" && !disabled && (
                <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            )}

            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                </span>
            ) : (
                children
            )}
        </motion.button>
    );
}
