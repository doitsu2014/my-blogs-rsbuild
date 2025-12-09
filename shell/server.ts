import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files for client (SSR)
app.use(express.static(path.join(__dirname, '../dist/client')));

// SSR for client_side routes (all routes)
app.get('*', async (req: Request, res: Response) => {
  try {
    // Import the server render function
    // @ts-ignore - Dynamic import of built file
    const { render } = await import('./dist/server/index.js');
    
    // Read the client HTML template
    const clientIndexPath = path.join(__dirname, '../dist/client/index.html');
    
    if (!fs.existsSync(clientIndexPath)) {
      return res.status(500).send('Client build not found. Please run build first.');
    }
    
    let html = fs.readFileSync(clientIndexPath, 'utf-8');
    
    // Render the app
    const appHtml = render(req.url);
    
    // Inject the rendered app into the HTML
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );
    
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 Client Side (SSR): http://localhost:${PORT}`);
});
