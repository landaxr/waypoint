import { Select, useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SceneAndFiles } from "../../../types/scene";
import SetRaycasterFromCamera from "./SetRaycasterFromCamera";
import { useBuilder } from "./hooks/useBuilder";
import BuilderControls from "./BuilderControls";
import DynamicEnvironment from "../DynamicEnvironment";
import ElementsTree from "../Elements/ElementsTree";
import BuilderMenu from "./BuilderMenu";
import Navbar, { LinkKind, MenuItem } from "../../Nav/Navbar";
import SavedSceneSuccessModal from "./SavedSceneSuccessModal";
import { ClickedAndAudioContext } from "../useClickedAndAudioListener";
import AttachAudioListenerToCamera from "../Elements/utils/AttachAudioListenerToCamera";
import { MintWorldStatus } from "../../../api/smartContract/useWorldMinter";
import { filterUndefined } from "../../../api/sceneParser";
import {
  UpdateWorldDialogModal,
  MintToNewWorldDialogModal,
} from "../BuilderDialogs/MintDialogModals";
import SetCaptureScreenshotFn from "../../Shared/SetCaptureScreenshotFn";
import WorldPortals from "../Portals/WorldPortals";
import { useNavigate } from "react-router";
import { getWorldsPath } from "../Viewer/SceneViewerContents";
import { PortalWithScene } from "../Portals/useSavePortalScenes";
import GetCamera from "../../Shared/GetCamera";
import { ChainConfig } from "../../../web3/chains";

const rootPath: string[] = [];

const buildMenu = ({
  handleSaveToIpfs,
  savingScene,
  disabled,
  createWorldStatus,
  updateWorldStatus,
  handleOpenUpdateWorldDialog,
  handleOpenCreateWorlDialog,
  pageTitle,
  tokenId,
}: {
  handleSaveToIpfs: () => void;
  savingScene: boolean;
  disabled: boolean;
  // createWorld: () => void;
  // updateWorld: (tokenId: string) => void;
  createWorldStatus: MintWorldStatus;
  updateWorldStatus: MintWorldStatus;
  handleOpenUpdateWorldDialog: () => void;
  handleOpenCreateWorlDialog: () => void;
  tokenId: string | undefined;
  pageTitle: string;
}): MenuItem[] => {
  const mintButton = filterUndefined([
    tokenId && updateWorldStatus.isAllowedToMint
      ? {
          action: handleOpenUpdateWorldDialog,
          title: "Update Token with Scene",
          kind: LinkKind.button,
        }
      : undefined,
    !tokenId && createWorldStatus.isAllowedToMint
      ? {
          action: handleOpenCreateWorlDialog,
          kind: LinkKind.button,
          title: "Mint World with Scene",
        }
      : undefined,
  ]);

  return [
    { link: "#", title: pageTitle, kind: LinkKind.link },
    {
      action: handleSaveToIpfs,
      title: savingScene ? "Saving to IPFS" : "Save to IPFS",
      kind: LinkKind.button,
      disabled,
    },
    ...mintButton,
  ];
};

const SceneBuilder = ({
  sceneAndFiles,
  isNew,
  cid,
  tokenId,
  pageTitle,
  portals,
  worldName,
  chain,
}: {
  sceneAndFiles: SceneAndFiles;
  isNew?: boolean;
  cid?: string;
  tokenId?: string;
  pageTitle: string;
  portals: PortalWithScene[] | undefined;
  worldName: string | undefined;
  chain: ChainConfig;
}) => {
  const builderState = useBuilder({
    sceneAndFiles,
    tokenId,
    chain,
  });

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const { isDragging, getRootProps, getInputProps, raycasterRef } =
    builderState;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [updateWorldDialogOpen, setUpdateWorldDialogOpen] = useState(false);
  const [mintNewWorldDialogOpen, setMintNewWorldDialogOpen] = useState(false);

  useEffect(() => {
    setMenuItems(
      buildMenu({
        pageTitle,
        tokenId,
        handleSaveToIpfs: builderState.handleSaveToIpfs,
        savingScene: builderState.saveSceneStatus.saving,
        disabled: builderState.saveSceneStatus.saving || !builderState.canSave,
        // createWorld: builderState.createWorld,
        // updateWorld: builderState.updateWorld,
        createWorldStatus: builderState.worldTokenCreator.status,
        updateWorldStatus: builderState.worldTokenUpdater.status,
        handleOpenUpdateWorldDialog: () => setUpdateWorldDialogOpen(true),
        handleOpenCreateWorlDialog: () => setMintNewWorldDialogOpen(true),
      })
    );
  }, [
    builderState.handleSaveToIpfs,
    builderState.saveSceneStatus.saving,
    builderState.canSave,
    isNew,
    cid,
    builderState.worldTokenCreator.status,
    builderState.worldTokenUpdater.status,
    pageTitle,
    tokenId,
  ]);

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

  const navigate = useNavigate();

  const stopPropagation = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <Navbar centerItems={menuItems} />
      <div
        className={clsx("w-screen h-screen", cursorClass, {
          "border-2": isDragging,
          "border-black": isDragging,
        })}
        {...getRootProps()}
      >
        <input type="hidden" {...getInputProps()} />
        <BuilderMenu {...builderState} />
        <Canvas>
          <SetCaptureScreenshotFn
            setCaptureScreenShotFn={builderState.setCaptureScreenShotFn}
          />
          <GetCamera setCamera={builderState.setCamera} />
          <ContextBridge>
            <SetRaycasterFromCamera raycasterRef={raycasterRef} />
            <AttachAudioListenerToCamera />
            <DynamicEnvironment
              environment={builderState.scene.environment}
              files={builderState.files}
            />
            <Select onChange={builderState.selectTargetElement}>
              <ElementsTree
                elements={builderState.scene.elements}
                parentId={null}
                parentPath={rootPath}
                files={builderState.files}
              />
            </Select>
            <BuilderControls {...builderState} />
            {portals ? (
              <WorldPortals
                portals={portals}
                navigate={navigate}
                getWorldPath={getWorldsPath}
              />
            ) : null}
          </ContextBridge>
        </Canvas>
        <div onClick={stopPropagation}>
          {builderState.saveSceneStatus.saved && (
            <SavedSceneSuccessModal
              savedCid={builderState.saveSceneStatus.savedCid}
            />
          )}
          {updateWorldDialogOpen && (
            <UpdateWorldDialogModal
              currentWorldTokenId={tokenId}
              handleClose={() => setUpdateWorldDialogOpen(false)}
              worldTokenUpdater={builderState.worldTokenUpdater}
              currentWorldName={worldName}
              sceneAndFiles={{
                scene: builderState.scene,
                files: builderState.files,
              }}
            />
          )}
          {mintNewWorldDialogOpen && (
            <MintToNewWorldDialogModal
              handleClose={() => setMintNewWorldDialogOpen(false)}
              worldTokenCreator={builderState.worldTokenCreator}
              sceneAndFiles={{
                scene: builderState.scene,
                files: builderState.files,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SceneBuilder;
