import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import useLoadWorldAndScene from "../../api/nft/useLoadWorldAndScene";
import { usePortalsFromWorld } from "../../api/theGraph/portalQueries";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneBuilder from "./Builder/SceneBuilder";
import GetPortalScenes from "./Portals/GetPortalScenes";
import useSavePortalScenes from "./Portals/useSavePortalScenes";
import SceneViewerFull from "./Viewer/SceneViewerFull";

/**
 * This loads a world from a token id, along with its scene
 * @param param0
 * @returns
 */
const WorldFromTokenId = ({
  tokenId,
  edit,
}: {
  tokenId: string;
  edit: boolean;
}) => {
  const { progress, sceneAndFiles, world, worldsCid, name } =
    useLoadWorldAndScene({
      tokenId,
    });

  const portalsFromWorld = usePortalsFromWorld(tokenId);
  const portals = portalsFromWorld.data?.portals;
  const { portalsWithScenes, setPortalScene } = useSavePortalScenes(portals);
  const navigate = useNavigate();

  const handleStartFork = useCallback(() => {
    navigate(`edit`);
  }, [navigate]);

  const { address } = useAccount();

  const canBuild = world?.owner.id === address?.toLowerCase();
  const showBuilder = edit && canBuild;
  if (sceneAndFiles && worldsCid && world) {
    return (
      <>
        {showBuilder ? (
          <SceneBuilder
            sceneAndFiles={sceneAndFiles}
            cid={worldsCid}
            tokenId={tokenId}
            pageTitle={`Editing world at token ${tokenId}`}
            portals={portalsWithScenes}
            worldName={name}
          />
        ) : (
          <SceneViewerFull
            sceneAndFiles={sceneAndFiles}
            pageTitle={`Viewing world at token ${tokenId}`}
            handleStartEdit={handleStartFork}
            canEdit={canBuild}
            editText="Edit"
            portals={portalsWithScenes}
          />
        )}
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

const WorldFromTokenIdRoute = ({ build }: { build: boolean }) => {
  let params = useParams();

  const { tokenId } = params;

  if (!tokenId) {
    throw new Error("should have had a token id in params");
  }

  return <WorldFromTokenId tokenId={tokenId} edit={build} />;
};

export default WorldFromTokenIdRoute;
