import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { loadEnv } from '@rsbuild/core';

const { publicVars } = loadEnv();

const general_remotes = {
  client_side: 'client_side@http://localhost:3001/mf-manifest.json',
  admin_side: 'admin_side@http://localhost:3002/mf-manifest.json',
}

export default defineConfig({
  server: {
    port: 3000,
  },
  environments: {
    // CSR environment for admin_side
    admin_csr: {
      source: {
        entry: {
          index: './src/index.admin.client.tsx',
        },
        define: publicVars,
      },
      output: {
        target: 'web',
        distPath: {
          root: 'dist/admin',
        },
        assetPrefix: '/admin/',
      },
      plugins: [
        pluginReact(),
        pluginModuleFederation({
          name: 'shell_admin',
          remotes: {
            admin_side: general_remotes.admin_side,
          },
        }),
      ],
    },
    // SSR environment for client_side (SEO-optimized)
    client_ssr: {
      source: {
        entry: {
          index: './src/index.client.client.tsx',
        },
        define: publicVars,
      },
      output: {
        target: 'web',
        distPath: {
          root: 'dist/client',
        },
      },
      plugins: [
        pluginReact(),
        pluginModuleFederation({
          name: 'shell_client',
          remotes: {
            client_side: general_remotes.client_side,
          },
        }),
      ],
    },
    // SSR server bundle
    client_ssr_server: {
      source: {
        entry: {
          index: './src/index.client.server.tsx',
        },
        define: publicVars,
      },
      output: {
        target: 'node',
        distPath: {
          root: 'dist/server',
        },
        minify: false,
      },
      plugins: [
        pluginReact(),
      ],
    },
  },
});
