import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import loadSceneFromIpfs from "../../api/ipfsLoader";
import { SceneAndFiles } from "../../types/scene";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneBuilder from "./Builder/SceneBuilder";

const WorldFromIpfs = ({ cid }: { cid: string }) => {
  const [{ loaded, progress, sceneAndFiles }, setLoadedState] = useState<{
    loaded: boolean;
    progress: number;
    error?: boolean;
    sceneAndFiles?: SceneAndFiles;
  }>({
    loaded: false,
    progress: 0,
  });

  useEffect(() => {
    setLoadedState({
      loaded: false,
      progress: 0,
    });

    const handleLoadProgressed = (progress: number) => {
      setLoadedState((existing) => ({
        ...existing,
        loadingState: {
          progress: progress,
          loaded: false,
        },
      }));
    };

    (async () => {
      try {
        const { scene, files } = await loadSceneFromIpfs(
          cid,
          handleLoadProgressed
        );
        setLoadedState({
          loaded: true,
          progress: 1,
          sceneAndFiles: {
            scene,
            files,
          },
        });
      } catch (e) {
        console.error(e);

        setLoadedState((existing) => ({
          ...existing,
          loaded: false,
          progress: 0,
          error: true,
        }));
      }
    })();
  }, [cid]);

  if (sceneAndFiles) {
    return <SceneBuilder sceneAndFiles={sceneAndFiles} worldId={cid} />;
  }

  return (
    <LoadingScreen
      loadingProgress={progress}
      title={`Loading world from IPFS: ipfs://${cid}`}
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
