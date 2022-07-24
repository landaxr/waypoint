import { useCallback, useEffect, useState } from "react";
import { PortalData } from "../../../api/theGraph/portalQueries";
import { WorldErc721 } from "../../../types/world";

export type PortalScene = {
  token: Pick<WorldErc721, "image" | "scene_graph_url" | "name">;
};

export type PortalWithScene = {
  portal: PortalData;
  scene?: PortalScene;
};

const useSavePortalScenes = (portals: PortalData[] | undefined) => {
  const [portalScenes, setPortalScenes] = useState<{
    [toWorldId: string]: PortalScene;
  }>({});

  const [portalsWithScenes, setPortalsWithScenes] = useState<
    {
      portal: PortalData;
      scene?: PortalScene;
    }[]
  >();

  useEffect(() => {
    const portalsWithScenes = portals?.map((portal) => ({
      portal,
      scene: portalScenes[portal.targetId],
    }));

    setPortalsWithScenes(portalsWithScenes);
  }, [portals, portalScenes]);

  const setPortalScene = useCallback((worldId: string, scene: PortalScene) => {
    setPortalScenes((existing) => ({
      ...existing,
      [worldId]: scene,
    }));
  }, []);

  return {
    portalsWithScenes,
    setPortalScene,
  };
};

export type UsePortalScenesResult = ReturnType<typeof useSavePortalScenes>;

export default useSavePortalScenes;
