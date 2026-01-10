import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    // Set DaisyUI theme on the html element
    template: './index.html',
  },
  server: {
    port: 3001,
  },
  source: {
    entry: {
      index: './src/index.client.tsx',
    },
  },
  output: {
    distPath: {
      root: 'dist/client',
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  plugins: [
    pluginReact(),
  ]
});
