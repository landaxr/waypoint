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
import { ApolloProvider } from "@apollo/client";
import WorldFromTokenId from "./components/World/WorldFromTokenId";
import Map from "./components/Nav/Map";
import { client } from "./api/theGraph/client";
import { chains } from "./web3/chains";
import { useParams } from "react-router";

function AppRoutes() {
const { chainParam} = useParams();
if (!chainParam) {
  throw new Error('should have chain in params');
}

const chain = chains.find(({path}) => path === chainParam);

if (!chain) throw new Error('invalid chain');


  return (
    <Routes>
      <Route path="/" element={<Explore />} />
      <Route path="/your-worlds" element={<YourWorlds />} />
      <Route path="/worlds">
        <Route path="new" element={<NewWorld />} />
        <Route path="ipfs/:cid">
          <Route path="" element={<WorldFromIpfsRoute fork={false} chain={chain} />} />
          <Route path="fork" element={<WorldFromIpfsRoute fork={true} chain={chain} />} />
        </Route>
        <Route path=":tokenId">
          <Route path="" element={<WorldFromTokenId build={false} chain={chain} />} />
          <Route path="edit" element={<WorldFromTokenId build={true} chain={chain} />} />
        </Route>
      </Route>
      <Route path="/map" element={<Map />} />
    </Routes>
  );
}

function ChainRoutes() {

  return <>
  <Routes></Routes>
  {chains.map(chain => (<Route path={chain.path} element={<AppRoutes/>} />))}
  </>
}

function App() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  return (
    <WagmiConfig client={web3Client}>
      <ApolloProvider client={client}>
        <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
          <HashRouter><AppRoutes/></HashRouter>
        </ClickedAndAudioContext.Provider>
      </ApolloProvider>
    </WagmiConfig>
  );
}

export default App;
