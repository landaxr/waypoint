import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import loadSceneFromIpfs from "../../api/ipfsLoader";
import { useWorld } from "../../api/worldsQueries";
import { SceneAndFiles } from "../../types/scene";
import { WorldErc721 } from "../../types/world";
import LoadingScreen from "../Shared/LoadingScreen";
import SceneBuilder from "./Builder/SceneBuilder";
import SceneViewer from "./Viewer/SceneViewer";

const WorldFromTokenId = ({
  tokenId,
  edit,
}: {
  tokenId: string;
  edit: boolean;
}) => {
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

  const erc721TokenUri = world?.uri;

  const worldsCid = useMemo(() => {
    if (!erc721TokenUri) return null;
    // hack: grab the cid from the full url of the token

    // url looks like: ipfs://bafybeiax4pfaedwoykqfyqiwyrgtl5ya3vdwjkw2etc4sbljy5rdtkte3m/erc721.json

    const parts = erc721TokenUri.split("/");

    // second to last part is cid
    return parts[parts.length - 2];
  }, [erc721TokenUri]);

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

  const navigate = useNavigate();

  const handleStartFork = useCallback(() => {
    navigate(`edit`);
  }, [navigate]);

  const { address } = useAccount();

  const canBuild = world?.owner.id === address?.toLowerCase();
  if (sceneAndFiles && worldsCid && world) {
    if (edit && canBuild)
      return (
        <SceneBuilder
          sceneAndFiles={sceneAndFiles}
          cid={worldsCid}
          tokenId={tokenId}
          pageTitle={`Editing world at token ${tokenId}`}
        />
      );
    return (
      <SceneViewer
        sceneAndFiles={sceneAndFiles}
        pageTitle={`Viewing world at token ${tokenId}`}
        handleStartEdit={handleStartFork}
        canEdit={canBuild}
        editText="Edit"
      />
    );
  }

  return (
    <LoadingScreen
      loadingProgress={progress}
      title={`Loading world from token id: ${tokenId}`}
    />
  );
};

const WorldFromTokenIdRoute = ({ build }: { build: boolean }) => {
  let params = useParams();

  const { tokenId } = params;

  if (!tokenId) {
    throw new Error("should have had a token id in params");
  }

  return <WorldFromTokenId tokenId={tokenId} edit={build} />;
};

export default WorldFromTokenIdRoute;
