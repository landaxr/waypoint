import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import useClickedAndAudioListener, {
  ClickedAndAudioContext,
} from "./components/World/useClickedAndAudioListener";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import WorldFromTokenIdViewOnly from "./components/World/WorldFromTokenIdViewOnly";

const subgraphUri =
  "https://api.thegraph.com/subgraphs/name/lpscrypt/waypointrinkeby";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

function App() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  return (
    <ApolloProvider client={client}>
      <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
        <HashRouter>
          <Routes>
            <Route
              path=":tokenId"
              element={<WorldFromTokenIdViewOnly />}
            ></Route>
          </Routes>
        </HashRouter>
      </ClickedAndAudioContext.Provider>
    </ApolloProvider>
  );
}

export default App;
