# Woofi Swap Widget Kit

## Quick Start

### Installation

```
npm add woofi-swap-widget-kit

```

### Register Broker

To use the Woofi Swap Widget, you need to register a broker first. And pass the broker address to the widget.

### Evm Support

```
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useChainId, useSwitchChain, useWalletClient } from "wagmi";
import WoofiSwapWidgetReact from 'woofi-swap-widget-kit/react';
import 'woofi-swap-widget-kit/style.css';

const APP = () => {
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const { data: evmProvider } = useWalletClient();
  const chainId = useChainId();

  return (
    <WooFiSwapWidgetReact
      brokerAddress={brokerAddress}
      evmProvider={evmProvider}
      currentChain={chainId}
      onConnectWallet={openConnectModal}
      onChainSwitch={(targetChain) => {
        if (targetChain.chainId) {
          switchChain({ chainId: Number(targetChain.chainId) });
        }
      }}
    />
  );
}

```

### Solana Support

```
const App = () => {
  const [solanaProvider, setSolanaProvider] = useState<any>(null);

  useEffect(() => {
    const initSolana = async () => {
      const { solana } = window as any;
      await solana.connect({ onlyIfTrusted: true });
      if (solana.isConnected) {
        setSolanaProvider(solana);
      }
    };
    initSolana();
  }, []);

  return (
    <WooFiSwapWidgetReact
      ... same as above ...
      solanaProvider={solanaProvider}
      config={{
        enableSolana: true,
      }}
    />
  );
};
```

#### Vanilla JS Class

```
import WoofiSwapWidget from 'woofi-swap-widget-kit';
import 'woofi-swap-widget-kit/style.css';

const widget = new WoofiSwapWidget({
  evmProvider: window.ethereum,
  solanaProvider: window.solana,
  currentChain: '0x1',
  onConnectWallet: async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  },
  onChainSwitch: async (targetChain) => {
    if (targetChain.chainId) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(targetChain.chainId).toString(16)}` }],
      });
    }
  },
  config: {
    enableSolana: true,
  }
});
```

#### Supported Chains

The Woofi Swap Widget Kit supports multiple chains. You can get the list of supported chains from the `SUPPORTED_CHAINS` export.

```
import { SUPPORTED_CHAINS } from 'woofi-swap-widget-kit';

// e.g. [ { key: "ethereum", chainInfo: { chainId: "0x1" } }, ... ]
```

#### Config

The widget can be configured using the `config` option. The following options are available:

| Config Option  | Description                           | Default |
| -------------- | ------------------------------------- | ------- |
| enableSolana   | Enable Solana support in the widget   | false   |
| enableLinea    | Enable Linea support in the widget    | true    |
| enableMerlin   | Enable Merlin support in the widget   | true    |
| enableHyperevm | Enable HyperEVM support in the widget | true    |
| enableZksync   | Enable zkSync support in the widget   | true    |

### Notes

The `woofi-swap-widget-kit` depends on the Node.js globals Buffer and process.
When using it in a browser environment, make sure your bundler (e.g., Webpack or Vite) is configured with the appropriate polyfills.

#### For Vite, you can use the `vite-plugin-node-polyfills` plugin.

```
import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-polyfills';
export default defineConfig({
  plugins: [
    nodePolyfills(),
  ],
});
```

#### For Webpack, you can add the following configuration.

```
// npm install buffer process --save-dev
resolve: {
  fallback: {
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser'),
  },
},
plugins: [
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer'],
    process: 'process/browser',
  }),
],
```

## Demo

For a live demo, see the [woofi-swap-widget-demo](https://github.com/woonetwork/woofi-swap-widget-demo).
