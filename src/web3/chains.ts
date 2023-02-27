import { polygonMumbai } from 'wagmi/chains';
import { Chain, useChainId } from "wagmi";

export type ChainConfig = {
  graphQlUrl: string;
  name: string;
  path: string;
  nftBaseUrl: string;
  externalBaseUrl: string;
  openseaCollectionUrl: string;
  allowedChains: Chain[];
};


// export const localContractAddress =
//   "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// export const rinkebyContractAddress =
//   "0x8f181e382dF37f4DAB729c1868D0A190A929D614";
// export const mumbaiContractAddress =
//   "0x9db2f20e541412292677aa43e8d09732f3998992";

export const subgrapUrls = {
  localHost: "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract",
  rinkeby: "https://api.thegraph.com/subgraphs/name/lpscrypt/waypointrinkeby",
  mumbai: "https://api.thegraph.com/subgraphs/name/lpscrypt/waypointmumbai",
};

export const chains: { [chainId: number]: ChainConfig } = {
  [polygonMumbai.id]: {
    graphQlUrl: subgrapUrls.mumbai,
    name: "Polygon (Mumbai)",
    path: "mumbai",
    nftBaseUrl: "https://waypoint-nft.on.fleek.co",
    externalBaseUrl: "https://waypoint.on.fleek.co",
    openseaCollectionUrl:
      "https://testnets.opensea.io/collection/name-l3isedjj89",
    allowedChains: [polygonMumbai],
  },
  // rinkeby: {
  //   graphQlUrl: subgrapUrls.rinkeby,
  //   name: "Rinkeby",
  //   path: "rinkeby",
  //   nftBaseUrl: "https://rinkeby-waypoint-nft.on.fleek.co",
  //   externalBaseUrl: "https://rinkeby-waypoint.on.fleek.co",
  //   openseaCollectionUrl:
  //     "https://testnets.opensea.io/collection/name-mozmnwk4sh",
  //   allowedChains: [chain.rinkeby],
  // },
};

export const useChainConfig = (): ChainConfig => {
  const chainId = useChainId();

  console.log(chainId);

  const chain = chainId ? chains[chainId]! : chains[polygonMumbai.id];

  return chain;
};
