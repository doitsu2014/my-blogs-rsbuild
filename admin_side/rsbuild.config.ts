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
        // Main admin application
        './App': './src/App.tsx',
        // Admin layout for direct integration
        './AdminLayout': './src/app/admin/layout.tsx',
        // Admin pages for granular integration
        './Dashboard': './src/app/admin/page.tsx',
        './CategoriesList': './src/app/admin/categories/page.tsx',
        './BlogsList': './src/app/admin/blogs/page.tsx',
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
