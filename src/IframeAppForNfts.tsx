import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import useClickedAndAudioListener, {
  ClickedAndAudioContext,
} from "./components/World/useClickedAndAudioListener";
import { ApolloProvider } from "@apollo/client";
import WorldFromTokenIdViewOnly from "./components/World/WorldFromTokenIdViewOnly";
import { client } from "./api/theGraph/client";
import WorldFromIpfsViewOnly from "./components/World/WorldFromIpfsViewOnly";

function IFrameAppForNfts() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  return (
    <ApolloProvider client={client}>
      <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
        <HashRouter>
          <Routes>
            <Route path="ipfs/:cid" element={<WorldFromIpfsViewOnly />}/>

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
