import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loadSceneFromIpfs from "../../api/ipfs/ipfsSceneLoader";
import { SceneAndFiles } from "../../types/scene";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneBuilder from "./Builder/SceneBuilder";
import SceneViewerFull from "./Viewer/SceneViewerFull";

const WorldFromIpfs = ({ cid, edit }: { cid: string; edit: boolean }) => {
  const [{ progress, sceneAndFiles }, setLoadedState] = useState<{
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

  const navigate = useNavigate();

  const handleStartFork = useCallback(() => {
    navigate(`fork`);
  }, [navigate]);

  if (sceneAndFiles) {
    if (edit)
      return (
        <SceneBuilder
          sceneAndFiles={sceneAndFiles}
          cid={cid}
          pageTitle={`Forking ipfs://${cid}`}
          portals={undefined}
          worldName={undefined}
        />
      );
    return (
      <SceneViewerFull
        sceneAndFiles={sceneAndFiles}
        handleStartEdit={handleStartFork}
        pageTitle={`Viewing world from ipfs://${cid}`}
        canEdit
        editText="Fork"
        portals={undefined}
      />
    );
  }

  return (
    <LoadingScreen
      loadingProgress={progress}
      title={`Loading world from IPFS: ipfs://${cid}`}
    />
  );
};

const WorldFromIpfsRoute = ({ fork }: { fork: boolean }) => {
  let params = useParams();

  const { cid } = params;

  if (!cid) {
    throw new Error("should have had a cid in params");
  }

  return <WorldFromIpfs cid={cid} edit={fork} />;
};

export default WorldFromIpfsRoute;
