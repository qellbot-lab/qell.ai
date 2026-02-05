"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Info, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { mockVaults } from "@/lib/data";
import { formatCompactNumber, formatPercentage, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AmountSlider } from "@/components/ui/AmountSlider";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { notFound } from "next/navigation";
import { arbitrum } from "wagmi/chains";
import { USDC_ADDRESS } from "@/lib/contracts";
import { useVaultData, useUserPosition, useDeposit, useWithdraw } from "@/hooks/useQuantellVault";

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Vault 详情页 - 优化版 UI
 */
export default async function VaultDetailPage({ params }: PageProps) {
    const { id } = await params;
    const vault = mockVaults.find((v) => v.id === id);

    if (!vault) {
        notFound();
    }

    return <VaultDetailClient vault={vault} />;
}

function VaultDetailClient({ vault }: { vault: (typeof mockVaults)[0] }) {
    const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
    const [amount, setAmount] = useState(0);

    // 使用真实钱包状态
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    // 获取链上 Vault 数据
    const { tvl, apr, capacity, minDeposit: vaultMinDeposit, refetchTotalDeposits } = useVaultData();

    // 获取用户仓位信息
    const { totalBalance: userVaultBalance, depositAmount, pendingRewards, usdcBalance, allowance, refetchAll } = useUserPosition();

    // 获取用户 USDC 余额 (兼容原有逻辑)
    const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
        address: address,
        token: USDC_ADDRESS,
        chainId: arbitrum.id,
    });

    // 合约交互 Hooks
    const { execute: executeDeposit, status: depositStatus, isPending: isDepositPending } = useDeposit();
    const { execute: executeWithdraw, status: withdrawStatus, isPending: isWithdrawPending } = useWithdraw();

    // 用户余额（从链上读取或默认为 0）
    const userBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    const minDeposit = vaultMinDeposit || 100; // 从合约读取或默认
    const canDeposit = amount >= minDeposit && amount <= userBalance;
    const estimatedYield = (amount * (apr || vault.apr)) / 100;

    // 当余额变化时，如果输入金额超过余额则重置
    useEffect(() => {
        if (amount > userBalance && userBalance > 0) {
            setAmount(userBalance);
        }
    }, [userBalance, amount]);

    // 交易成功后刷新数据
    useEffect(() => {
        if (depositStatus === "success" || withdrawStatus === "success") {
            refetchAll();
            refetchTotalDeposits();
            setAmount(0);
        }
    }, [depositStatus, withdrawStatus, refetchAll, refetchTotalDeposits]);

    // 按钮状态判断 (Deposit)
    const getDepositButtonState = () => {
        if (!isConnected) return { variant: "primary" as const, text: "Connect Wallet", disabled: false, action: "connect" };
        if (isBalanceLoading) return { variant: "secondary" as const, text: "Loading...", disabled: true, action: "none" };
        if (isDepositPending) return { variant: "secondary" as const, text: "Processing...", disabled: true, action: "none", icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (depositStatus === "success") return { variant: "primary" as const, text: "Success!", disabled: true, action: "none", icon: <CheckCircle className="w-5 h-5" /> };
        if (amount === 0) return { variant: "secondary" as const, text: "Enter Amount", disabled: true, action: "none" };
        if (amount < minDeposit) return { variant: "error" as const, text: `Minimum is ${minDeposit} ${vault.asset}`, disabled: true, action: "none" };
        if (amount > userBalance) return { variant: "error" as const, text: "Insufficient Balance", disabled: true, action: "none" };
        return { variant: "primary" as const, text: allowance >= amount ? "Deposit" : "Approve & Deposit", disabled: false, action: "deposit" };
    };

    // 按钮状态判断 (Withdraw)
    const getWithdrawButtonState = () => {
        if (!isConnected) return { variant: "primary" as const, text: "Connect Wallet", disabled: false, action: "connect" };
        if (isWithdrawPending) return { variant: "secondary" as const, text: "Processing...", disabled: true, action: "none", icon: <Loader2 className="w-5 h-5 animate-spin" /> };
        if (withdrawStatus === "success") return { variant: "primary" as const, text: "Withdrawn!", disabled: true, action: "none", icon: <CheckCircle className="w-5 h-5" /> };
        if (depositAmount === 0) return { variant: "secondary" as const, text: "No Position", disabled: true, action: "none" };
        return { variant: "primary" as const, text: "Withdraw All", disabled: false, action: "withdraw" };
    };

    const buttonState = activeTab === "deposit" ? getDepositButtonState() : getWithdrawButtonState();

    const handleButtonClick = () => {
        if (buttonState.action === "connect" && openConnectModal) {
            openConnectModal();
        } else if (buttonState.action === "deposit") {
            executeDeposit(amount, allowance);
        } else if (buttonState.action === "withdraw") {
            executeWithdraw();
        }
    };

    // 玻璃卡片通用样式 - 更通透
    const glassCardClass = cn(
        "relative",
        "bg-[rgba(255,255,255,0.02)] backdrop-blur-[24px]",
        "border border-white/5 rounded-[24px]",
        "shadow-glass hover:shadow-double-halo transition-all duration-300"
    );

    return (
        <main className="min-h-screen px-4 py-12 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
                {/* 顶部导航栏 - 更严格的垂直对齐 */}
                <div className="flex items-center justify-between mb-12 h-12">
                    <Link href="/vaults">
                        <motion.button
                            whileHover={{ x: -4 }}
                            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:text-brand-blue transition-colors" />
                            <span className="font-medium tracking-wide">Back to Vaults</span>
                        </motion.button>
                    </Link>

                    {/* 钱包连接按钮 */}
                    <WalletConnectButton />
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-6 mb-6">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-brand-gradient tracking-tight">
                            {vault.name}
                        </h1>
                        {vault.hasPointBooster && (
                            <span className="px-4 py-1.5 bg-status-success/10 border border-status-success/20 rounded-full text-sm text-status-success font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                                Point Booster
                            </span>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <span className="px-4 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-sm text-brand-blue font-medium">
                            {vault.asset}
                        </span>
                        <span className="px-4 py-1.5 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-sm text-brand-purple font-medium">
                            {vault.chain}
                        </span>
                    </div>
                </motion.div>

                {/* Stats Row - 等高卡片 */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                    {[
                        { label: "APR", value: formatPercentage(vault.apr), extra: vault.hasPointBooster ? "+ Points" : null },
                        { label: "TVL", value: formatCompactNumber(vault.tvl), extra: null },
                        { label: "Max Deposit", value: formatCompactNumber(vault.minDeposit), extra: null },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(glassCardClass, "p-6 flex flex-col justify-center h-32 hover:border-brand-blue/20")}
                        >
                            <p className="text-sm text-white/40 mb-2 font-medium tracking-wide uppercase">{stat.label}</p>
                            <p className="text-3xl font-bold flex items-baseline gap-3">
                                <span className={cn(
                                    // 修复渐变文本显示问题
                                    stat.label === "APR" ? "text-gradient-brand" : "text-white"
                                )}>
                                    {stat.value}
                                </span>
                                {stat.extra && (
                                    <span className="text-xs text-status-success font-semibold px-2 py-0.5 rounded border border-status-success/20 bg-status-success/5">{stat.extra}</span>
                                )}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Interaction Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs - 优化样式 */}
                        <div className="flex gap-8 border-b border-white/5 pb-1 ml-2">
                            {(["deposit", "withdraw"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "pb-4 px-2 font-semibold text-lg transition-all duration-300 relative",
                                        activeTab === tab
                                            ? "text-brand-blue"
                                            : "text-white/40 hover:text-white/80"
                                    )}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue shadow-[0_0_10px_#5E84E8]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Amount Input Panel */}
                        <div className={cn(glassCardClass, "p-8 hover:border-brand-blue/20")}>
                            {/* 顶部高光 */}
                            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent" />

                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm text-white/50 font-medium">Amount to {activeTab}</p>
                                {isConnected && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-white/40">Balance:</span>
                                        <span className="text-white/90 font-mono">
                                            {isBalanceLoading ? "..." : `${userBalance.toFixed(2)} ${vault.asset}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 金额输入行 */}
                            <div className="flex items-end gap-4 mb-2">
                                <input
                                    type="number"
                                    value={amount || ""}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setAmount(Math.min(val, userBalance || Infinity));
                                    }}
                                    disabled={!isConnected}
                                    className={cn(
                                        "flex-1 text-6xl font-bold bg-transparent border-none outline-none tracking-tight",
                                        "text-white placeholder:text-white/10", // 输入文字改为白色，更清晰
                                        "disabled:opacity-50",
                                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    )}
                                    placeholder="0"
                                />
                                <div className="text-right pb-3">
                                    <span className="text-2xl font-bold text-brand-blue block">{vault.asset}</span>
                                    <span className="text-sm text-white/40 font-medium">≈ ${amount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Slider */}
                            <div className="mt-8 mb-4">
                                <AmountSlider
                                    value={amount}
                                    max={userBalance || 0}
                                    onChange={setAmount}
                                    onMax={() => setAmount(userBalance)}
                                    disabled={!isConnected || userBalance === 0}
                                    asset={vault.asset}
                                />
                            </div>

                            {/* 最小存款警告 */}
                            {isConnected && amount > 0 && amount < minDeposit && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-4 flex items-center gap-2 text-status-error text-sm font-medium bg-status-error/10 p-3 rounded-lg border border-status-error/10"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Minimum deposit is {minDeposit} {vault.asset}</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Vault Capacity */}
                        <div className={cn(glassCardClass, "p-8")}>
                            <h4 className="text-sm text-white/50 font-medium mb-4 uppercase tracking-wide">Vault Capacity</h4>
                            <ProgressBar current={vault.tvl} total={vault.capacity} accentColor="brand" />
                            <div className="flex justify-between mt-2 text-sm font-mono text-white/40">
                                <span>{formatPercentage((vault.tvl / vault.capacity) * 100)} Filled</span>
                                <span>{formatCompactNumber(vault.capacity)} Cap</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div>
                            <Button
                                onClick={handleButtonClick}
                                variant={buttonState.variant}
                                disabled={buttonState.disabled}
                                className="w-full py-5 text-xl font-bold shadow-lg shadow-brand-blue/10 rounded-xl"
                            >
                                {buttonState.text}
                            </Button>
                        </div>

                        {/* Yield Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className={cn(glassCardClass, "p-6")}>
                                <span className="text-sm text-white/50 block mb-1">Est. Yearly Yield</span>
                                <span className="text-xl font-semibold text-transparent bg-clip-text bg-brand-gradient">
                                    ${estimatedYield.toFixed(2)}
                                </span>
                            </div>
                            <div className={cn(glassCardClass, "p-6")}>
                                <span className="text-sm text-white/50 block mb-1">Points Reward</span>
                                <span className="text-xl font-semibold text-status-success">Point Booster</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Your Position */}
                    <div className="lg:col-span-1">
                        <div className={cn(glassCardClass, "p-8 sticky top-8 min-h-[400px] flex flex-col")}>
                            {/* 顶部高光 */}
                            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent" />

                            <h3 className="text-lg font-semibold mb-8 border-b border-white/5 pb-4">Your Position</h3>

                            <div className="flex-1 flex flex-col justify-center items-center">
                                {!isConnected || vault.userPosition === 0 ? (
                                    <div className="text-center">
                                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-center shadow-inner">
                                            <Info className="w-8 h-8 text-brand-purple/40" />
                                        </div>
                                        <p className="text-white/60 mb-2 font-medium">No Position Yet</p>
                                        <p className="text-sm text-white/30 max-w-[200px] mx-auto leading-relaxed">
                                            {isConnected ? "Deposit assets to start earning yield and points." : "Connect wallet to view your position."}
                                        </p>
                                        {!isConnected && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-6 text-brand-blue hover:text-brand-purple"
                                                onClick={() => openConnectModal && openConnectModal()}
                                            >
                                                Connect Now
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full text-center">
                                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-brand-gradient mb-3 tracking-tighter">
                                            {formatCompactNumber(vault.userPosition!)}
                                        </p>
                                        <p className="text-sm text-white/40 uppercase tracking-widest">Staked {vault.asset}</p>

                                        <div className="mt-12 space-y-4 w-full">
                                            <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                                <span className="text-white/40">Claimable Yield</span>
                                                <span className="text-status-success font-mono">+$0.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm border-b border-white/5 pb-3">
                                                <span className="text-white/40">Total Points</span>
                                                <span className="text-brand-purple font-mono">0 XP</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={cn(glassCardClass, "mt-12 p-8")}
                >
                    <h3 className="text-xl font-semibold mb-4 text-white">About {vault.name}</h3>
                    <p className="text-white/50 leading-relaxed max-w-4xl">{vault.description}</p>
                </motion.div>
            </div>
        </main>
    );
}
