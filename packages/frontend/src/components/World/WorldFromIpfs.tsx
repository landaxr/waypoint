import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import loadSceneFromIpfs from "../../api/ipfsLoader";
import { SceneAndFiles } from "../../types/scene";
import SceneBuilder from "./Builder/SceneBuilder";
import { useBuilder } from "./Builder/useBuilder";

const LoadedWorldFromIpfs = ({
  scene,
  files,
  cid,
}: SceneAndFiles & { cid: string }) => {
  const builderState = useBuilder({ scene, files });

  return (
    <SceneBuilder
      builderState={builderState}
      scene={builderState.scene}
      worldId={cid}
    />
  );
};

const WorldFromIpfs = ({ cid }: { cid: string }) => {
  const [{ loaded, sceneAndFiles }, setLoadedState] = useState<{
    loaded: boolean;
    sceneAndFiles?: SceneAndFiles;
  }>({
    loaded: false,
  });

  useEffect(() => {
    setLoadedState({ loaded: false });

    (async () => {
      const { scene, files } = await loadSceneFromIpfs(cid);

      setLoadedState({
        loaded: true,
        sceneAndFiles: {
          scene,
          files,
        },
      });
    })();
  }, [cid]);

  if (!loaded || !sceneAndFiles) return null;

  return <LoadedWorldFromIpfs {...sceneAndFiles} cid={cid} />;
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
