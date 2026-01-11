/**
 * ============================================================================
 * PRODUCTION SSR SERVER
 * ============================================================================
 *
 * This server handles Server-Side Rendering (SSR) for the blog in production.
 *
 * HOW IT WORKS:
 * 1. User requests a page (e.g., /en/posts/my-article)
 * 2. Server renders React components to HTML string (SSR)
 * 3. Server injects the HTML into the template with SEO meta tags
 * 4. Browser receives fully-rendered HTML (good for SEO)
 * 5. React hydrates the page and makes it interactive
 *
 * TO RUN:
 *   pnpm build   # Build client and server bundles first
 *   pnpm start   # Start this production server
 *
 * CONFIGURATION:
 *   - Port: Set via PORT environment variable (default: 3001)
 *   - Site config: Edit src/config/site.config.ts (keep in sync below)
 *
 * ============================================================================
 */

import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

// ============================================================================
// CONFIGURATION (keep in sync with src/config/site.config.ts)
// ============================================================================

const CONFIG = {
  siteName: "Duc Tran's Blog",
  siteUrl: 'https://my-blogs.ducth.dev',
  avatarUrl: 'https://my-cms-api.ducth.dev/media/wwlkmlklf2-duc-tran-png.png',
  defaultTitle: "Duc Tran's Blog - Web Development & Technology",
  defaultDescription: "Hi! I'm Duc Tran, a passionate developer sharing insights about web development, technology, and software engineering.",
};

// ============================================================================
// SERVER SETUP
// ============================================================================

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;
const clientPath = join(__dirname, 'dist', 'client');

// Rate limiting: 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
}));

// Serve static assets (JS, CSS, images)
app.use('/static', express.static(join(clientPath, 'static')));

// ============================================================================
// LOAD SSR BUNDLE
// ============================================================================

let serverRender = null;
try {
  const serverModule = await import('./dist/server/index.mjs');
  serverRender = serverModule.default;
} catch (err) {
  console.error('Failed to load SSR bundle:', err.message);
}

// ============================================================================
// SEO: Generate meta tags based on URL
// ============================================================================

function getPageMeta(url) {
  const parts = url.split('/').filter(Boolean);
  const lang = parts[0] || 'en';
  const section = parts[1];
  const slug = parts[2];

  // Default meta
  let title = CONFIG.defaultTitle;
  let description = CONFIG.defaultDescription;

  // Customize based on page type
  if (section === 'categories') {
    if (slug) {
      const name = slug.replace(/-/g, ' ');
      title = `${name.charAt(0).toUpperCase() + name.slice(1)} - ${CONFIG.siteName}`;
      description = `Explore articles about ${name}`;
    } else {
      title = `Browse Categories - ${CONFIG.siteName}`;
      description = 'Explore articles organized by topics';
    }
  } else if (section === 'posts' && slug) {
    const name = slug.replace(/-/g, ' ');
    title = `${name.charAt(0).toUpperCase() + name.slice(1)} | ${CONFIG.siteName}`;
    description = `Read about ${name}`;
  }

  return { title, description, lang };
}

// ============================================================================
// SSR REQUEST HANDLER
// ============================================================================

app.get('/{*path}', async (req, res) => {
  // Skip file requests (favicon, robots.txt, etc.)
  if (req.path.includes('.')) {
    return res.status(404).send('Not Found');
  }

  try {
    // 1. Get SEO meta for this page
    const { title, description, lang } = getPageMeta(req.path);

    // 2. Render React app to HTML (or empty string if SSR fails)
    let appHtml = '';
    if (serverRender) {
      try {
        appHtml = serverRender(req.path);
      } catch (err) {
        console.error('SSR render error:', err.message);
      }
    }

    // 3. Read HTML template and inject content
    const template = readFileSync(join(clientPath, 'index.html'), 'utf-8');

    const html = template
      .replace('<!--app-content-->', appHtml)
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<html lang="en"/, `<html lang="${lang}"`)
      .replace('</head>', `
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${CONFIG.avatarUrl}" />
    <meta property="og:url" content="${CONFIG.siteUrl}${req.path}" />
    <meta name="twitter:card" content="summary_large_image" />
</head>`);

    res.status(200).type('html').send(html);
  } catch (err) {
    console.error('SSR Error:', err);
    res.status(500).send('Server Error');
  }
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(port, () => {
  console.log(`
  ✓ Production SSR server running
  ✓ URL: http://localhost:${port}
  ✓ SSR: ${serverRender ? 'enabled' : 'disabled (bundle not found)'}
  `);
});
