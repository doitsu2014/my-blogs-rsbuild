# Homepage Module

A **Module Federation 2.0 Remote Module** that exposes React components for consumption by the shell application. This module demonstrates how to build and expose micro-frontend components that can be dynamically loaded at runtime.

## 📋 Overview

The Homepage module is a standalone React application that serves as a **remote module** in the Module Federation architecture. It exposes components that can be consumed by other applications (like the shell app) without requiring a rebuild of the host application.

### Key Characteristics

- **Remote Module**: Exposes components via Module Federation
- **Port**: Runs on `http://localhost:3001`
- **Exposed Components**: `./App` component available for external consumption
- **Standalone**: Can run independently for development and testing
- **Shared Dependencies**: Uses singleton React instances to prevent version conflicts

## 🏗️ Module Federation Configuration

This module is configured as a **remote** in the Module Federation architecture:

```typescript
{
  name: 'homepage',
  exposes: {
    './App': './src/App.tsx',  // Exposed component
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  }
}
```

### Exposed Components

| Export Path | Source File   | Description             |
| ----------- | ------------- | ----------------------- |
| `./App`     | `src/App.tsx` | Main homepage component |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The module will be available at `http://localhost:3001` and can be consumed by the shell application.

### Build

Build for production:

```bash
pnpm build
```

This generates:

- Optimized production bundles
- Module Federation manifest (`mf-manifest.json`)
- Remote entry files for consumption

### Preview

Preview the production build:

```bash
pnpm preview
```

## 📦 Scripts

| Script    | Command              | Description                             |
| --------- | -------------------- | --------------------------------------- |
| `dev`     | `rsbuild dev --open` | Start development server with auto-open |
| `build`   | `rsbuild build`      | Build for production                    |
| `preview` | `rsbuild preview`    | Preview production build                |
| `lint`    | `eslint .`           | Lint code with ESLint                   |
| `format`  | `prettier --write .` | Format code with Prettier               |

## 🛠️ Technology Stack

- **React**: 19.1.x - UI framework
- **TypeScript**: 5.9.x - Type safety
- **Rsbuild**: 1.5.x - Build tool
- **Module Federation**: 0.21.x - Micro-frontend architecture
- **ESLint**: 9.x - Code linting
- **Prettier**: 3.x - Code formatting

## 📡 Consuming This Module

### In the Shell App

The shell application consumes this module using the manifest-based approach:

```typescript
// rsbuild.config.ts (shell)
{
  remotes: {
    homepage: 'homepage@http://localhost:3001/mf-manifest.json';
  }
}
```

### Dynamic Import

```typescript
import { lazy } from 'react';

const HomepageApp = lazy(() => import('homepage/App'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomepageApp />
    </Suspense>
  );
}
```

## 🔧 Configuration Files

### `rsbuild.config.ts`

- Configures Rsbuild and Module Federation plugin
- Sets server port to 3001
- Defines exposed components
- Configures shared dependencies

### `tsconfig.json`

- TypeScript configuration for React 19
- JSX transform configuration
- Path aliases and module resolution

### `eslint.config.mjs`

- ESLint 9 flat config format
- React and React Hooks rules
- TypeScript integration

## 🎯 Development Guidelines

### Adding New Exposed Components

1. Create your component in `src/`
2. Update `rsbuild.config.ts` to expose it:

```typescript
exposes: {
  './App': './src/App.tsx',
  './NewComponent': './src/NewComponent.tsx', // Add this
}
```

3. Rebuild the module
4. Update type definitions in the shell app

### Shared Dependencies

This module shares React and React-DOM with the host application using the **singleton pattern**. This ensures:

- Only one instance of React is loaded
- No version conflicts between modules
- Reduced bundle size
- Consistent state management

### Best Practices

- ✅ Keep exposed components self-contained
- ✅ Use TypeScript for type safety
- ✅ Test components in standalone mode
- ✅ Document component props and usage
- ✅ Use semantic versioning for releases
- ✅ Minimize external dependencies
- ⚠️ Avoid breaking changes to exposed APIs
- ⚠️ Keep bundle size optimized

## 🧪 Testing

Test the module independently:

```bash
# Start the dev server
pnpm dev

# In another terminal, verify the manifest
curl http://localhost:3001/mf-manifest.json
```

## 📚 Learn More

- [Module Federation Documentation](https://module-federation.io/guide/start/index.html)
- [Rsbuild Documentation](https://rsbuild.dev/)
- [React 19 Documentation](https://react.dev/)
- [Module Federation Remote Configuration](https://module-federation.io/configure/remotes.html)

## 🤝 Integration

This module is designed to work with:

- **Shell App**: Main host application (port 3000)
- **Other Remotes**: Can be combined with other micro-frontends

## 📝 Notes

- The module must be running for the shell app to consume it in development
- Production builds generate static manifests that can be deployed independently
- Changes to exposed components require a rebuild
- Type definitions are auto-generated for TypeScript support in consuming apps

---

Part of the **My Blogs** micro-frontend project
