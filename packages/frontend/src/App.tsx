import "./App.css";
import Navbar from "./components/Navbar";
import { WagmiConfig } from "wagmi";
import web3Client from "./web3/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Explore from "./components/Explore";
import YourWorlds from "./components/YourWorlds";
import NewWorld from "./World/New";

function App() {
  // const apolloClient = useApolloClient();

  return (
    <WagmiConfig client={web3Client}>
      <HashRouter>
        <Navbar />
        <div className="container mx-auto flex items-center">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/your-worlds" element={<YourWorlds />} />
            <Route path="/worlds/new" element={<NewWorld />} />
          </Routes>
        </div>
      </HashRouter>
    </WagmiConfig>
  );
}

export default App;
