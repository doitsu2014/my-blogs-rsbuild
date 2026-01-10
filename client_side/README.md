# Client Side Module

A **standalone React application** with **Server-Side Rendering (SSR)** and **DaisyUI** styling. This module demonstrates modern web development practices with RSBuild, React 19, and production-ready SSR.

## 📋 Overview

The Client Side module is a standalone React application that runs on port 3001. It features:

- ✅ **Server-Side Rendering (SSR)** for improved performance and SEO
- ✅ **DaisyUI + Tailwind CSS 4** for beautiful, responsive UI
- ✅ **React 19** with modern features
- ✅ **RSBuild** for fast, optimized builds
- ✅ **TypeScript** for type safety

### Key Characteristics

- **Port**: Runs on `http://localhost:3001`
- **SSR**: Server-rendered HTML for faster initial page load
- **Hydration**: Client-side React takes over after SSR
- **Theme**: DaisyUI Emerald theme
- **Standalone**: Independent application, not a micro-frontend

## 🏗️ Architecture

### SSR Implementation

The application uses a custom Express server for SSR:

```
┌─────────────────┐
│  Request  → /   │
└────────┬────────┘
         │
    ┌────▼─────────────────┐
    │  Express Server      │
    │  (server.prod.mjs)   │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │  Server-Side Render   │
    │  React → HTML String  │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  Inject into Template │
    │  + Static Assets      │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  Send HTML to Client  │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  Client Hydration     │
    │  React takes over     │
    └───────────────────────┘
```

### File Structure

```
client_side/
├── src/
│   ├── App.tsx              # Main React component
│   ├── App.css              # Tailwind + DaisyUI styles
│   ├── index.client.tsx     # Client entry (hydration)
│   └── index.server.tsx     # Server entry (SSR)
├── index.html               # HTML template with SSR placeholder
├── server.prod.mjs          # Production SSR server
├── rsbuild.config.ts        # RSBuild configuration
├── tailwind.config.ts       # Tailwind CSS 4 config
└── postcss.config.mjs       # PostCSS config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
pnpm install
```

### Development

Start the development server (client-only, no SSR):

```bash
pnpm dev
```

The app will be available at `http://localhost:3001`

### Build

Build for production:

```bash
pnpm build
```

This generates optimized client bundles in `dist/client/`

### Production Server (SSR)

Start the production SSR server:

```bash
pnpm start
```

The SSR server will:
1. Serve pre-rendered HTML at `http://localhost:3001`
2. Serve static assets from `/static`
3. Enable React hydration on the client

## 📦 Scripts

| Script    | Command              | Description                        |
| --------- | -------------------- | ---------------------------------- |
| `dev`     | `rsbuild dev --open` | Start development server (no SSR)  |
| `build`   | `rsbuild build`      | Build for production               |
| `start`   | `node server.prod.mjs` | Start production SSR server     |
| `preview` | `rsbuild preview`    | Preview production build (no SSR)  |
| `lint`    | `eslint .`           | Lint code with ESLint              |
| `format`  | `prettier --write .` | Format code with Prettier          |

## 🛠️ Technology Stack

- **React**: 19.1.x - UI framework with latest features
- **TypeScript**: 5.9.x - Type safety
- **RSBuild**: 1.5.x - Fast build tool
- **Express**: 5.2.x - SSR server
- **DaisyUI**: 5.5.x - UI component library
- **Tailwind CSS**: 4.1.x - Utility-first CSS framework
- **ESLint**: 9.x - Code linting
- **Prettier**: 3.x - Code formatting

## 🎨 Styling with DaisyUI

### Theme Configuration

The app uses DaisyUI's **Emerald** theme, configured in:

1. **HTML Template** (`index.html`):
```html
<html lang="en" data-theme="emerald">
```

2. **CSS** (`src/App.css`):
```css
@plugin 'daisyui' {
  themes: emerald --default, dark;
}
```

3. **Client Entry** (`src/index.client.tsx`):
```typescript
document.documentElement.setAttribute('data-theme', 'emerald');
```

### Using DaisyUI Components

```tsx
// Example from App.tsx
<div className="hero min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Title</h1>
      <p className="py-6 text-lg opacity-70">Description</p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

## 🔧 SSR Configuration

### Server Setup

The production server (`server.prod.mjs`) handles:

1. **SSR Route** (`GET /`):
   - Renders React components to HTML string
   - Injects rendered markup into HTML template
   - Sends complete HTML to client

2. **Static Assets** (`/static/*`):
   - Serves JavaScript bundles
   - Serves CSS stylesheets
   - Enables caching

### Key SSR Concepts

- **Server Rendering**: `renderToString()` converts React to HTML
- **Hydration**: `hydrateRoot()` attaches React to existing HTML
- **Template Injection**: Placeholder `<!--app-content-->` is replaced with rendered markup

## 🎯 Development Guidelines

### Adding New Components

1. Create component in `src/`
2. Import and use in `App.tsx`
3. Rebuild with `pnpm build`
4. Test SSR with `pnpm start`

### Styling Best Practices

- ✅ Use DaisyUI utility classes
- ✅ Use Tailwind CSS for custom styling
- ✅ Follow responsive design patterns
- ✅ Test on different screen sizes
- ⚠️ Avoid inline styles
- ⚠️ Keep CSS bundle size optimized

### SSR Considerations

- ✅ Keep components stateless when possible
- ✅ Use `useEffect` for client-only code
- ✅ Avoid browser APIs in render methods
- ✅ Test both SSR and client hydration
- ⚠️ Don't access `window` or `document` during render
- ⚠️ Be careful with side effects

## 🧪 Testing

### Test SSR Output

```bash
# Start the SSR server
pnpm build && pnpm start

# In another terminal, verify SSR
curl http://localhost:3001 | grep "content bg-base-100"
```

### Verify Hydration

1. Start SSR server: `pnpm start`
2. Open browser DevTools
3. Check for React DevTools extension
4. Verify no hydration warnings in console

## 📚 Learn More

- [RSBuild SSR Guide](https://rsbuild.rs/guide/advanced/ssr)
- [DaisyUI Documentation](https://daisyui.com/docs/intro/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React 19 Documentation](https://react.dev/)
- [Server-Side Rendering with React](https://react.dev/reference/react-dom/server)

## 🚀 Deployment

### Production Build Steps

1. Build the application:
```bash
pnpm build
```

2. The `dist/client` directory contains:
   - `index.html` - HTML template
   - `static/` - JavaScript and CSS bundles

3. Deploy using Node.js:
```bash
node server.prod.mjs
```

### Environment Variables

```bash
PORT=3001  # Server port (default: 3001)
```

### Deployment Platforms

The SSR setup works with:
- Node.js hosting (Heroku, Railway, Render)
- Docker containers
- Cloud platforms (AWS, GCP, Azure)
- Kubernetes

## 📝 Notes

- SSR improves initial page load and SEO
- Hydration happens automatically on the client
- DaisyUI theme is set on the `<html>` element
- Static assets are served from `/static` path
- Development mode (`pnpm dev`) does not use SSR

---

Part of the **My Blogs - RSBuild** project
