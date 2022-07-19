import { Canvas } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import { SceneConfiguration } from "../types/scene";
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

  const { getRootProps, getInputProps, isDragging } = useAddFile({
    createNewElement,
  });

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  return (
    <>
      <div className={`w-screen h-screen ${cursorClass}`} {...getRootProps()}>
        <input type="hidden" {...getInputProps()} />
        <Canvas onClick={onClicked}>
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
