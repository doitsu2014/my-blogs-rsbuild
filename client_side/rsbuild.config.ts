import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    // Set DaisyUI theme on the html element
    htmlAttrs: {
      'data-theme': 'emerald',
    },
  },
  server: {
    port: 3001,
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
