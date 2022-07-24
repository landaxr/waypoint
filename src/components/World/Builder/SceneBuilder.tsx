import { Select, useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { Leva } from "leva";
import { useEffect, useMemo, useState } from "react";
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
import { MintWorldStatus } from "../../../api/smartContracts/useWorldMinter";
import { filterUndefined } from "../../../api/sceneParser";
import MintDialogModal from "../BuilderDialogs/MintDialogModal";
import SetCaptureScreenshotFn from "../../Shared/SetCaptureScreenshotFn";
import WorldPortals from "../Portals/WorldPortals";
import { useNavigate } from "react-router";
import { getWorldsPath } from "../Viewer/SceneViewerContents";
import { PortalWithScene } from "../Portals/useSavePortalScenes";

const rootPath: string[] = [];

const buildMenu = ({
  handleSaveToIpfs,
  savingScene,
  disabled,
  updateWorldStatus,
  handleOpenMintDialog,
  pageTitle,
}: {
  handleSaveToIpfs: () => void;
  savingScene: boolean;
  disabled: boolean;
  // createWorld: () => void;
  // updateWorld: (tokenId: string) => void;
  createWorldStatus: MintWorldStatus;
  updateWorldStatus: MintWorldStatus;
  handleOpenMintDialog: () => void;
  pageTitle: string;
}): MenuItem[] => {
  const mintButton = filterUndefined([
    updateWorldStatus.isAllowedToMint
      ? {
          action: handleOpenMintDialog,
          title: "Mint to Token",
          kind: LinkKind.button,
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
}: {
  sceneAndFiles: SceneAndFiles;
  isNew?: boolean;
  cid?: string;
  tokenId?: string;
  pageTitle: string;
  portals: PortalWithScene[] | undefined;
  worldName: string | undefined;
}) => {
  const builderState = useBuilder({ sceneAndFiles, tokenId });

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const { isDragging, getRootProps, getInputProps, raycasterRef } =
    builderState;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [mintDialogOpen, setMintDialogOpen] = useState(false);

  useEffect(() => {
    setMenuItems(
      buildMenu({
        pageTitle,
        handleSaveToIpfs: builderState.handleSaveToIpfs,
        savingScene: builderState.saveSceneStatus.saving,
        disabled: builderState.saveSceneStatus.saving || !builderState.canSave,
        // createWorld: builderState.createWorld,
        // updateWorld: builderState.updateWorld,
        createWorldStatus: builderState.createWorldStatus,
        updateWorldStatus: builderState.mintWorldStatus,
        handleOpenMintDialog: () => setMintDialogOpen(true),
      })
    );
  }, [
    builderState.handleSaveToIpfs,
    builderState.saveSceneStatus.saving,
    builderState.canSave,
    isNew,
    cid,
    builderState.createWorldStatus,
    builderState.mintWorldStatus,
    pageTitle,
  ]);

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

  const navigate = useNavigate();

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
        <div className="absolute right-5 top-20">
          <Leva fill hidden={!builderState.transforming.isTransforming} />
        </div>
        {builderState.saveSceneStatus.saved && (
          <SavedSceneSuccessModal
            savedCid={builderState.saveSceneStatus.savedCid}
          />
        )}
        {mintDialogOpen && (
          <MintDialogModal
            currentWorldTokenId={tokenId}
            handleClose={() => setMintDialogOpen(false)}
            updateWorld={builderState.updateWorld}
            updateWorldStatus={builderState.mintWorldStatus}
            currentWorldName={worldName}
          />
        )}
      </div>
    </>
  );
};

export default SceneBuilder;
