import { useEffect } from "react";
import { PortalData } from "../../../api/theGraph/portalQueries";
import {
  useErc721TokenForFileUrl,
  useWorld,
} from "../../../api/theGraph/worldsQueries";
import { PortalScene, UsePortalScenesResult } from "./useSavePortalScenes";

const PortalSceneLoader = ({
  portal,
  setPortalScene,
}: {
  portal: PortalData;
  setPortalScene: (worldId: string, scene: PortalScene) => void;
}) => {
  const worldId = portal.targetId;
  const world = useWorld(worldId);

  const { erc721Token } = useErc721TokenForFileUrl(world.world?.uri);

  useEffect(() => {
    if (erc721Token) {
      setPortalScene(worldId, {
        token: erc721Token,
      });
    }
  }, [erc721Token, setPortalScene, worldId]);

  return null;
};

const GetPortalScenes = ({
  portalsInSpace,
  setPortalScene,
}: {
  portalsInSpace: PortalData[];
} & Pick<UsePortalScenesResult, "setPortalScene">) => {
  return (
    <>
      {portalsInSpace.map((portal) => (
        <PortalSceneLoader
          key={portal.id}
          portal={portal}
          setPortalScene={setPortalScene}
        />
      ))}
    </>
  );
};

export default GetPortalScenes;
