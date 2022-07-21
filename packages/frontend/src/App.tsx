import "./App.css";
import { WagmiConfig } from "wagmi";
import web3Client from "./web3/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Explore from "./components/Explore";
import YourWorlds from "./components/World/YourWorlds";
import NewWorld from "./components/World/New";
import WorldFromIpfsRoute from "./components/World/WorldFromIpfs";

function App() {
  return (
    <WagmiConfig client={web3Client}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/your-worlds" element={<YourWorlds />} />
          <Route path="/worlds">
            <Route path="new" element={<NewWorld />} />
            <Route path="ipfs/:cid" element={<WorldFromIpfsRoute />} />
          </Route>
        </Routes>
      </HashRouter>
    </WagmiConfig>
  );
}

export default App;
