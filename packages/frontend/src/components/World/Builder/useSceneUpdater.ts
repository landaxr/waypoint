import { Dispatch, SetStateAction, useCallback } from "react";
import { SceneConfiguration } from "../../../types/scene";
import {
  createNewElement,
  updateElement,
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
    [updateScene]
  );

  const update = useCallback(
    (params: Parameters<typeof updateElement>[0]) => {
      updateScene((existing) => updateElement(params)(existing));
    },
    [updateScene]
  );

  return {
    createNewElement: create,
    updateElement: update,
  };
};
