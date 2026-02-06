import React from "react";
import type { WooFiSwapWidgetOptions } from "woofi-swap-widget-kit";
interface WooFiSwapWidgetReactProps extends Pick<WooFiSwapWidgetOptions, "evmProvider" | "currentChain" | "onConnectWallet" | "onChainSwitch" | "solanaProvider" | "config" | "brokerAddress"> {
}
export declare const WooFiSwapWidgetReact: ({ evmProvider, currentChain, onConnectWallet, onChainSwitch, solanaProvider, brokerAddress, config }: WooFiSwapWidgetReactProps) => React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export {};
