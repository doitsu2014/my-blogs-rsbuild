# My Blogs - Micro-Frontend Project

A modern micro-frontend architecture project built with **Module Federation 2.0**, **Rsbuild**, and **React 19**. This project demonstrates how to build scalable web applications using a modular, distributed architecture that allows independent development and deployment of different parts of your application.

## 🏗️ Architecture Overview

This project implements a micro-frontend architecture using Module Federation 2.0, consisting of:

- **Shell App** (Host): The main container application running on port 3000
- **ClientSide Module** (Remote): A standalone module exposing components, running on port 3001

### What is Module Federation?

Module Federation is a revolutionary approach to building micro-frontends that allows JavaScript applications to dynamically load code from other applications at runtime. This enables:

- **Independent Development**: Teams can work on different modules independently
- **Independent Deployment**: Deploy modules separately without rebuilding the entire application
- **Code Sharing**: Share dependencies efficiently across modules to reduce bundle size
- **Runtime Integration**: Load remote modules dynamically without build-time coupling

## 🚀 Key Features

- **Module Federation 2.0**: Latest version with improved performance and developer experience
- **Rsbuild**: Fast, modern build tool based on Rspack for lightning-fast builds
- **React 19**: Latest React version with improved performance and features
- **TypeScript**: Full type safety across all modules
- **Type Generation**: Automatic type generation for remote modules
- **Hot Module Replacement**: Fast development experience with HMR
- **Singleton Dependencies**: Shared React instances across modules to prevent conflicts

## 📦 Project Structure

```
my-blogs-rsbuild/
├── shell/              # Host application (port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   └── ModuleLoader.tsx
│   │   └── types/
│   │       └── modules.d.ts
│   └── rsbuild.config.ts
├── client_side/           # Remote module (port 3001)
│   ├── src/
│   │   └── App.tsx    # Exposed component
│   └── rsbuild.config.ts
└── README.md
```

## 🛠️ Technology Stack

- **Build Tool**: Rsbuild 1.5.x
- **Framework**: React 19.1.x
- **Language**: TypeScript 5.9.x
- **Routing**: React Router DOM 7.9.x
- **Module Federation**: @module-federation/rsbuild-plugin
- **Package Manager**: pnpm
- **Linting**: ESLint 9.x
- **Formatting**: Prettier 3.x

## 🎯 Use Cases

This architecture is ideal for:

- Large-scale applications with multiple teams
- Applications requiring independent deployment cycles
- Gradual migration from monolithic to micro-frontend architecture
- Multi-tenant platforms
- Blog platforms with modular content sections
- Progressive web applications with code splitting needs

## 📚 Learning Resources

- [Module Federation Documentation](https://module-federation.io/guide/start/index.html)
- [Rsbuild Documentation](https://rsbuild.dev/)
- [Module Federation Best Practices](https://module-federation.io/practice/overview)

---

Built with ❤️ using modern web technologies
