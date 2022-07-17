import "./App.css";
import Navbar from "./components/Navbar";
import { WagmiConfig } from "wagmi";
import web3Client from "./web3/client";
import { client as apolloClient } from "./editorDb/localDb";
import { ApolloProvider } from "@apollo/client";

function App() {
  return (
    <WagmiConfig client={web3Client}>
      <ApolloProvider client={apolloClient}>
        <Navbar />
        <div className="container mx-auto flex items-center">
          <h1 className="text-3xl font-bold underline">hello world</h1>
        </div>
      </ApolloProvider>
    </WagmiConfig>
  );
}

export default App;
