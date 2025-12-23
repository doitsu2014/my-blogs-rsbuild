# My Blogs - Micro-Frontend Project

A modern micro-frontend architecture project built with **Module Federation 2.0**, **Rsbuild**, and **React 19**. This project demonstrates how to build scalable web applications using a modular, distributed architecture with independent modules and shared components.

## 🏗️ Architecture Overview

This project implements a micro-frontend architecture using Module Federation 2.0, consisting of **three independent modules**:

- **common_side** (Shared Components): Exposes reusable UI components, running on port 3003
- **client_side** (Public Application): Standalone client-facing application, running on port 3001
- **admin_side** (Admin Application): Independent admin panel with Keycloak auth and my-cms integration, running on port 3002

### What is Module Federation?

Module Federation is a revolutionary approach to building micro-frontends that allows JavaScript applications to dynamically load code from other applications at runtime. This enables:

- **Independent Development**: Teams can work on different modules independently
- **Independent Deployment**: Deploy modules separately without rebuilding the entire application
- **Code Sharing**: Share dependencies and components efficiently across modules to reduce bundle size
- **Runtime Integration**: Load remote modules dynamically without build-time coupling

## 🚀 Key Features

- **Module Federation 2.0**: Latest version with improved performance and developer experience
- **Rsbuild**: Fast, modern build tool based on Rspack for lightning-fast builds
- **React 19**: Latest React version with improved performance and features
- **TypeScript**: Full type safety across all modules
- **Type Generation**: Automatic type generation for remote modules
- **Hot Module Replacement**: Fast development experience with HMR
- **Singleton Dependencies**: Shared React instances across modules to prevent conflicts
- **Keycloak Authentication**: Production-ready authentication for admin module
- **my-cms Integration**: GraphQL and REST API integration for content management

## 📦 Project Structure

```
my-blogs-rsbuild/
├── common_side/         # Shared components module (port 3003)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── App.tsx      # Showcase app
│   └── rsbuild.config.ts
├── client_side/         # Public client app (port 3001)
│   ├── src/
│   │   └── App.tsx
│   └── rsbuild.config.ts
├── admin_side/          # Admin panel (port 3002)
│   ├── src/
│   │   ├── auth/        # Keycloak authentication
│   │   ├── domains/     # Domain models
│   │   ├── infrastructure/  # GraphQL, utilities
│   │   └── app/admin/   # Admin pages
│   └── rsbuild.config.ts
├── package.json         # Root package for workspace management
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── MIGRATION_PLAN.md    # Admin features migration documentation
└── README.md
```

## 🛠️ Technology Stack

- **Build Tool**: Rsbuild 1.5.x
- **Framework**: React 19.1.x
- **Language**: TypeScript 5.9.x
- **Routing**: React Router DOM 7.9.x (admin_side)
- **Module Federation**: @module-federation/rsbuild-plugin 0.21.x
- **Authentication**: Keycloak (admin_side)
- **Backend**: my-cms GraphQL + REST API (admin_side)
- **UI Framework**: DaisyUI + Tailwind CSS (admin_side)
- **Package Manager**: pnpm (with workspaces)
- **Linting**: ESLint 9.x
- **Formatting**: Prettier 3.x

