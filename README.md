# My Blogs - Rsbuild Micro-Frontend Project

A modern, independent micro-frontend architecture project built with **Rsbuild**, **Rspack**, and **React 19**. This project demonstrates how to build scalable web applications using modular architecture with completely independent standalone applications.

## 🏗️ Architecture Overview

This project implements a **simplified micro-frontend architecture** with **two independent standalone applications**:

- **client_side** (Public Application): Standalone client-facing application, running on port 3001
- **admin_side** (Admin Application): Independent admin panel with Keycloak auth and my-cms integration, running on port 3002

### Simplified Architecture

**No Module Federation** - Each application runs completely independently:
- No shared components module
- No runtime dependency between modules
- Clean separation of concerns
- Simple deployment model

## 🚀 Key Features

- **Rsbuild/Rspack**: Fast, modern build tool for lightning-fast builds
- **React 19**: Latest React version with improved performance and features
- **TypeScript**: Full type safety across all modules
- **Hot Module Replacement**: Fast development experience with HMR
- **Independent Modules**: Each application runs standalone
- **Keycloak Authentication**: Production-ready authentication for admin module
- **my-cms Integration**: GraphQL and REST API integration for content management (admin_side)

## 📦 Project Structure

```
my-blogs-rsbuild/
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

- **Build Tool**: Rsbuild 1.5.x (with Rspack)
- **Framework**: React 19.1.x
- **Language**: TypeScript 5.9.x
- **Routing**: React Router DOM 7.9.x (admin_side)
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
# Start all modules concurrently
pnpm dev

# Or start individually

# Start client_side
pnpm dev:client
# or
cd client_side && pnpm dev

# Start admin_side (requires my-cms backend + Keycloak)
pnpm dev:admin
# or
cd admin_side && pnpm dev
```

### Production Build

```bash
# Build all modules
pnpm build

# Or build individually
pnpm build:client
pnpm build:admin
```

## 🎯 Module Architecture

### client_side (Port 3001)

**Purpose**: Public-facing client application

**Features**:
- Public blog viewing
- Homepage
- Blog listing and details
- SEO-optimized
- Standalone application with no dependencies

### admin_side (Port 3002)

**Purpose**: Admin panel for content management

**Features**:
- Keycloak authentication (Authorization Code Flow + PKCE)
- Categories management (CRUD)
- Blogs management (CRUD with rich text editor)
- Admin dashboard with stats
- my-cms backend integration (GraphQL + REST API)
- User profile and management
- Standalone application with no shared dependencies

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

## 📊 Module Architecture Flow

```
┌─────────────┐       ┌─────────────┐
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

## 📚 Learning Resources

- [Rsbuild Documentation](https://rsbuild.dev/)
- [Rspack Documentation](https://rspack.dev/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [React 19 Documentation](https://react.dev/)

## 🔧 Development Tips

1. **Independent modules** - Each application runs completely standalone
2. **Use pnpm workspaces** - Manage dependencies across all modules efficiently
3. **Check port availability** - Ensure ports 3001, 3002 are available
4. **Backend requirements** - admin_side requires my-cms backend (port 8989) and Keycloak
5. **Hot reload** - All modules support HMR for fast development
6. **No Module Federation** - Simplified architecture without runtime dependencies

## 📝 Adding New Modules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Work on your module independently
4. Test your changes
5. Submit a pull request

---

Built with ❤️ using modern web technologies

**Architecture**: Independent Micro-Frontends with Rsbuild  
**Build Tool**: Rsbuild/Rspack  
**Framework**: React 19  
**Package Manager**: pnpm workspaces
