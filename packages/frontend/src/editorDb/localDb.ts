import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
});

const GET_LOCAL_WORLD = gql`
  query GetWorld($id: String!) {
    world(id: $String) {
      id
      name
      elements
      environment
    }
  }
`;
