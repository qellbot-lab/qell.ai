"use client";

import { mockVaults } from "@/lib/data";
import { VaultCard } from "@/components/vault/VaultCard";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { motion } from "framer-motion";

/**
 * Pre-Deposits 页面 - Vault 列表（集成钱包连接）
 */
export default function VaultsPage() {
    return (
        <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto">
                {/* 顶部钱包连接 - 增加下边距 */}
                <div className="flex justify-end mb-12">
                    <WalletConnectButton />
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        <span className="text-white">Pre-</span>
                        <span className="text-gradient-brand pb-2">Deposits</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        Deposit your assets and earn yield automatically.{" "}
                        <a
                            href="#"
                            className="text-brand-blue hover:text-brand-purple transition-colors font-medium hover:underline underline-offset-4"
                        >
                            How it works
                        </a>
                    </p>
                </motion.div>

                {/* Vault List - 增加间距 */}
                <div className="grid gap-8">
                    {mockVaults.map((vault, index) => (
                        <VaultCard key={vault.id} vault={vault} index={index} />
                    ))}
                </div>

                {/* 底部装饰文字 */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-white/30 text-sm mt-24 font-light tracking-wide"
                >
                    More vaults coming soon...
                </motion.p>
            </div>
        </main>
    );
}

