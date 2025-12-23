# Common Side - Shared Components Module

A micro-frontend module that exposes shared UI components for use across the my-blogs-rsbuild project.

## 🎯 Purpose

This module serves as a centralized library of reusable UI components that can be consumed by both `client_side` and `admin_side` modules through Module Federation.

## 🚀 Running the Module

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# Runs on http://localhost:3003

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📦 Exposed Components

### 1. Button (`./Button`)
A reusable button component with multiple variants.

**Props:**
- `children`: React.ReactNode
- `onClick?`: () => void
- `variant?`: 'primary' | 'secondary' | 'danger'
- `disabled?`: boolean
- `type?`: 'button' | 'submit' | 'reset'
- `className?`: string

**Usage:**
```tsx
import { lazy } from 'react';
const Button = lazy(() => import('common_side/Button'));

<Button variant="primary" onClick={() => console.log('Clicked!')}>
  Click Me
</Button>
```

### 2. Header (`./Header`)
A common header component with title, subtitle, and logo support.

**Props:**
- `title`: string
- `subtitle?`: string
- `logo?`: string
- `className?`: string

**Usage:**
```tsx
import { lazy } from 'react';
const Header = lazy(() => import('common_side/Header'));

<Header 
  title="My Application" 
  subtitle="Welcome to the app"
  logo="/logo.png"
/>
```

### 3. Footer (`./Footer`)
A common footer component with copyright and links.

**Props:**
- `copyrightText?`: string
- `links?`: Array<{ label: string; href: string }>
- `className?`: string

**Usage:**
```tsx
import { lazy } from 'react';
const Footer = lazy(() => import('common_side/Footer'));

<Footer 
  copyrightText="© 2024 My Company"
  links={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ]}
/>
```

### 4. LoadingSkeleton (`./LoadingSkeleton`)
A loading skeleton placeholder component.

**Props:**
- `rows?`: number (default: 3)
- `className?`: string

**Usage:**
```tsx
import { lazy, Suspense } from 'react';
const LoadingSkeleton = lazy(() => import('common_side/LoadingSkeleton'));

<Suspense fallback={<div>Loading...</div>}>
  <LoadingSkeleton rows={5} />
</Suspense>
```

## 🔧 Module Federation Configuration

### In common_side (Exposing)

```typescript
// rsbuild.config.ts
pluginModuleFederation({
  name: 'common_side',
  exposes: {
    './Button': './src/components/Button.tsx',
    './Header': './src/components/Header.tsx',
    './Footer': './src/components/Footer.tsx',
    './LoadingSkeleton': './src/components/LoadingSkeleton.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  },
})
```

### In Consuming Modules (client_side / admin_side)

```typescript
// rsbuild.config.ts
pluginModuleFederation({
  name: 'client_side', // or 'admin_side'
  remotes: {
    common_side: 'common_side@http://localhost:3003/mf-manifest.json'
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  },
})
```

## 📁 Project Structure

```
common_side/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── App.tsx          # Demo/showcase app
│   ├── index.tsx        # Entry point
│   └── index.css        # Global styles
├── public/
│   └── index.html
├── rsbuild.config.ts    # Rsbuild + Module Federation config
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Technology Stack

- **Build Tool**: Rsbuild 1.5.x
- **Framework**: React 19.1.x
- **Language**: TypeScript 5.9.x
- **Module Federation**: @module-federation/rsbuild-plugin
- **Styling**: Tailwind CSS (configured in consuming modules)

## 🔄 Development Workflow

1. **Start common_side first** (required for components):
   ```bash
   cd common_side && pnpm dev
   ```

2. **Then start consuming modules**:
   ```bash
   # In another terminal
   cd client_side && pnpm dev
   
   # Or
   cd admin_side && pnpm dev
   ```

## 📝 Adding New Components

1. Create component in `src/components/YourComponent.tsx`
2. Export it in `rsbuild.config.ts`:
   ```typescript
   exposes: {
     './YourComponent': './src/components/YourComponent.tsx'
   }
   ```
3. Use in consuming modules:
   ```typescript
   import { lazy } from 'react';
   const YourComponent = lazy(() => import('common_side/YourComponent'));
   ```

## 🚨 Important Notes

- **Start Order**: Always start common_side before consuming modules
- **Singleton React**: Ensure React and ReactDOM are singletons to avoid conflicts
- **Port**: common_side runs on port 3003 by default
- **No Dependencies**: This module should not consume other remotes

## 📚 Resources

- [Module Federation Documentation](https://module-federation.io/)
- [Rsbuild Documentation](https://rsbuild.dev/)
- [Module Federation Best Practices](https://module-federation.io/practice/overview)
