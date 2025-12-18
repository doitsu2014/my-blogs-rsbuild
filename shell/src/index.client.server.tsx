import React from 'react';
import { renderToString } from 'react-dom/server';
import AppClient from './App.client';

export function render(_url: string) {
  const html = renderToString(
    <React.StrictMode>
      <AppClient />
    </React.StrictMode>,
  );
  return html;
}
