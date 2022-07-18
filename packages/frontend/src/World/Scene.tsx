import { Canvas } from "@react-three/fiber";
import { useCallback, useState } from "react";
import { SceneConfiguration } from "../types/scene";
import DynamicEnvironment from "./DynamicEnvironment";
import ElementsTree from "./ElementsTree";

const Scene = ({ scene }: { scene?: SceneConfiguration }) => {
  const [hasClicked, setHasClicked] = useState(false);

  const [listener, setListener] = useState<AudioListener>();

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);

    setListener(new AudioListener());
  }, [hasClicked]);

  return (
    <>
      <div className="w-screen h-screen">
        <Canvas onClick={onClicked}>
          {scene && (
            <>
              <DynamicEnvironment environment={scene.environment} />
              <ElementsTree elements={scene.elements} />
            </>
          )}
        </Canvas>
      </div>
    </>
  );
};

export default Scene;
