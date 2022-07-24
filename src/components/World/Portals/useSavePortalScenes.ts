import { useCallback, useState } from "react";

export type PortalScene = {
  imageUrl: string | undefined;
};

const useSavePortalScenes = () => {
  const [portalScenes, setPortalScenes] = useState<{
    [toWorldId: string]: PortalScene;
  }>({});

  const setPortalScene = useCallback((worldId: string, scene: PortalScene) => {
    setPortalScenes((existing) => ({
      ...existing,
      [worldId]: scene,
    }));
  }, []);

  return {
    portalScenes,
    setPortalScene,
  };
};

export type UsePortalScenesResult = ReturnType<typeof useSavePortalScenes>;

export default useSavePortalScenes;
