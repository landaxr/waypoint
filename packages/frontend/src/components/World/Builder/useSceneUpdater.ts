import { Dispatch, SetStateAction, useCallback } from "react";
import { SceneAndFiles } from "../../../types/scene";
import {
  createNewElement,
  updateElement,
  addElement,
  SceneUpdateFn,
} from "../../../editorDb/mutations";
import { newId } from "../../../editorDb/utils";
import {
  ElementType,
  ImageElement,
  ModelElement,
  Transform,
} from "../../../types/elements";
import { FileLocationKind, Optional } from "../../../types/shared";

enum FileType {
  image = "image",
  video = "video",
  glb = "glb",
}

const getFieType = (file: File) => {
  if (file.type.includes("image")) return FileType.image;
  if (file.type.includes("video")) return FileType.video;
  if (file.type.includes("glb")) return FileType.glb;

  if (file.name.endsWith("glb") || file.name.endsWith("gltf"))
    return FileType.glb;

  alert("Unkown file type");
};

const newFileToElementConfig = (file: File, transform: Optional<Transform>) => {
  const fileType = getFieType(file);

  if (fileType === FileType.glb) {
    const result: ModelElement = {
      elementType: ElementType.Model,
      transform,
      modelConfig: {
        file: {
          kind: FileLocationKind.local,
          path: file.name,
        },
      },
    };
    return result;
  } else if (fileType === FileType.image) {
    const result: ImageElement = {
      elementType: ElementType.Image,
      transform,
      imageConfig: {
        file: {
          kind: FileLocationKind.local,
          path: file.name,
        },
      },
    };
    return result;
  }

  return null;
};

export const useSceneUpdater = ({
  updateScene,
}: {
  updateScene: Dispatch<SetStateAction<SceneAndFiles>>;
}) => {
  const updateSceneConfig = useCallback(
    (updater: SceneUpdateFn) => {
      updateScene(({ scene, files }) => ({
        scene: updater(scene),
        files,
      }));
    },
    [updateScene]
  );

  const create = useCallback(
    (params: Parameters<typeof createNewElement>[0]) => {
      const elementId = newId();
      updateSceneConfig(
        addElement({ id: elementId, elementConfig: params.elementConfig })
      );

      return elementId;
    },
    [updateSceneConfig]
  );

  const update = useCallback(
    (params: Parameters<typeof updateElement>[0]) => {
      updateSceneConfig(updateElement(params));
    },
    [updateSceneConfig]
  );

  const createNewElementForFile = useCallback(
    ({
      file,
      transform,
    }: {
      file: File;
      transform: Transform | null;
    }): string => {
      const elementId = newId();
      updateScene(({ scene, files }) => {
        const path = file.name;

        const elementConfig = newFileToElementConfig(file, transform);

        const updatedScene = elementConfig
          ? addElement({ elementConfig, id: elementId })(scene)
          : scene;

        return {
          scene: updatedScene,
          files: {
            ...files,
            [path]: file,
          },
        };
      });
      return elementId;
    },
    [updateScene]
  );

  return {
    createNewElement: create,
    updateElement: update,
    createNewElementForFile,
  };
};
