import { Select } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useCallback, useMemo, useRef, useState } from "react";
import { Camera, Raycaster, Vector3 } from "three";
import { SceneConfiguration } from "../types/scene";
import SetRaycasterFromCamera from "./Builder/SetRaycasterFromCamera";
import { BuilderState } from "./Builder/useBuilder";
import { SceneUpdater } from "./Builder/useSceneWithUpdater";
import Controls from "./Controls";
import DynamicEnvironment from "./DynamicEnvironment";
import ElementsTree from "./ElementsTree";

const rootPath: string[] = [];

const Scene = ({
  builderState,
  scene,
}: {
  builderState: BuilderState;
  scene: SceneConfiguration;
}) => {
  const [hasClicked, setHasClicked] = useState(false);

  const [listener, setListener] = useState<AudioListener>();

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);

    setListener(new AudioListener());
  }, [hasClicked]);

  const [camera, setCamera] = useState<Camera>();

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const { isDragging, getRootProps, getInputProps, raycasterRef } =
    builderState;

  return (
    <>
      <div
        className={clsx("w-screen h-screen", cursorClass, {
          ["border-2"]: isDragging,
          ["border-black"]: isDragging,
        })}
        {...getRootProps()}
      >
        <input type="hidden" {...getInputProps()} />
        <Canvas onClick={onClicked}>
          <SetRaycasterFromCamera raycasterRef={raycasterRef} />
          {scene && (
            <>
              <DynamicEnvironment environment={scene.environment} />
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
      </div>
    </>
  );
};

export default Scene;
