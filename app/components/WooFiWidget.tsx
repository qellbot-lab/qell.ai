import { useCallback, useEffect, useRef } from "react";
import { useWalletConnector } from "@orderly.network/hooks";
import { WooFiSwapWidgetReact } from "@/components/woofi-swap-widget-kit/dist/react";
import { getRuntimeConfig } from "../utils/runtime-config";

import "@/components/woofi-swap-widget-kit/dist/style.css";
import "../styles/woofi-widget.css";

export default function WooFiWidget() {
  const { wallet, setChain, connectedChain, connect } = useWalletConnector();
  const brokerAddress = getRuntimeConfig("VITE_BROKER_EOA_ADDRESS") || "";
  const widgetWrapperRef = useRef<HTMLDivElement>(null);

  const handleConnectWallet = useCallback(() => {
    connect();
  }, [connect]);

  const handleChainSwitch = useCallback(
    (targetChain: { chainName: string; chainId?: string; key: string }) => {
      if (targetChain.chainId) {
        setChain({ chainId: Number(targetChain.chainId) });
      }
    },
    [setChain]
  );

  useEffect(() => {
    const wrapper = widgetWrapperRef.current;
    if (!wrapper) return;

    const stripRingClasses = () => {
      const ring = wrapper.querySelector("#header-ring");
      if (!ring) return;
      ring.classList.remove("ring", "touch", "no-style");
    };

    stripRingClasses();
    const observer = new MutationObserver(stripRingClasses);
    observer.observe(wrapper, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={widgetWrapperRef}>
      <WooFiSwapWidgetReact
        evmProvider={wallet?.provider}
        currentChain={connectedChain?.id}
        onConnectWallet={handleConnectWallet}
        onChainSwitch={handleChainSwitch}
        brokerAddress={brokerAddress}
        config={{
          enableLinea: false,
          enableMerlin: false,
          enableHyperevm: false,
          enableZksync: false,
        }}
      />
    </div>
  );
}

