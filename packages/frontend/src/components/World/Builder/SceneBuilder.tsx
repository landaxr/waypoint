import { Select } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { Leva } from "leva";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SceneConfiguration } from "../../../types/scene";
import SetRaycasterFromCamera from "./SetRaycasterFromCamera";
import { BuilderState } from "./useBuilder";
import Controls from "../Controls";
import DynamicEnvironment from "../DynamicEnvironment";
import ElementsTree from "../Elements/ElementsTree";
import { AudioListener } from "three";
import BuilderMenu from "./Menu";
import Navbar, { LinkKind, MenuItem } from "../../Nav/Navbar";
import SavedSceneSuccessModal from "./SavedSceneSuccessModal";

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
    { link: "#", title: `Building ${elementName}`, kind: LinkKind.link },
    {
      action: handleSaveToIpfs,
      title: savingScene ? "Saving to IPFS" : "Save to IPFS",
      kind: LinkKind.button,
      disabled: savingScene,
    },
  ];
};

const SceneBuilder = ({
  builderState,
  scene,
  isNew,
  worldId,
}: {
  builderState: BuilderState;
  scene: SceneConfiguration;
  isNew?: boolean;
  worldId?: string;
}) => {
  const [hasClicked, setHasClicked] = useState(false);

  const [, setListener] = useState<AudioListener>();

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);

    setListener(new AudioListener());
  }, [hasClicked]);

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
        <Canvas onClick={onClicked}>
          <SetRaycasterFromCamera raycasterRef={raycasterRef} />
          {scene && (
            <>
              <DynamicEnvironment
                environment={scene.environment}
                files={builderState.files}
              />
              <Select onChange={builderState.selectTargetElement}>
                <ElementsTree
                  elements={scene.elements}
                  parentId={null}
                  parentPath={rootPath}
                  builderState={builderState}
                />
              </Select>
            </>
          )}
          <Controls {...builderState} />
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
