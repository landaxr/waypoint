import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import loadSceneFromIpfs from "../../api/ipfsLoader";
import { SceneAndFiles } from "../../types/scene";
import SceneBuilder from "./Builder/SceneBuilder";
import { useBuilder } from "./Builder/useBuilder";

const WorldFromIpfs = ({ cid }: { cid: string }) => {
  const [{ loadingState, sceneAndFiles }, setLoadedState] = useState<{
    loadingState: {
      loaded: boolean;
      progress: number;
    };
    sceneAndFiles: SceneAndFiles;
  }>({
    loadingState: {
      loaded: false,
      progress: 0,
    },
    sceneAndFiles: {
      scene: {},
      files: {},
    },
  });

  useEffect(() => {
    setLoadedState({
      loadingState: {
        loaded: false,
        progress: 0,
      },
      sceneAndFiles: { scene: {}, files: {} },
    });

    (async () => {
      const { scene, files } = await loadSceneFromIpfs(cid);

      setLoadedState({
        loadingState: {
          loaded: true,
          progress: 1,
        },
        sceneAndFiles: {
          scene,
          files,
        },
      });
    })();
  }, [cid]);

  const builderState = useBuilder({ sceneAndFiles, loadingState });

  return (
    <SceneBuilder
      builderState={builderState}
      scene={builderState.scene}
      worldId={cid}
    />
  );
};

const WorldFromIpfsRoute = () => {
  let params = useParams();

  const { cid } = params;

  if (!cid) {
    throw new Error("should have had a cid in params");
  }

  return <WorldFromIpfs cid={cid} />;
};

export default WorldFromIpfsRoute;
