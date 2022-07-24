import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import useClickedAndAudioListener, {
  ClickedAndAudioContext,
} from "./components/World/useClickedAndAudioListener";
import { ApolloProvider } from "@apollo/client";
import WorldFromTokenIdViewOnly from "./components/World/WorldFromTokenIdViewOnly";
import { client } from "./api/theGraph/client";

function IFrameAppForNfts() {
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

export default IFrameAppForNfts;
