export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 在生产环境压缩 CSS
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeUnicode: false,
        }],
      },
    } : {}),
  },
};
