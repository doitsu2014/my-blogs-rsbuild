import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { publicVars } = loadEnv();

export default defineConfig({
  server: {
    port: 3002
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  source: {
    // Expose PUBLIC_* environment variables to the client
    define: publicVars,
    // Pre-entry to load highlight.js globally before main app
    preEntry: ['./src/init-highlight.ts'],
  },
  plugins: [
    pluginReact(),
  ]
});
