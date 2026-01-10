import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Import the App component
async function getApp() {
  // For now, we'll use a simple inline component since imports are complex
  return function App() {
    return React.createElement('div', { className: 'content bg-base-100' },
      React.createElement('div', { className: 'hero min-h-screen' },
        React.createElement('div', { className: 'hero-content text-center' },
          React.createElement('div', { className: 'max-w-md' },
            React.createElement('h1', { className: 'text-5xl font-bold' }, 'Rsbuild with React'),
            React.createElement('p', { className: 'py-6 text-lg opacity-70' }, 'Start building amazing things with Rsbuild and DaisyUI.'),
            React.createElement('button', { className: 'btn btn-primary' }, 'Get Started')
          )
        )
      )
    );
  };
}

const clientPath = join(__dirname, 'dist', 'client');

// SSR route handler MUST come before static middleware
app.get('/', async (req, res) => {
  try {
    const App = await getApp();
    
    // Render the app to HTML string
    const markup = renderToString(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
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

