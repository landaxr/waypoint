import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { makeExternalUrl } from "../../api/nft/tokenSaver";
import useLoadWorldAndScene from "../../api/nft/useLoadWorldAndScene";
import { usePortalsFromWorld } from "../../api/theGraph/portalQueries";
import { ChainConfig } from "../../web3/chains";
import { LinkKind, MenuItem, UrlKind } from "../Nav/Navbar";
import LoadingScreen from "../Shared/LoadingScreen";
import GetPortalScenes from "./Portals/GetPortalScenes";
import useSavePortalScenes from "./Portals/useSavePortalScenes";
import SceneViewerContents from "./Viewer/SceneViewerContents";

const WorldFromTokenIdViewOnly = ({ tokenId, chain }: { tokenId: string, chain: ChainConfig }) => {
  const { sceneAndFiles, worldsCid, world, progress } = useLoadWorldAndScene({
    tokenId,
  });

  const portalsOfWorld = usePortalsFromWorld(tokenId);
  const portals = portalsOfWorld.data?.portals;
  const { portalsWithScenes, setPortalScene } = useSavePortalScenes(portals);

  if (sceneAndFiles && worldsCid && world) {
    return (
      <>
        <SceneViewerContents
          sceneAndFiles={sceneAndFiles}
          portals={portalsWithScenes}
          menuItems={[]}
        web3Enabled={false}
        />
        {portals && (
          <GetPortalScenes
            portalsInSpace={portals}
            setPortalScene={setPortalScene}
          />
        )}
      </>
    );
  }

  return (
    <LoadingScreen
      loadingProgress={progress}
      title={`Loading world from token id: ${tokenId}`}
    />
  );
};

const WorldFromTokenIdViewOnlyRoute = ({chain}:{chain: ChainConfig}) => {
  let params = useParams();

  const { tokenId } = params;

  if (!tokenId) {
    throw new Error("should have had a token id in params");
  }

  return <WorldFromTokenIdViewOnly tokenId={tokenId} chain={chain} />;
};

export default WorldFromTokenIdViewOnlyRoute;
