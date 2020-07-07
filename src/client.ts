import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'https://graphql.fauna.com/graphql',
  headers: {
    "authorization": "Basic Zm5BRHRIODNvdkFDRk42R2Z1YW1jQklTLUhEdWdpQWpNY3VKbkNmSTp3aXRjaGVzOnNlcnZlcg==",
    "X-Schema-Preview": "partial-update-mutation"
  }
});

