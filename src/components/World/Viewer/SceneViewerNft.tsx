import { SceneAndFiles } from "../../../types/scene";
import { PortalData } from "../../../api/theGraph/portalQueries";
import SceneViewerContents from "./SceneViewerContents";

const SceneViewerNft = ({
  sceneAndFiles,
  portals,
}: {
  sceneAndFiles: SceneAndFiles;
  portals: PortalData[] | undefined;
}) => {
  // todo: share this code with SceneViewer and SceneBuilder
  return (
    <SceneViewerContents
      menuItems={[]}
      portals={portals}
      sceneAndFiles={sceneAndFiles}
    />
  );
};

export default SceneViewerNft;
