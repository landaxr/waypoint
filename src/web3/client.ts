import { createClient, configureChains } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { getChain } from "./chains";
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';

const alchemyId = process.env.ALCHEMY_ID;

const chain = getChain();

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(chain.allowedChains, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: 'w@y_p01nt',
  chains
});

// Set up client
const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export {client, chains};
