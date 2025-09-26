---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

--

# Code of Conduct

## Project Architecture

This project uses **Module Federation 2.0** architecture for micro-frontend implementation. Module Federation allows code sharing and dynamic loading between multiple JavaScript applications.

### Key Components:
- **Shell App** (`/shell`): Host application that loads remote modules (port 3000)
- **Homepage Module** (`/homepage`): Remote module that exposes components (port 3001)

## Module Federation Guidelines

### 1. Configuration Standards

#### Host Configuration (Shell App)
- Use `@module-federation/enhanced` plugin
- Configure `remotes` to consume external modules
- Set up `shared` dependencies with singleton pattern for React/React-DOM
- Use manifest-based loading: `moduleName@http://host:port/mf-manifest.json`

#### Remote Configuration (Module Apps)
- Configure `exposes` to share components externally  
- Use clear, descriptive expose keys (e.g., `'./App': './src/App.tsx'`)
- Match shared dependency versions with host app
- Enable singleton sharing for React libraries

### 2. Component Loading Patterns

#### Dynamic Imports
```typescript
const RemoteApp = lazy(() => import('remoteName/ComponentName'));
```

#### Error Boundaries & Suspense
- Always wrap remote components with `Suspense`
- Implement fallback UI for loading states
- Consider error boundaries for failed module loads

### 3. Shared Dependencies

#### Required Shared Libraries
- `react`: singleton, specific version matching
- `react-dom`: singleton, specific version matching
- Keep versions synchronized across all modules

#### Version Management
- Use exact or compatible versions in `shared` config
- Test version compatibility between modules
- Document breaking changes that affect shared deps

### 4. Development Guidelines

#### Port Management
- Shell app: 3000 (default host)
- Remote modules: 3001+ (sequential allocation)
- Document port assignments in README

#### Type Safety
- Use TypeScript across all modules
- Define module types in `types/modules.d.ts`
- Export type definitions for shared interfaces

#### Module Boundaries
- Keep modules loosely coupled
- Avoid deep imports across module boundaries  
- Use well-defined interfaces for communication

### 5. Performance Considerations

#### Loading Strategies
- Implement lazy loading for remote modules
- Use appropriate chunk splitting
- Consider preloading critical modules

#### Bundle Optimization
- Avoid duplicating shared dependencies
- Monitor bundle sizes across modules
- Use dynamic imports for non-critical features

### 6. Testing & Development

#### Local Development
- Start all required modules before testing integration
- Use consistent Node.js and package manager versions
- Test cross-module communication regularly

#### Build & Deployment
- Ensure manifest files are accessible at runtime
- Validate remote module URLs in production
- Test module loading across different environments

## References

- [Module Federation Documentation](https://module-federation.io/guide/start/index.html)
- [Module Federation Enhanced Plugin](https://module-federation.io/guide/basic/rsbuild)
- [Module Federation Best Practices](https://module-federation.io/practice/overview)

