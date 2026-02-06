import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import fs from "fs";
import path from "path";

function loadConfigTitle(): string {
  try {
    const configPath = path.join(__dirname, "public/config.js");
    if (!fs.existsSync(configPath)) {
      return "Orderly Network";
    }

    const configText = fs.readFileSync(configPath, "utf-8");
    const jsonText = configText
      .replace(/window\.__RUNTIME_CONFIG__\s*=\s*/, "")
      .replace(/;$/, "")
      .trim();

    const config = JSON.parse(jsonText);
    return config.VITE_ORDERLY_BROKER_NAME || "Orderly Network";
  } catch (error) {
    console.warn("Failed to load title from config.js:", error);
    return "Orderly Network";
  }
}

function htmlTitlePlugin(): Plugin {
  const title = loadConfigTitle();
  console.log(`Using title from config.js: ${title}`);

  return {
    name: "html-title-transform",
    transformIndexHtml(html) {
      return html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    },
  };
}

export default defineConfig(() => {
  const basePath = process.env.PUBLIC_PATH || "/";

  return {
    base: basePath,
    plugins: [
      react(),
      tsconfigPaths(),
      htmlTitlePlugin(),
      cjsInterop({
        dependencies: ["bs58", "@coral-xyz/anchor", "lodash"],
      }),
      nodePolyfills({
        include: ["buffer", "crypto", "stream", "path", "fs", "http", "https", "zlib", "vm"],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    resolve: {
      alias: {
        // 解决 @layerzerolabs/lz-utilities 在浏览器中使用 Node.js 模块的问题
        fs: "rollup-plugin-node-polyfills/polyfills/empty",
        path: "rollup-plugin-node-polyfills/polyfills/path",
      },
    },
    build: {
      outDir: "build/client",
      rollupOptions: {
        // 自动为缺失的导出创建空占位符（解决 @layerzerolabs/lz-utilities 依赖 Node.js fs 模块的问题）
        shimMissingExports: true,
        onwarn(warning, warn) {
          // 忽略循环依赖警告
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          // 忽略 PURE 注释警告
          if (warning.message?.includes('/*#__PURE__*/')) return;
          // 忽略 shimMissingExports 相关警告
          if (warning.code === 'SHIMMED_EXPORT') return;
          warn(warning);
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
