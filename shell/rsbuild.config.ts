import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@rsbuild/plugin-module-federation';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
      remotes: {
        homepage: 'homepage@http://localhost:3001/mf-manifest.json',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.1.1',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.1.1',
        },
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
