import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { SceneConfiguration } from "../../../types/scene";
import { Element } from "../../../types/elements";
import {
  createNewElement,
  updateElement,
  deleteElement,
  updateEnvironment,
  addElement,
} from "../../../editorDb/mutations";
import { newId } from "../../../editorDb/utils";

export const useSceneUpdater = ({
  updateScene,
}: {
  updateScene: Dispatch<SetStateAction<SceneConfiguration>>;
}) => {
  const create = useCallback(
    (params: Parameters<typeof createNewElement>[0]) => {
      const elementId = newId();
      updateScene((existing) =>
        addElement({ id: elementId, elementConfig: params.elementConfig })(
          existing
        )
      );
      return elementId;
    },
    []
  );

  const update = useCallback((params: Parameters<typeof updateElement>[0]) => {
    updateScene((existing) => updateElement(params)(existing));
  }, []);

  return {
    createNewElement: create,
    updateElement: update,
  };
};

export type SceneUpdater = ReturnType<typeof useSceneUpdater>;

const useSceneWithUpdater = ({
  scene,
}: {
  scene: SceneConfiguration;
}): {
  sceneWithUpdates: SceneConfiguration;
  updater: SceneUpdater;
} => {
  const [sceneWithUpdates, updateScene] = useState<SceneConfiguration>(
    () => scene
  );

  const updater = useSceneUpdater({ updateScene });

  return {
    sceneWithUpdates: sceneWithUpdates,
    updater,
  };
};

export default useSceneWithUpdater;
