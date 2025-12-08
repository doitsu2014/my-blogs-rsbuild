# Shell Application (Host)

The **Shell** is the host application in this micro-frontend architecture. It serves as the main container that orchestrates and loads remote modules dynamically using **Module Federation 2.0**.

## 🎯 Purpose

The Shell application acts as:
- **Host Container**: Manages the overall application structure and routing
- **Module Orchestrator**: Dynamically loads and integrates remote modules at runtime
- **Navigation Hub**: Provides centralized routing between different micro-frontend modules
- **Shared Context**: Maintains shared state and provides common functionality across modules

## 🏗️ Architecture

### Module Federation Configuration

The Shell is configured as a **Module Federation Host** that consumes remote modules:

```typescript
// rsbuild.config.ts
pluginModuleFederation({
  name: 'shell',
  remotes: {
    homepage: 'homepage@http://localhost:3001/mf-manifest.json',
  },
})
```

### Key Components

#### 1. **App.tsx**
- Main application component
- Configures React Router for navigation
- Defines routes for loading different modules
- Handles redirects and 404 pages

#### 2. **ModuleLoader.tsx**
- Dynamically imports remote modules using React lazy loading
- Wraps remote components with Suspense for loading states
- Provides fallback UI while modules are being fetched
- Handles module resolution and error cases

### Routing Structure

```
/ → Redirects to /homepage
/homepage → Loads the Homepage remote module
/* → 404 Not Found page
```

## 📦 Tech Stack

- **React 19.1.1**: UI library with latest features
- **React Router DOM 7.9.3**: Client-side routing
- **Module Federation 2.0**: Micro-frontend orchestration
- **Rsbuild 1.5.12**: Fast build tool
- **TypeScript 5.9.2**: Type safety and developer experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm package manager

### Installation

Install dependencies:

```bash
pnpm install
```

### Development

Start the development server (runs on port 3000):

```bash
pnpm dev
```

The Shell app will be available at [http://localhost:3000](http://localhost:3000).

**Important**: Before starting the Shell, ensure all required remote modules are running:
- Homepage module: `http://localhost:3001`

### Build for Production

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## 🔧 Configuration

### Port Configuration

- **Development Server**: `3000` (default)
- Configured in `rsbuild.config.ts`

### Remote Modules

Remote modules are configured in the `remotes` section of Module Federation config:

```typescript
remotes: {
  homepage: 'homepage@http://localhost:3001/mf-manifest.json',
}
```

To add new remote modules:
1. Add the remote configuration in `rsbuild.config.ts`
2. Create a new route in `App.tsx`
3. Add the module case in `ModuleLoader.tsx`
4. Update TypeScript definitions in `src/types/modules.d.ts`

## 📁 Project Structure

```
shell/
├── src/
│   ├── App.tsx              # Main app component with routing
│   ├── App.css              # Global styles
│   ├── index.tsx            # Application entry point
│   ├── components/
│   │   └── ModuleLoader.tsx # Dynamic module loader component
│   └── types/
│       └── modules.d.ts     # TypeScript module declarations
├── @mf-types/               # Auto-generated Module Federation types
├── rsbuild.config.ts        # Rsbuild and Module Federation config
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🔌 Adding New Remote Modules

To integrate a new remote module:

1. **Update Module Federation Config**
   ```typescript
   // rsbuild.config.ts
   remotes: {
     homepage: 'homepage@http://localhost:3001/mf-manifest.json',
     newModule: 'newModule@http://localhost:3002/mf-manifest.json', // Add here
   }
   ```

2. **Add Route Definition**
   ```typescript
   // src/App.tsx
   <Route 
     path="/new-module" 
     element={<ModuleLoader moduleName="newModule" />} 
   />
   ```

3. **Update Module Loader**
   ```typescript
   // src/components/ModuleLoader.tsx
   const NewModuleApp = lazy(() => import('newModule/App'));
   
   case 'newModule':
     return (
       <Suspense fallback={<div>Loading New Module...</div>}>
         <NewModuleApp />
       </Suspense>
     );
   ```

4. **Add Type Definitions**
   ```typescript
   // src/types/modules.d.ts
   declare module 'newModule/App' {
     const App: React.ComponentType;
     export default App;
   }
   ```

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint for code quality |
| `pnpm format` | Format code with Prettier |

## 🧪 Type Safety

The Shell app uses TypeScript with Module Federation type generation:

- **Auto-generated types**: Located in `@mf-types/` directory
- **Manual declarations**: Define in `src/types/modules.d.ts` for custom modules
- **Strict mode**: Enabled for better type checking

## 🚨 Troubleshooting

### Remote module fails to load

**Solution**: Ensure the remote module is running on the correct port and the URL in `rsbuild.config.ts` is correct.

### Type errors for remote modules

**Solution**: Run the remote module's build process to generate types, or manually define types in `src/types/modules.d.ts`.

### Shared dependency version conflicts

**Solution**: Ensure React and React-DOM versions match across all modules (Shell and Remotes).

## 📚 Learn More

- [Module Federation Documentation](https://module-federation.io/)
- [Rsbuild Documentation](https://rsbuild.rs/)
- [React Router Documentation](https://reactrouter.com/)
- [Project Architecture Guide](../.github/instructions/code-of-conduct.md.instructions.md)

## 🔗 Related Modules

- [Homepage Module](../homepage/README.md) - Remote module for the homepage feature

---

**Note**: This Shell application is part of a micro-frontend architecture. It requires remote modules to be running for full functionality.
