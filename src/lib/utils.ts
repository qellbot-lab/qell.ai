import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名，避免冲突
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 格式化数字为紧凑格式 (e.g. 1000 -> 1K, 1000000 -> 1M)
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toFixed(2);
}

/**
 * 格式化货币（带美元符号）
 */
export function formatCurrency(num: number): string {
    return `$${formatCompactNumber(num)}`;
}

/**
 * 格式化百分比
 */
export function formatPercentage(num: number): string {
    return `${num.toFixed(2)}%`;
}
