import { ApolloClient, InMemoryCache } from "@apollo/client";

export const makeClient = (subgraphUri: string) =>
  new ApolloClient({
    uri: subgraphUri,
    cache: new InMemoryCache(),
  });
