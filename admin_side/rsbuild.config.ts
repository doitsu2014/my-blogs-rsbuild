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
      remotes: {
        common_side: 'common_side@http://localhost:3003/mf-manifest.json',
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
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^7.9.0'
        },
      },
    }),
  ]
});
