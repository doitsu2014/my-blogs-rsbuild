import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
      remotes: {
        homepage: 'homepage@http://localhost:3001/mf-manifest.json',
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
