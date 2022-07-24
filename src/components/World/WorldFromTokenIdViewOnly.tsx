import { useParams } from "react-router-dom";
import useLoadWorldAndScene from "../../api/nft/useLoadWorldAndScene";
import { usePortalsFromWorld } from "../../api/theGraph/portalQueries";
import LoadingScreen from "../Shared/LoadingScreen";
import GetPortalScenes from "./Portals/GetPortalScenes";
import useSavePortalScenes from "./Portals/useSavePortalScenes";
import SceneViewerNft from "./Viewer/SceneViewerNft";

const WorldFromTokenIdViewOnly = ({ tokenId }: { tokenId: string }) => {
  const { sceneAndFiles, worldsCid, world, progress } = useLoadWorldAndScene({
    tokenId,
  });

  const portalsOfWorld = usePortalsFromWorld(tokenId);
  const portals = portalsOfWorld.data?.portals;
  const { portalsWithScenes, setPortalScene } = useSavePortalScenes(portals);

  if (sceneAndFiles && worldsCid && world) {
    return (
      <>
        <SceneViewerNft
          sceneAndFiles={sceneAndFiles}
          portals={portalsWithScenes}
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

const WorldFromTokenIdViewOnlyRoute = () => {
  let params = useParams();

  const { tokenId } = params;

  if (!tokenId) {
    throw new Error("should have had a token id in params");
  }

  return <WorldFromTokenIdViewOnly tokenId={tokenId} />;
};

export default WorldFromTokenIdViewOnlyRoute;
