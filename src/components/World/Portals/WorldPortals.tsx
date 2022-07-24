import Portal from "./Portal";
import { PortalWithScene } from "./useSavePortalScenes";

const WorldPortals = ({
  portals,
  navigate,
  getWorldPath,
}: {
  portals: PortalWithScene[];
  navigate: (to: string) => void;
  getWorldPath: (tokenId: string) => string;
}) => {
  return (
    <>
      {portals.map((portal, i) => (
        <Portal
          portal={portal}
          key={portal.portal.id}
          navigate={navigate}
          getWorldPath={getWorldPath}
        />
      ))}
    </>
  );
};

export default WorldPortals;
