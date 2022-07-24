import { SceneAndFiles } from "../../../types/scene";
import SceneViewerContents from "./SceneViewerContents";
import { PortalWithScene } from "../Portals/useSavePortalScenes";

/**
 * Renders a view only scene viewer, without any smart contract ability.  This is what
 * is rendered on nft marketplaces
 * @param param0 
 * @returns 
 */
const SceneViewerIFrame = ({
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

export default SceneViewerIFrame;
