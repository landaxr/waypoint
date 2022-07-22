import "./App.css";
import { WagmiConfig } from "wagmi";
import web3Client from "./web3/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Explore from "./components/Explore";
import YourWorlds from "./components/World/YourWorlds";
import NewWorld from "./components/World/New";
import WorldFromIpfsRoute from "./components/World/WorldFromIpfs";
import useClickedAndAudioListener, {
  ClickedAndAudioContext,
} from "./components/World/useClickedAndAudioListener";

function App() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  return (
    <WagmiConfig client={web3Client}>
      <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/your-worlds" element={<YourWorlds />} />
            <Route path="/worlds">
              <Route path="new" element={<NewWorld />} />
              <Route path="ipfs/:cid">
                <Route path="" element={<WorldFromIpfsRoute fork={false} />} />
                <Route
                  path="fork"
                  element={<WorldFromIpfsRoute fork={true} />}
                />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </ClickedAndAudioContext.Provider>
    </WagmiConfig>
  );
}

export default App;
