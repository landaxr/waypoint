import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function importBuildTarget() {
  if (import.meta.env.VITE_APP_BUILD_TARGET === "nft")
    return import("./IframeAppForNfts");
  return import("./FullApp");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// this allows us to have multiple entry points - one for the full app and
// and one for the nft that is to be rendered on marketplaces such as opensea.
// On those marketplaces, the interactive application is rendered within an IFrame in sandbox mode,
// preventing the nft from using certain functionality like web3 chrome extensions. So this other
// entry point for nfts is used as a more lightweight build where you can just visit spaces but
// there's no web3 login.
importBuildTarget().then(({ default: Environment }) =>
  root.render(
    <React.StrictMode>
      <Environment />
    </React.StrictMode>
  )
);