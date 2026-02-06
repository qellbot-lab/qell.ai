import Vue from 'vue';
export interface ChainInfo {
    chainName: string;
    chainId?: string;
    key: string;
}
export interface WidgetConfig {
    enableSolana?: boolean;
    enableLinea?: boolean;
    enableMerlin?: boolean;
    enableHyperevm?: boolean;
    enableZksync?: boolean;
}
export interface WooFiSwapWidgetOptions {
    container: string | HTMLElement;
    evmProvider?: any;
    solanaProvider?: any;
    currentChain?: string | number;
    onConnectWallet?: (config: {
        network: string;
    }) => void;
    onChainSwitch?: (targetChain: ChainInfo) => void;
    brokerAddress: string;
    config?: WidgetConfig;
}
declare const widgetState: {
    evmProvider: any;
    solanaProvider: any;
    currentChain: string | number | undefined;
    config: WidgetConfig;
};
export declare class WooFiSwapWidget {
    container: WooFiSwapWidgetOptions['container'];
    vm: Vue | null;
    widgetState: typeof widgetState;
    constructor(options: WooFiSwapWidgetOptions);
    updateEvmProvider(evmProvider?: any): void;
    updateSolanaProvider(solanaProvider?: any): void;
    updateCurrentChain(currentChain: WooFiSwapWidgetOptions['currentChain']): void;
    render(): void;
    destroy(): void;
}
export declare const SUPPORTED_CHAINS: any;
export {};
