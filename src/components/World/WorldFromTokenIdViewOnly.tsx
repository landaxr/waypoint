import { useParams } from "react-router-dom";
import useLoadWorldAndScene from "../../api/useLoadWorldAndScene";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneViewerNoNav from "./Viewer/SceneViewerNoNav";

const WorldFromTokenIdViewOnly = ({ tokenId }: { tokenId: string }) => {
  const { sceneAndFiles, worldsCid, world, progress } = useLoadWorldAndScene({
    tokenId,
  });

  if (sceneAndFiles && worldsCid && world) {
    return (
      <SceneViewerNoNav
        sceneAndFiles={sceneAndFiles}
        pageTitle={`Viewing world at token ${tokenId}`}
        handleStartEdit={() => {}}
        canEdit={false}
        editText="Edit"
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
