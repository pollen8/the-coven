import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://graphql.fauna.com/graphql',
  headers: {
    "authorization": "Basic Zm5BRHRIODNvdkFDRk42R2Z1YW1jQklTLUhEdWdpQWpNY3VKbkNmSTp3aXRjaGVzOnNlcnZlcg==",
    "X-Schema-Preview": "partial-update-mutation"
  }
});

