"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { useState, useEffect, useCallback } from "react";
import {
    QUANTELL_VAULT_ADDRESS,
    USDC_ADDRESS,
    quantellVaultAbi,
    erc20Abi,
} from "@/lib/contracts";

/**
 * 获取 Vault 的链上数据
 */
export function useVaultData() {
    // 读取总存款 (TVL)
    const { data: totalDeposits, refetch: refetchTotalDeposits } = useReadContract({
        address: QUANTELL_VAULT_ADDRESS,
        abi: quantellVaultAbi,
        functionName: "totalDeposits",
    });

    // 读取 APR (基点)
    const { data: aprBasisPoints } = useReadContract({
        address: QUANTELL_VAULT_ADDRESS,
        abi: quantellVaultAbi,
        functionName: "aprBasisPoints",
    });

    // 读取最大存款容量
    const { data: maxTotalDeposits } = useReadContract({
        address: QUANTELL_VAULT_ADDRESS,
        abi: quantellVaultAbi,
        functionName: "maxTotalDeposits",
    });

    // 读取最小存款金额
    const { data: minDeposit } = useReadContract({
        address: QUANTELL_VAULT_ADDRESS,
        abi: quantellVaultAbi,
        functionName: "minDeposit",
    });

    return {
        tvl: totalDeposits ? Number(formatUnits(totalDeposits, 6)) : 0,
        apr: aprBasisPoints ? Number(aprBasisPoints) / 100 : 0, // 转换为百分比
        capacity: maxTotalDeposits ? Number(formatUnits(maxTotalDeposits, 6)) : 0,
        minDeposit: minDeposit ? Number(formatUnits(minDeposit, 6)) : 0,
        refetchTotalDeposits,
    };
}

/**
 * 获取用户在 Vault 中的仓位信息
 */
export function useUserPosition() {
    const { address, isConnected } = useAccount();

    // 读取用户余额 (本金 + 待领收益)
    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: QUANTELL_VAULT_ADDRESS,
        abi: quantellVaultAbi,
        functionName: "getBalance",
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address,
        },
    });

    // 读取用户详细信息
    const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
        address: QUANTELL_VAULT_ADDRESS,
        abi: quantellVaultAbi,
        functionName: "getUserInfo",
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address,
        },
    });

    // 读取用户 USDC 余额
    const { data: usdcBalance, refetch: refetchUsdcBalance } = useReadContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address,
        },
    });

    // 读取用户对 Vault 的 USDC 授权额度
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: address ? [address, QUANTELL_VAULT_ADDRESS] : undefined,
        query: {
            enabled: isConnected && !!address,
        },
    });

    const refetchAll = useCallback(() => {
        refetchBalance();
        refetchUserInfo();
        refetchUsdcBalance();
        refetchAllowance();
    }, [refetchBalance, refetchUserInfo, refetchUsdcBalance, refetchAllowance]);

    return {
        totalBalance: balance ? Number(formatUnits(balance, 6)) : 0,
        depositAmount: userInfo ? Number(formatUnits(userInfo[0], 6)) : 0,
        pendingRewards: userInfo ? Number(formatUnits(userInfo[2], 6)) : 0,
        claimedRewards: userInfo ? Number(formatUnits(userInfo[3], 6)) : 0,
        usdcBalance: usdcBalance ? Number(formatUnits(usdcBalance, 6)) : 0,
        allowance: allowance ? Number(formatUnits(allowance, 6)) : 0,
        isConnected,
        refetchAll,
    };
}

/**
 * 存款 Hook - 自动处理 Approve + Deposit 流程
 */
export function useDeposit() {
    const [status, setStatus] = useState<"idle" | "approving" | "depositing" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);
    const [pendingAmount, setPendingAmount] = useState<bigint | null>(null); // 存储待存款金额

    const { writeContract: approve, data: approveHash, isPending: isApproving, reset: resetApprove } = useWriteContract();
    const { writeContract: deposit, data: depositHash, isPending: isDepositing, reset: resetDeposit } = useWriteContract();

    const { isSuccess: approveSuccess, isError: approveError } = useWaitForTransactionReceipt({ hash: approveHash });
    const { isSuccess: depositSuccess, isError: depositError } = useWaitForTransactionReceipt({ hash: depositHash });

    // 监听 approve 成功后自动执行 deposit
    useEffect(() => {
        if (approveSuccess && status === "approving" && pendingAmount !== null) {
            console.log("Approve 成功，开始 Deposit...");
            setStatus("depositing");
            deposit({
                address: QUANTELL_VAULT_ADDRESS,
                abi: quantellVaultAbi,
                functionName: "deposit",
                args: [pendingAmount],
            });
        }
    }, [approveSuccess, status, pendingAmount, deposit]);

    // 监听 deposit 成功
    useEffect(() => {
        if (depositSuccess && status === "depositing") {
            console.log("Deposit 成功！");
            setStatus("success");
            setPendingAmount(null);
        }
    }, [depositSuccess, status]);

    // 监听错误
    useEffect(() => {
        if (approveError && status === "approving") {
            setStatus("error");
            setError("Approve 交易失败");
            setPendingAmount(null);
        }
        if (depositError && status === "depositing") {
            setStatus("error");
            setError("Deposit 交易失败");
            setPendingAmount(null);
        }
    }, [approveError, depositError, status]);

    const execute = useCallback(async (amount: number, currentAllowance: number) => {
        // 重置状态
        setStatus("idle");
        setError(null);
        resetApprove();
        resetDeposit();

        const amountWei = parseUnits(amount.toString(), 6);
        setPendingAmount(amountWei);

        try {
            // 如果授权额度不足，先 approve
            if (currentAllowance < amount) {
                console.log(`授权不足 (${currentAllowance} < ${amount})，先 Approve...`);
                setStatus("approving");
                approve({
                    address: USDC_ADDRESS,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [QUANTELL_VAULT_ADDRESS, amountWei],
                });
            } else {
                // 授权足够，直接 deposit
                console.log("授权足够，直接 Deposit...");
                setStatus("depositing");
                deposit({
                    address: QUANTELL_VAULT_ADDRESS,
                    abi: quantellVaultAbi,
                    functionName: "deposit",
                    args: [amountWei],
                });
            }
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Transaction failed");
            setPendingAmount(null);
        }
    }, [approve, deposit, resetApprove, resetDeposit]);

    // 重置函数
    const reset = useCallback(() => {
        setStatus("idle");
        setError(null);
        setPendingAmount(null);
        resetApprove();
        resetDeposit();
    }, [resetApprove, resetDeposit]);

    return {
        execute,
        reset,
        status,
        error,
        isApproving,
        isDepositing,
        isPending: isApproving || isDepositing,
    };
}

/**
 * 取款 Hook
 */
export function useWithdraw() {
    const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isSuccess, isError } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) {
            setStatus("success");
        }
        if (isError) {
            setStatus("error");
            setError("Transaction failed");
        }
    }, [isSuccess, isError]);

    const execute = useCallback(() => {
        setStatus("pending");
        setError(null);

        try {
            writeContract({
                address: QUANTELL_VAULT_ADDRESS,
                abi: quantellVaultAbi,
                functionName: "withdraw",
            });
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Transaction failed");
        }
    }, [writeContract]);

    return {
        execute,
        status,
        error,
        isPending,
    };
}
