import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { API_CONFIG } from '../../config/api.config';

// HTTP link to my-cms GraphQL API
const httpLink = createHttpLink({
  uri: API_CONFIG.graphqlApiUrl,
});

/**
 * Build Apollo GraphQL Client for my-cms backend
 * Public-facing client (no authentication required)
 * Backend: https://github.com/doitsu2014/my-cms
 */
export const buildGraphQLClient = () =>
  new ApolloClient({
    link: httpLink,
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

export const graphqlClient = buildGraphQLClient();
