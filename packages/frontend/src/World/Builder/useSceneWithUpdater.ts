import { useCallback, useState } from "react";
import { SceneConfiguration } from "../../types/scene";
import { Element } from "../../types/elements";
import {
  createNewElement,
  updateElement,
  deleteElement,
  updateEnvironment,
  addElement,
} from "../../editorDb/mutations";
import { newId } from "../../editorDb/utils";

export type SceneUpdater = {
  createNewElement: ({ elementConfig }: { elementConfig: Element }) => string;
};

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

  const create = useCallback(
    ({ elementConfig }: { elementConfig: Element }) => {
      const elementId = newId();
      updateScene((existing) => {
        const result = addElement({ id: elementId, elementConfig })(existing);

        return result;
      });
      return elementId;
    },
    []
  );

  const updater: SceneUpdater = {
    createNewElement: create,
  };

  return {
    sceneWithUpdates: sceneWithUpdates,
    updater,
  };
};

export default useSceneWithUpdater;
