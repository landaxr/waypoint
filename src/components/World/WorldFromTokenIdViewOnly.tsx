import { useParams } from "react-router-dom";
import useLoadWorldAndScene from "../../api/nft/useLoadWorldAndScene";
import { usePortalsFromWorld } from "../../api/theGraph/portalQueries";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneViewerNft from "./Viewer/SceneViewerNft";

const WorldFromTokenIdViewOnly = ({ tokenId }: { tokenId: string }) => {
  const { sceneAndFiles, worldsCid, world, progress } = useLoadWorldAndScene({
    tokenId,
  });

  const portalsOfWorld = usePortalsFromWorld(tokenId);

  if (sceneAndFiles && worldsCid && world) {
    return (
      <SceneViewerNft
        sceneAndFiles={sceneAndFiles}
        portals={portalsOfWorld.data?.portals}
      />
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
