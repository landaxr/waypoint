import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import useLoadWorldAndScene from "../../api/nft/useLoadWorldAndScene";
import { usePortalsFromWorld } from "../../api/theGraph/portalQueries";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneBuilder from "./Builder/SceneBuilder";
import SceneViewer from "./Viewer/SceneViewer";

const WorldFromTokenId = ({
  tokenId,
  edit,
}: {
  tokenId: string;
  edit: boolean;
}) => {
  const { progress, sceneAndFiles, world, worldsCid } = useLoadWorldAndScene({
    tokenId,
  });

  const portalsOfWorld = usePortalsFromWorld(tokenId);

  const navigate = useNavigate();

  const handleStartFork = useCallback(() => {
    navigate(`edit`);
  }, [navigate]);

  const { address } = useAccount();

  const canBuild = world?.owner.id === address?.toLowerCase();
  if (sceneAndFiles && worldsCid && world) {
    if (edit && canBuild)
      return (
        <SceneBuilder
          sceneAndFiles={sceneAndFiles}
          cid={worldsCid}
          tokenId={tokenId}
          pageTitle={`Editing world at token ${tokenId}`}
          portals={portalsOfWorld.data?.portals}
        />
      );
    return (
      <SceneViewer
        sceneAndFiles={sceneAndFiles}
        pageTitle={`Viewing world at token ${tokenId}`}
        handleStartEdit={handleStartFork}
        canEdit={canBuild}
        editText="Edit"
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

const WorldFromTokenIdRoute = ({ build }: { build: boolean }) => {
  let params = useParams();

  const { tokenId } = params;

  if (!tokenId) {
    throw new Error("should have had a token id in params");
  }

  return <WorldFromTokenId tokenId={tokenId} edit={build} />;
};

export default WorldFromTokenIdRoute;
