import { useEffect, useMemo, useState } from "react";
import { SceneAndFiles } from "../../types/scene";
import { WorldErc721 } from "../../types/world";
import loadSceneFromIpfs from "../ipfs/ipfsSceneLoader";
import { useErc721TokenForFileUrl, useWorld } from "../theGraph/worldsQueries";

const useLoadWorldAndScene = ({ tokenId }: { tokenId: string }) => {
  const [{ progress, sceneAndFiles }, setLoadedState] = useState<{
    loaded: boolean;
    progress: number;
    error?: boolean;
    sceneAndFiles?: SceneAndFiles;
    token?: WorldErc721;
  }>({
    loaded: false,
    progress: 0,
  });

  const { world } = useWorld(tokenId);

  const tokenMetadata = useErc721TokenForFileUrl(world?.uri);

  const worldsCid = useMemo(() => {
    if (!tokenMetadata || !tokenMetadata.erc721Token?.scene_graph_url)
      return null;

    // hack: grab the cid from the full url of the metadata so we can fetch it at once.
    // url looks like: ipfs://bafybeiax4pfaedwoykqfyqiwyrgtl5ya3vdwjkw2etc4sbljy5rdtkte3m/metadata.json

    const parts = tokenMetadata.erc721Token.scene_graph_url.split("/");

    // second to last part is cid
    return parts[parts.length - 2];
  }, [tokenMetadata]);

  useEffect(() => {
    setLoadedState({
      loaded: false,
      progress: 0,
    });

    if (!worldsCid) return;

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
          worldsCid,
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
  }, [worldsCid]);

  return {
    progress,
    sceneAndFiles,
    world,
    worldsCid,
    name: tokenMetadata.erc721Token?.name,
  };
};

export default useLoadWorldAndScene;
