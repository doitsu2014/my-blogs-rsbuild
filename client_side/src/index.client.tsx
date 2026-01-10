import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Set DaisyUI theme to emerald
document.documentElement.setAttribute('data-theme', 'emerald');

const rootEl = document.getElementById('root');
if (rootEl) {
  hydrateRoot(rootEl, <App />);
}
