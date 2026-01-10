import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { graphqlClient } from './infrastructure/graphql/graphql-client';
import AppContent from './AppContent';
import './App.css';
import './i18n/i18n';

export default function render(url: string) {
  return renderToString(
    <React.StrictMode>
      <ApolloProvider client={graphqlClient}>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </ApolloProvider>
    </React.StrictMode>
  );
}
