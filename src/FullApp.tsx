import "./App.css";
import { WagmiConfig } from "wagmi";
import web3Client from "./web3/client";
import { HashRouter, Route, Routes, useSearchParams } from "react-router-dom";
import Explore from "./components/Explore";
import YourWorlds from "./components/World/YourWorlds";
import NewWorld from "./components/World/New";
import WorldFromIpfsRoute from "./components/World/WorldFromIpfs";
import useClickedAndAudioListener, {
  ClickedAndAudioContext,
} from "./components/World/useClickedAndAudioListener";
import { ApolloProvider } from "@apollo/client";
import WorldFromTokenId from "./components/World/WorldFromTokenId";
import Map from "./components/Nav/Map";
import { makeClient } from "./api/theGraph/client";
import { getChain } from "./web3/chains";
import { useMemo } from "react";

function App() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  const chain = getChain();

  const client = useMemo(
    () => makeClient(chain.graphQlUrl),
    [chain.graphQlUrl]
  );

  return (
    <WagmiConfig client={web3Client}>
      <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
        <HashRouter>
          <ApolloProvider client={client}>
            <Routes>
              <Route path="/" element={<Explore chain={chain} />} />
              <Route path="/your-worlds" element={<YourWorlds />} />
              <Route path="/worlds">
                <Route path="new" element={<NewWorld chain={chain} />} />
                <Route path="ipfs/:cid">
                  <Route
                    path=""
                    element={<WorldFromIpfsRoute fork={false} chain={chain} />}
                  />
                  <Route
                    path="fork"
                    element={<WorldFromIpfsRoute fork={true} chain={chain} />}
                  />
                </Route>
                <Route path=":tokenId">
                  <Route
                    path=""
                    element={<WorldFromTokenId build={false} chain={chain} />}
                  />
                  <Route
                    path="edit"
                    element={<WorldFromTokenId build={true} chain={chain} />}
                  />
                </Route>
              </Route>
              <Route path="/map" element={<Map />} />
            </Routes>
          </ApolloProvider>
        </HashRouter>
      </ClickedAndAudioContext.Provider>
    </WagmiConfig>
  );
}

export default App;
