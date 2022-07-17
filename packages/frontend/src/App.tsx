import "./App.css";
import Navbar from "./components/Navbar";
import { WagmiConfig } from "wagmi";
import client from "./web3/client";

function App() {
  return (
    <WagmiConfig client={client}>
      <Navbar />
      <h1 className="text-3xl font-bold underline">hello world</h1>
    </WagmiConfig>
  );
}

export default App;
