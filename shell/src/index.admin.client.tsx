import React from 'react';
import ReactDOM from 'react-dom/client';
import AppAdmin from './App.admin';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <AppAdmin />
    </React.StrictMode>,
  );
}
