import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: import.meta.env.DEV ? import.meta.env.WXT_DEV_BASE_API : import.meta.env.PROD_DEV_BASE_API,
  cache: new InMemoryCache(),
});