## 🚦 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher
- **my-cms backend** (for admin_side): [https://github.com/doitsu2014/my-cms](https://github.com/doitsu2014/my-cms)
- **Keycloak** (for admin_side): Configured at `https://my-ids-admin.ducth.dev`

### Installation

```bash
# Install dependencies for all modules
pnpm install

# Or install individually
cd common_side && pnpm install
cd client_side && pnpm install
cd admin_side && pnpm install
```

### Development

#### Start All Modules (Recommended)

```bash
# From root directory
pnpm dev
```

This starts all three modules concurrently:
- common_side: http://localhost:3003
- client_side: http://localhost:3001
- admin_side: http://localhost:3002

#### Start Individual Modules

```bash
# Start common_side (required first for shared components)
pnpm dev:common
# or
cd common_side && pnpm dev

# Start client_side
pnpm dev:client
# or
cd client_side && pnpm dev

# Start admin_side (requires common_side + my-cms backend + Keycloak)
pnpm dev:admin
# or
cd admin_side && pnpm dev
```

### Production Build

```bash
# Build all modules
pnpm build

# Or build individually
pnpm build:common
pnpm build:client
pnpm build:admin
```

## 🎯 Module Architecture

### common_side (Port 3003)

**Purpose**: Provides shared UI components consumed by other modules

**Exposes**:
- `./Button` - Reusable button component with variants
- `./Header` - Common header component
- `./Footer` - Common footer component
- `./LoadingSkeleton` - Loading state placeholder

**Consumes**: None (independent module)

**Usage**:
```typescript
// In client_side or admin_side
import { lazy } from 'react';
const Button = lazy(() => import('common_side/Button'));
```

### client_side (Port 3001)

**Purpose**: Public-facing client application

**Exposes**: None (standalone app)

**Consumes**: 
- `common_side` - Shared UI components

**Features**:
- Public blog viewing
- Homepage
- Blog listing and details
- SEO-optimized

### admin_side (Port 3002)

**Purpose**: Admin panel for content management

**Exposes**: None (standalone app)

**Consumes**:
- `common_side` - Shared UI components

**Features**:
- Keycloak authentication (Authorization Code Flow + PKCE)
- Categories management (CRUD)
- Blogs management (CRUD with rich text editor)
- Admin dashboard with stats
- my-cms backend integration (GraphQL + REST API)
- User profile and management

**Configuration Required**:
```bash
# .env.local in admin_side/
PUBLIC_KEYCLOAK_URL=https://my-ids-admin.ducth.dev
PUBLIC_KEYCLOAK_REALM=master
PUBLIC_KEYCLOAK_CLIENT_ID=my-blogs-admin-localhost
PUBLIC_KEYCLOAK_SCOPE=my-headless-cms-api-all email openid profile
PUBLIC_GRAPHQL_API_URL=http://localhost:8989/graphql
PUBLIC_REST_API_URL=http://localhost:8989/api
```

## 📊 Module Dependencies Flow

```
┌─────────────┐
│ common_side │ (Port 3003)
│  Exposes:   │
│  Components │
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ (Future modules)
│ client_side │ │ admin_side  │
│ Port 3001   │ │ Port 3002   │
│             │ │ + Keycloak  │
│ Standalone  │ │ + my-cms    │
└─────────────┘ └─────────────┘
```

## 🎯 Use Cases

This architecture is ideal for:

- Large-scale applications with multiple teams
- Applications requiring independent deployment cycles
- Gradual migration from monolithic to micro-frontend architecture
- Multi-tenant platforms
- Blog platforms with modular content sections
- Admin panels separated from public applications
- Progressive web applications with code splitting needs

## 🚧 Current Development

### Admin Features Migration - COMPLETE ✅

All admin features have been successfully migrated from the [old Next.js platform](https://github.com/doitsu2014/my-blogs) to the new `admin_side` module.

**Migrated Features:**
- ✅ Categories Management (CRUD operations)
- ✅ Blogs Management with rich text editor
- ✅ Admin Dashboard with stats
- ✅ Keycloak Authentication (Authorization Code Flow + PKCE)
- ✅ my-cms Backend Integration (GraphQL + REST API)
- ✅ User management and profiles
- ✅ Module Federation integration

For detailed information, see:
- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) - Complete migration strategy
- [PHASE_8_10_IMPLEMENTATION.md](./PHASE_8_10_IMPLEMENTATION.md) - Keycloak and my-cms integration
- [admin_side/README.md](./admin_side/README.md) - Admin module documentation
- [common_side/README.md](./common_side/README.md) - Shared components documentation

## 📚 Learning Resources

- [Module Federation Documentation](https://module-federation.io/guide/start/index.html)
- [Rsbuild Documentation](https://rsbuild.dev/)
- [Module Federation Best Practices](https://module-federation.io/practice/overview)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

## 🔧 Development Tips

1. **Always start common_side first** - Other modules depend on its exposed components
2. **Use pnpm workspaces** - Manage dependencies across all modules efficiently
3. **Check port availability** - Ensure ports 3001, 3002, 3003 are available
4. **Backend requirements** - admin_side requires my-cms backend (port 8989) and Keycloak
5. **Hot reload** - All modules support HMR for fast development

## 📝 Adding New Modules

To add a new module that consumes common_side:

1. Create new directory: `mkdir new_module`
2. Initialize package.json with Module Federation config
3. Add remote configuration:
   ```typescript
   remotes: {
     common_side: 'common_side@http://localhost:3003/mf-manifest.json'
   }
   ```
4. Add to pnpm-workspace.yaml
5. Use shared components from common_side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Work on your module independently
4. Test with common_side integration
5. Submit a pull request

---

Built with ❤️ using modern web technologies

**Architecture**: Micro-Frontend with Module Federation 2.0  
**Build Tool**: Rsbuild  
**Framework**: React 19  
**Package Manager**: pnpm workspaces
