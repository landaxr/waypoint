import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useCallback, useMemo, useRef, useState } from "react";
import { Camera, Raycaster, Vector3 } from "three";
import { SceneConfiguration } from "../types/scene";
import SetRaycasterFromCamera from "./Builder/SetRaycasterFromCamera";
import useAddFile from "./Builder/useAddFile";
import { SceneUpdater } from "./Builder/useSceneUpdater";
import Controls from "./Controls";
import DynamicEnvironment from "./DynamicEnvironment";
import ElementsTree from "./ElementsTree";

const Scene = ({ scene, createNewElement }: SceneUpdater) => {
  const [hasClicked, setHasClicked] = useState(false);

  const [listener, setListener] = useState<AudioListener>();

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);

    setListener(new AudioListener());
  }, [hasClicked]);

  const [camera, setCamera] = useState<Camera>();

  const raycasterRef = useRef<Raycaster>(new Raycaster());

  const { getRootProps, getInputProps, isDragging } = useAddFile({
    createNewElement,
    raycasterRef,
  });

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

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
              <ElementsTree elements={scene.elements} />
            </>
          )}
          <Controls isDragging={isDragging} />
        </Canvas>
      </div>
    </>
  );
};

export default Scene;
