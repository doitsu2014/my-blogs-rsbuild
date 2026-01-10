import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiting to all routes
app.use(limiter);

const clientPath = join(__dirname, 'dist', 'client');

// Import the server render function
let serverRender;
try {
  const serverModule = await import('./dist/server/index.mjs');
  serverRender = serverModule.default;
} catch (err) {
  console.error('Failed to load server bundle:', err);
  serverRender = null;
}

// Helper function to get meta tags based on route
const getMetaTags = (url) => {
  const pathParts = url.split('/').filter(Boolean);
  const lang = pathParts[0] || 'en';

  // Default meta tags
  let title = "Duc Tran's Blog - Web Development & Technology";
  let description = "Hi! I'm Duc Tran, a passionate developer sharing insights about web development, technology, and software engineering.";
  let ogImage = "https://my-cms-api.ducth.dev/media/wwlkmlklf2-duc-tran-png.png";

  // Customize based on route
  if (pathParts.length > 1) {
    const section = pathParts[1];

    if (section === 'categories') {
      if (pathParts.length > 2) {
        // Category detail page
        const categorySlug = pathParts[2];
        const categoryName = categorySlug.replace(/-/g, ' ');
        title = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} - Duc Tran's Blog`;
        description = `Explore articles about ${categoryName} on Duc Tran's Blog`;
      } else {
        // Categories listing page
        title = "Browse Categories - Duc Tran's Blog";
        description = "Explore articles organized by topics and themes on Duc Tran's Blog";
      }
    } else if (section === 'posts' && pathParts.length > 2) {
      // Post detail page
      const postSlug = pathParts[2];
      const postTitle = postSlug.replace(/-/g, ' ');
      title = `${postTitle.charAt(0).toUpperCase() + postTitle.slice(1)} | Duc Tran's Blog`;
      description = `Read about ${postTitle} on Duc Tran's Blog`;
    }
  }

  return { title, description, ogImage, lang };
};

// Serve static files from the client build FIRST
app.use('/static', express.static(join(clientPath, 'static')));

// SSR route handler for all routes
app.get('/{*splat}', async (req, res) => {
  // Skip static file requests
  if (req.path.startsWith('/static/') || req.path.includes('.')) {
    return res.sendFile(join(clientPath, req.path));
  }

  try {
    const { title, description, ogImage, lang } = getMetaTags(req.path);

    // Render the app to HTML string using the server bundle
    let markup = '';
    if (serverRender) {
      try {
        markup = serverRender(req.path);
      } catch (renderErr) {
        console.error('SSR render error:', renderErr);
        // Fall back to empty content for client-side rendering
        markup = '';
      }
    }

    // Read the HTML template
    const templatePath = join(clientPath, 'index.html');
    const template = readFileSync(templatePath, 'utf-8');

    // Replace placeholders with dynamic content
    let html = template
      .replace('<!--app-content-->', markup)
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<html lang="en"/, `<html lang="${lang}"`);

    // Add meta description if not present
    if (!html.includes('<meta name="description"')) {
      html = html.replace('</head>', `<meta name="description" content="${description}" />\n    </head>`);
    }

    // Add Open Graph tags if not present
    if (!html.includes('og:title')) {
      const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://my-blogs.ducth.dev${req.path}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    `;
      html = html.replace('</head>', `${ogTags}</head>`);
    }

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (err) {
    console.error('SSR Error:', err);
    console.error(err.stack);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`Production SSR server running at http://localhost:${port}`);
  console.log(`Client path: ${clientPath}`);
  console.log(`Server render available: ${!!serverRender}`);
});
