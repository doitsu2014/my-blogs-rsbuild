import express from 'express';
import { createRsbuild, loadConfig } from '@rsbuild/core';

async function startDevServer() {
  const app = express();

  // Load rsbuild config and add middlewareMode
  const { content } = await loadConfig({});
  const rsbuild = await createRsbuild({
    rsbuildConfig: {
      ...content,
      server: {
        ...content.server,
        middlewareMode: true,
      },
    },
  });

  const rsbuildServer = await rsbuild.createDevServer();
  const { environments } = rsbuildServer;

  // SSR route handler - must be before rsbuild middlewares
  app.get('/{*path}', async (req, res, next) => {
    // Skip for static files and HMR
    if (
      req.path.includes('.') ||
      req.path.startsWith('/__rsbuild') ||
      req.path.includes('hot-update')
    ) {
      return next();
    }

    try {
      // Load server bundle and get HTML template
      const serverModule = await environments.node.loadBundle('index');
      const template = await environments.web.getTransformedHtml('index');

      if (!serverModule?.default || !template) {
        console.log('SSR not ready, falling back to CSR');
        return next();
      }

      // Render the app
      const markup = serverModule.default(req.path);
      const html = template.replace('<!--app-content-->', markup);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (err) {
      console.error('SSR Dev Error:', err);
      next();
    }
  });

  // Rsbuild dev middlewares (HMR, static files, etc.)
  app.use(rsbuildServer.middlewares);

  const server = app.listen(rsbuildServer.port, async () => {
    await rsbuildServer.afterListen();
    console.log(`SSR Dev server running at http://localhost:${rsbuildServer.port}`);
  });

  // Connect WebSocket for HMR
  rsbuildServer.connectWebSocket({ server });
}

startDevServer().catch(console.error);
