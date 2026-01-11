import { ApolloClient, InMemoryCache, createHttpLink, type NormalizedCacheObject } from '@apollo/client';
import { API_CONFIG } from '../../config/api.config';

// HTTP link to my-cms GraphQL API
const httpLink = createHttpLink({
  uri: API_CONFIG.graphqlApiUrl,
});

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

/**
 * Build Apollo GraphQL Client for my-cms backend
 * - On server: Creates fresh client for each request
 * - On client: Restores cache from SSR data if available
 */
export const buildGraphQLClient = (initialState?: NormalizedCacheObject) => {
  const cache = new InMemoryCache();

  // Restore cache from SSR data (client-side only)
  if (isBrowser && initialState) {
    cache.restore(initialState);
  }

  return new ApolloClient({
    link: httpLink,
    cache,
    ssrMode: !isBrowser,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: isBrowser ? 'cache-first' : 'network-only',
      },
      query: {
        fetchPolicy: isBrowser ? 'cache-first' : 'network-only',
      },
    },
  });
};

// Client-side: Restore from window.__APOLLO_STATE__ if available
const initialState = isBrowser ? (window as unknown as { __APOLLO_STATE__?: NormalizedCacheObject }).__APOLLO_STATE__ : undefined;
export const graphqlClient = buildGraphQLClient(initialState);
