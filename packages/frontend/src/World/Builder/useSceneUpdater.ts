import { useCallback, useState } from "react";
import { SceneConfiguration } from "../../types/scene";
import { Element } from "../../types/elements";
import {
  createNewElement,
  updateElement,
  deleteElement,
  updateEnvironment,
} from "../../editorDb/mutations";

const useSceneUpdater = ({ scene }: { scene: SceneConfiguration }) => {
  const [withUpdates, setWithUpdates] = useState<SceneConfiguration>(
    () => scene
  );

  const create = useCallback(
    ({ elementConfig }: { elementConfig: Element }) => {
      setWithUpdates((existing) =>
        createNewElement({ elementConfig })(existing)
      );
    },
    []
  );

  return {
    scene: withUpdates,
    createNewElement: create,
  };
};

export type SceneUpdater = ReturnType<typeof useSceneUpdater>;

export default useSceneUpdater;
