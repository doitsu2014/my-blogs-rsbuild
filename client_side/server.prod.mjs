import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

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

// SSR route handler MUST come before static middleware
app.get('/', async (req, res) => {
  try {
    // Simple inline component for SSR - just render a basic shell
    // The actual routing will be handled by React Router on the client
    const AppShell = () => {
      return React.createElement('div', { id: 'app-root' },
        React.createElement('div', { className: 'loading-indicator' }, 'Loading...')
      );
    };
    
    // Render the app shell to HTML string
    const markup = renderToString(
      React.createElement(React.StrictMode, null,
        React.createElement(AppShell)
      )
    );
    
    // Read the HTML template
    const templatePath = join(clientPath, 'index.html');
    const template = readFileSync(templatePath, 'utf-8');
    
    // Replace the placeholder with rendered markup
    const html = template.replace('<!--app-content-->', markup);
    
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (err) {
    console.error('SSR Error:', err);
    console.error(err.stack);
    res.status(500).send('Internal Server Error: ' + err.message);
  }
});

// Serve static files from the client build (exclude index.html)
app.use('/static', express.static(join(clientPath, 'static')));

app.listen(port, () => {
  console.log(`Production SSR server running at http://localhost:${port}`);
  console.log(`Client path: ${clientPath}`);
});

