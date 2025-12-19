import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAuthHeaders } from '../utilities.auth';

// HTTP link to my-cms GraphQL API
const httpLink = createHttpLink({
  uri: import.meta.env.PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
});

// Auth link to add Keycloak Bearer token to requests
const authLink = setContext((_, { headers }) => {
  const authHeaders = getAuthHeaders();
  return {
    headers: {
      ...headers,
      ...authHeaders,
    }
  };
});

/**
 * Build Apollo GraphQL Client for my-cms backend
 * Configured with Keycloak authentication
 * Backend: https://github.com/doitsu2014/my-cms
 */
export const buildGraphQLClient = () =>
  new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });

/**
 * Build GraphQL Client for cache API (optional)
 */
export const buildCacheGraphQLClient = () =>
  new ApolloClient({
    link: authLink.concat(createHttpLink({
      uri: import.meta.env.PUBLIC_GRAPHQL_CACHE_API_URL || import.meta.env.PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
    })),
    cache: new InMemoryCache(),
  });

