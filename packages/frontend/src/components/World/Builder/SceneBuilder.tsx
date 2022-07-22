import { Select, useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { Leva } from "leva";
import { useEffect, useMemo, useState } from "react";
import { SceneAndFiles } from "../../../types/scene";
import SetRaycasterFromCamera from "./SetRaycasterFromCamera";
import { useBuilder } from "./useBuilder";
import BuilderControls from "./BuilderControls";
import DynamicEnvironment from "../DynamicEnvironment";
import ElementsTree from "../Elements/ElementsTree";
import BuilderMenu from "./Menu";
import Navbar, { LinkKind, MenuItem } from "../../Nav/Navbar";
import SavedSceneSuccessModal from "./SavedSceneSuccessModal";
import { ClickedAndAudioContext } from "../useClickedAndAudioListener";
import AttachAudioListenerToCamera from "../Elements/utils/AttachAudioListenerToCamera";

const rootPath: string[] = [];

const buildMenu = ({
  isNew,
  worldId,
  handleSaveToIpfs,
  savingScene,
}: {
  isNew?: boolean;
  worldId?: string;
  handleSaveToIpfs: () => void;
  savingScene: boolean;
}): MenuItem[] => {
  const elementName = isNew ? "Draft World" : worldId || "World";

  return [
    { link: "#", title: `Forking ${elementName}`, kind: LinkKind.link },
    {
      action: handleSaveToIpfs,
      title: savingScene ? "Saving to IPFS" : "Save to IPFS",
      kind: LinkKind.button,
      disabled: savingScene,
    },
  ];
};

const SceneBuilder = ({
  sceneAndFiles,
  isNew,
  worldId,
}: {
  sceneAndFiles: SceneAndFiles;
  isNew?: boolean;
  worldId?: string;
}) => {
  const builderState = useBuilder({ sceneAndFiles });

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const { isDragging, getRootProps, getInputProps, raycasterRef } =
    builderState;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setMenuItems(
      buildMenu({
        isNew,
        worldId,
        handleSaveToIpfs: builderState.handleSaveToIpfs,
        savingScene: builderState.saveSceneStatus.saving,
      })
    );
  }, [
    builderState.handleSaveToIpfs,
    builderState.saveSceneStatus.saving,
    isNew,
    worldId,
  ]);

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

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
        <BuilderMenu />
        <Canvas>
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
      </div>
    </>
  );
};

export default SceneBuilder;
