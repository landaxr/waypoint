import { SceneAndFiles } from "../../../types/scene";
import SceneViewerContents from "./SceneViewerContents";
import { PortalWithScene } from "../Portals/useSavePortalScenes";

const SceneViewerNft = ({
  sceneAndFiles,
  portals,
}: {
  sceneAndFiles: SceneAndFiles;
  portals: PortalWithScene[] | undefined;
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
