import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import useClickedAndAudioListener, {
  ClickedAndAudioContext,
} from "./components/World/useClickedAndAudioListener";
import { ApolloProvider } from "@apollo/client";
import WorldFromTokenIdViewOnly from "./components/World/WorldFromTokenIdViewOnly";
import WorldFromIpfsViewOnly from "./components/World/WorldFromIpfsViewOnly";
import { useChainConfig } from "./web3/chains";
import { useMemo } from "react";
import { makeClient } from "./api/theGraph/client";

function IFrameAppForNfts() {
  const clickedAndAudiListener = useClickedAndAudioListener();
  const chain = useChainConfig();

  const client = useMemo(
    () => makeClient(chain.graphQlUrl),
    [chain.graphQlUrl]
  );

  return (
    <ApolloProvider client={client}>
      <ClickedAndAudioContext.Provider value={clickedAndAudiListener}>
        <HashRouter>
          <Routes>
            <Route path="ipfs/:cid" element={<WorldFromIpfsViewOnly />} />

            <Route
              path=":tokenId"
              element={<WorldFromTokenIdViewOnly chain={chain} />}
            ></Route>
          </Routes>
        </HashRouter>
      </ClickedAndAudioContext.Provider>
    </ApolloProvider>
  );
}

export default IFrameAppForNfts;
