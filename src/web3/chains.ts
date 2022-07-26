import { chain, Chain } from "wagmi";

export type ChainConfig = {
  graphQlUrl: string;
  contractAddress: string;
  name: string;
  path: string;
  nftBaseUrl: string;
  externalBaseUrl: string;
  openseaCollectionUrl: string;
  allowedChains: Chain[];
};

export const contractAddresses = {
  localHost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  rinkeby: "0x8f181e382dF37f4DAB729c1868D0A190A929D614",
  mumbai: "0x9db2f20e541412292677aa43e8d09732f3998992",
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

export const chains: { [chainId: string]: ChainConfig } = {
  mumbai: {
    graphQlUrl: subgrapUrls.mumbai,
    contractAddress: contractAddresses.mumbai,
    name: "Polygon (Mumbai)",
    path: "mumbai",
    nftBaseUrl: "https://waypoint-nft.on.fleek.co",
    externalBaseUrl: "https://waypoint.on.fleek.co",
    openseaCollectionUrl:
      "https://testnets.opensea.io/collection/name-l3isedjj89",
    allowedChains: [chain.polygonMumbai],
  },
  rinkeby: {
    graphQlUrl: subgrapUrls.rinkeby,
    contractAddress: contractAddresses.rinkeby,
    name: "Rinkeby",
    path: "rinkeby",
    nftBaseUrl: "https://rinkeby-waypoint-nft.on.fleek.co",
    externalBaseUrl: "https://rinkeby-waypoint.on.fleek.co",
    openseaCollectionUrl:
      "https://testnets.opensea.io/collection/name-mozmnwk4sh",
    allowedChains: [chain.rinkeby],
  },
};

export const defaultChain: string = "mumbai";

export const getChain = () => {
  const chainId = process.env.REACT_APP_CHAIN || defaultChain;

  const chain = chains[chainId];

  if (!chain) throw new Error(`invalid chain of ${chainId}`);

  return chain;
};
