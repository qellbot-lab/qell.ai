"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AmountSliderProps {
    value: number;
    max: number;
    onChange: (value: number) => void;
    onMax?: () => void;
    disabled?: boolean;
    asset?: string;
}

/**
 * 资产数量滑块组件 - 深紫轨道 + 呼吸灯手柄 + 刻度点
 */
export function AmountSlider({
    value,
    max,
    onChange,
    onMax,
    disabled,
    asset = "USDC"
}: AmountSliderProps) {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onChange(Math.min(newValue, max));
    };

    const handleMaxClick = () => {
        if (onMax) {
            onMax();
        } else {
            onChange(max);
        }
    };

    // 刻度点配置
    const tickMarks = [
        { pct: 0, label: "0" },
        { pct: 25, label: "25" },
        { pct: 50, label: "50" },
        { pct: 75, label: "75" },
        { pct: 100, label: "Max" },
    ];

    // 检查当前值是否接近某个刻度
    const isNearTick = (tickPct: number) => {
        const currentPct = (value / max) * 100;
        return Math.abs(currentPct - tickPct) < 3;
    };

    return (
        <div className="space-y-4">
            <div className="relative pt-4 pb-2">
                {/* 刻度点 - 顶部标签 */}
                <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
                    {tickMarks.map((tick) => (
                        <button
                            key={tick.pct}
                            type="button"
                            onClick={() => onChange((max * tick.pct) / 100)}
                            disabled={disabled}
                            className={cn(
                                "text-[10px] font-medium transition-all duration-200",
                                isNearTick(tick.pct)
                                    ? "text-status-success"
                                    : "text-white/40 hover:text-white/70",
                                disabled && "cursor-not-allowed"
                            )}
                        >
                            {tick.label}
                        </button>
                    ))}
                </div>

                {/* 轨道容器 - 使用 Flexbox 确保垂直对齐 */}
                <div className="relative h-10 mt-5 mb-2 flex items-center">
                    {/* 轨道 */}
                    <div className="w-full h-2 bg-dark-elevated rounded-full overflow-hidden border border-brand-purple/20 relative z-0">
                        <motion.div
                            className="h-full bg-brand-gradient"
                            style={{ width: `${percentage}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>

                    {/* 隐藏的原生滑块 - 覆盖 */}
                    <input
                        type="range"
                        min="0"
                        max={max}
                        step="0.01"
                        value={value}
                        onChange={handleSliderChange}
                        disabled={disabled}
                        className={cn(
                            "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20",
                            disabled && "cursor-not-allowed"
                        )}
                    />

                    {/* 发光手柄 - 绝对定位垂直居中 */}
                    <motion.div
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full",
                            "bg-white border-2 border-brand-blue",
                            "pointer-events-none z-10 shadow-lg",
                            disabled ? "opacity-50" : "pulse-glow"
                        )}
                        style={{ left: `calc(${percentage}% - 10px)` }} // 减去半径以居中
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    />

                    {/* 刻度点 (圆点) - 绝对定位垂直居中 */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-0 px-[3px]">
                        {tickMarks.map((tick) => (
                            <div
                                key={tick.pct}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                    isNearTick(tick.pct)
                                        ? "bg-status-success shadow-glow-cyan scale-150"
                                        : "bg-white/10"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Balance 和 Max 标签行 */}
            <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">
                    Balance: <span className="text-white/80 font-medium">${max.toFixed(2)}</span>
                </span>
                <button
                    type="button"
                    onClick={handleMaxClick}
                    disabled={disabled}
                    className={cn(
                        "text-status-success hover:text-brand-blue font-semibold transition-colors",
                        "hover:underline underline-offset-2",
                        disabled && "opacity-50 cursor-not-allowed hover:no-underline"
                    )}
                >
                    Max: ${max.toFixed(2)}
                </button>
            </div>

            {/* 快捷百分比按钮 */}
            <div className="flex gap-2">
                {[25, 50, 75, 100].map((pct) => {
                    const isActive = Math.abs((value / max) * 100 - pct) < 1;
                    return (
                        <button
                            key={pct}
                            type="button"
                            onClick={() => onChange((max * pct) / 100)}
                            disabled={disabled}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300",
                                "border",
                                isActive
                                    ? "bg-brand-gradient text-white border-brand-blue/50 shadow-double-halo"
                                    : "bg-dark-surface/50 border-white/10 text-white/60 hover:border-brand-purple/40 hover:text-white",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {pct}%
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
