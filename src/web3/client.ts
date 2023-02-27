import { createClient, configureChains, } from "wagmi";
import { polygonMumbai } from 'wagmi/chains';

import { alchemyProvider } from "wagmi/providers/alchemy";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";


const allowedChains = () => ([polygonMumbai]);

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  allowedChains(), 
  [alchemyProvider({ apiKey: import.meta.env.VITE_APP_ALCHEMY_ID! })],
);

const { connectors } = getDefaultWallets({
  appName: "w@y_p01nt",
  chains,
});

// Set up client
const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { client, chains };
