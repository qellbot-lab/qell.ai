import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background-start)",
        foreground: "var(--foreground)",
        // 深邃靛蓝至暗紫色系
        dark: {
          base: "#0B0823",
          surface: "#0D0A2A",
          elevated: "#130F35",
        },
        // 品牌蓝紫渐变色 - 更沉稳高级
        brand: {
          blue: "#5E84E8", // 从 #4D7CFF 调整为略带灰度的蓝
          purple: "#9461BD", // 从 #9D50BB 调整为更柔和的紫
        },
        // 状态色
        status: {
          success: "#2DD4BF", // 平静的蓝绿色 (Verified Teal)
          error: "#F43F5E",   // 柔和的珊瑚红 (Rose)
        },
        // 保留旧的 primary 以兼容
        primary: {
          purple: "#9461BD",
          blue: "#5E84E8",
          cyan: "#2DD4BF",
        },
        accent: {
          cyan: "#2DD4BF",
          pink: "#F43F5E",
        },
      },
      boxShadow: {
        // 玻璃卡片基础阴影
        "glass": "0 0 0 1px rgba(94, 132, 232, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)",
        // 双层光晕：更柔和
        "double-halo": `
          0 0 30px rgba(148, 97, 189, 0.15),
          0 0 10px rgba(94, 132, 232, 0.25)
        `,
        "double-halo-hover": `
          0 0 50px rgba(148, 97, 189, 0.25),
          0 0 20px rgba(94, 132, 232, 0.35),
          0 0 80px rgba(148, 97, 189, 0.1)
        `,
        // 成功状态光晕
        "glow-cyan": "0 0 20px rgba(45, 212, 191, 0.3), 0 0 40px rgba(45, 212, 191, 0.1)",
        // 错误状态光晕
        "glow-pink": "0 0 20px rgba(244, 63, 94, 0.3), 0 0 40px rgba(244, 63, 94, 0.1)",
        // 滑块手柄呼吸光晕
        "slider-thumb": `
          0 0 8px rgba(94, 132, 232, 0.5),
          0 0 20px rgba(148, 97, 189, 0.3)
        `,
      },
      backgroundImage: {
        // 品牌渐变 - 降低饱和度，更线性
        "brand-gradient": "linear-gradient(135deg, #5E84E8 0%, #9461BD 100%)",
        "brand-gradient-reverse": "linear-gradient(135deg, #9461BD 0%, #5E84E8 100%)",
        // 卡片内部微光
        "card-glow": "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
        // 金属拉丝纹理（更细腻）
        "metal-texture": `
          linear-gradient(135deg, rgba(94, 132, 232, 0.9) 0%, rgba(148, 97, 189, 0.9) 100%),
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(255, 255, 255, 0.02) 1px,
            transparent 2px
          )
        `,
        // 禁用态
        "disabled-gradient": "linear-gradient(135deg, #1E1E2E 0%, #161622 100%)",
      },
      backdropBlur: {
        'glass': '24px',
      },
      animation: {
        'border-flow': 'border-flow 4s ease infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite', // 减慢呼吸频率
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(94, 132, 232, 0.5), 0 0 20px rgba(148, 97, 189, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 16px rgba(94, 132, 232, 0.7), 0 0 32px rgba(148, 97, 189, 0.5)'
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
