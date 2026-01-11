import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { buildGraphQLClient } from './infrastructure/graphql/graphql-client';
import AppContent from './AppContent';
import './App.css';
import './i18n/i18n';

/**
 * Server-side render function
 * Returns { html, apolloState } for SSR with data hydration
 */
export default async function render(url: string) {
  // Create fresh Apollo client for each request
  const client = buildGraphQLClient();

  const App = (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </ApolloProvider>
    </React.StrictMode>
  );

  // Pre-fetch all GraphQL queries
  await getDataFromTree(App);

  // Render to HTML string
  const html = renderToString(App);

  // Extract Apollo cache state for client hydration
  const apolloState = client.extract();

  return { html, apolloState };
}
