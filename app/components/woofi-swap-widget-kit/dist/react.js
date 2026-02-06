import React, { useEffect, useRef } from "react";
// @ts-ignore
import { WooFiSwapWidget } from "woofi-swap-widget-kit";
export var WooFiSwapWidgetReact = function (_a) {
    var evmProvider = _a.evmProvider, currentChain = _a.currentChain, onConnectWallet = _a.onConnectWallet, onChainSwitch = _a.onChainSwitch, solanaProvider = _a.solanaProvider, brokerAddress = _a.brokerAddress, config = _a.config;
    var containerRef = useRef(null);
    var widgetRef = useRef(null);
    useEffect(function () {
        if (!containerRef.current)
            return;
        containerRef.current.innerHTML = "";
        // WooFiSwapWidget 里的 Vue app 会挂载到这个 div 上，并且会替换掉它的内容
        // 所以需要新建一个 div，而不是直接用 React 组件的 containerRef.current
        var mountDiv = document.createElement("div");
        containerRef.current.appendChild(mountDiv);
        widgetRef.current = new WooFiSwapWidget({
            container: mountDiv,
            brokerAddress: brokerAddress,
            onConnectWallet: onConnectWallet,
            onChainSwitch: onChainSwitch,
            currentChain: currentChain,
            evmProvider: evmProvider,
            solanaProvider: solanaProvider,
            config: config
        });
        return function () {
            var _a;
            if ((_a = widgetRef.current) === null || _a === void 0 ? void 0 : _a.destroy) {
                widgetRef.current.destroy();
            }
            widgetRef.current = null;
        };
    }, []);
    useEffect(function () {
        if (widgetRef.current) {
            widgetRef.current.updateEvmProvider(evmProvider);
        }
    }, [evmProvider]);
    useEffect(function () {
        if (solanaProvider && widgetRef.current) {
            widgetRef.current.updateSolanaProvider(solanaProvider);
        }
    }, [solanaProvider]);
    useEffect(function () {
        if (currentChain && widgetRef.current) {
            widgetRef.current.updateCurrentChain(currentChain);
        }
    }, [currentChain]);
    return React.createElement("div", {
        ref: containerRef,
    });
};
