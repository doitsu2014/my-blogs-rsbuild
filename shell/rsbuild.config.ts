import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { loadEnv } from '@rsbuild/core';

const { publicVars } = loadEnv();

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
      remotes: {
        'client_side': 'client_side@http://localhost:3001/mf-manifest.json',
      },
    }),
  ],
  server: {
    port: 3000,
  },
  source: {
    define: publicVars
  }
});
