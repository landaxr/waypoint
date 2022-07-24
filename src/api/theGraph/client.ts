import { ApolloClient, InMemoryCache } from "@apollo/client";

const subgraphUri =
  "https://api.thegraph.com/subgraphs/name/lpscrypt/waypointmumbai";
// "https://api.thegraph.com/subgraphs/name/lpscrypt/waypointrinkeby";
// "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

export const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

