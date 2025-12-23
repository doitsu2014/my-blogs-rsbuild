import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Set DaisyUI theme to abyss
document.documentElement.setAttribute('data-theme', 'abyss');

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
