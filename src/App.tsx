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
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import WorldFromTokenId from "./components/World/WorldFromTokenId";

const subgraphUri =
  "https://api.thegraph.com/subgraphs/name/lpscrypt/waypointrinkeby"
  // "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

function App() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  return (
    <WagmiConfig client={web3Client}>
      <ApolloProvider client={client}>
        <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/your-worlds" element={<YourWorlds />} />
              <Route path="/worlds">
                <Route path="new" element={<NewWorld />} />
                <Route path="ipfs/:cid">
                  <Route
                    path=""
                    element={<WorldFromIpfsRoute fork={false} />}
                  />
                  <Route
                    path="fork"
                    element={<WorldFromIpfsRoute fork={true} />}
                  />
                </Route>
                <Route path=":tokenId">
                  <Route path="" element={<WorldFromTokenId build={false} />} />
                  <Route
                    path="edit"
                    element={<WorldFromTokenId build={true} />}
                  />
                </Route>
              </Route>
            </Routes>
          </HashRouter>
        </ClickedAndAudioContext.Provider>
      </ApolloProvider>
    </WagmiConfig>
  );
}

export default App;
