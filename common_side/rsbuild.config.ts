import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  server: {
    port: 3003
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'common_side',
      exposes: {
        './Button': './src/components/Button.tsx',
        './Header': './src/components/Header.tsx',
        './Footer': './src/components/Footer.tsx',
        './LoadingSkeleton': './src/components/LoadingSkeleton.tsx',
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
