import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import AppClient from './App.client';

const rootEl = document.getElementById('root');
if (rootEl) {
  hydrateRoot(
    rootEl,
    <React.StrictMode>
      <AppClient />
    </React.StrictMode>,
  );
}
