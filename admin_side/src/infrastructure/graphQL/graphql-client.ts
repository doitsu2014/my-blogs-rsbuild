import { ApolloClient, InMemoryCache } from '@apollo/client';

export const buildGraphQLClient = () =>
  new ApolloClient({
    uri: `${process.env.MY_CMS_API_URL || 'http://localhost:4000'}/graphql/immutable`,
    cache: new InMemoryCache()
  });
