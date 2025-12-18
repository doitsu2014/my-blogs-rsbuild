import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  server: {
    port: 3002
  },
  source: {
    alias: {
      '@': './src',
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'admin_side',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0'
        },
      },
    }),
  ]
});
