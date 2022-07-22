import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { SceneAndFiles, SceneConfiguration } from "../../../types/scene";
import {
  createNewElement,
  updateElement,
  addElement,
  SceneUpdateFn,
  addFile,
} from "../../../editorDb/mutations";
import { newId } from "../../../editorDb/utils";
import {
  ElementType,
  ImageElement,
  ModelElement,
  Transform,
  VideoElement,
} from "../../../types/elements";
import { FileLocationKindLocal, Optional } from "../../../types/shared";

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

const newFileToElementConfig = ({
  file,
  transform,
  fileId,
}: {
  file: File;
  transform: Optional<Transform>;
  fileId: string;
}) => {
  const fileType = getFieType(file);

  if (fileType === FileType.glb) {
    const result: ModelElement = {
      elementType: ElementType.Model,
      transform,
      modelConfig: {
        file: {
          fileId: fileId,
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
          fileId: file.name,
        },
      },
    };
    return result;
  } else if (fileType === FileType.video) {
    const result: VideoElement = {
      elementType: ElementType.Video,
      transform,
      videoConfig: {
        file: {
          original: {
            fileId: file.name,
          },
        },
      },
    };

    console.log("added", result);

    return result;
  }

  return null;
};

export const useSceneUpdater = ({
  updateScene,
}: {
  updateScene: Dispatch<SetStateAction<SceneAndFiles>>;
}) => {
  const [updateCount, setUpdateCount] = useState(0);

  const logUpdate = useCallback(() => {
    setUpdateCount((existing) => existing + 1);
  }, []);

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
      logUpdate();

      return elementId;
    },
    [updateSceneConfig, logUpdate]
  );

  const update = useCallback(
    (params: Parameters<typeof updateElement>[0]) => {
      updateSceneConfig(updateElement(params));

      logUpdate();
    },
    [updateSceneConfig, logUpdate]
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
        const fileId = file.name;

        const elementConfig = newFileToElementConfig({
          file,
          transform,
          fileId,
        });

        const updatedScene = elementConfig
          ? addElement({ elementConfig, id: elementId })(scene)
          : scene;

        const updatedFiles = addFile({
          file: {
            kind: FileLocationKindLocal.uploaded,
            file,
          },
          id: fileId,
        })(files);

        return {
          scene: updatedScene,
          files: updatedFiles,
        };
      });
      logUpdate();
      return elementId;
    },
    [updateScene, logUpdate]
  );

  const setNewSkyboxFile = useCallback(
    ({ file }: { file: File }) => {
      const fileId = file.name;
      updateScene(({ scene, files }) => {
        const updatedScene: SceneConfiguration = {
          ...scene,
          environment: {
            ...scene.environment,
            environmentMap: {
              fileId,
            },
          },
        };

        const updatedFiles = addFile({
          file: {
            kind: FileLocationKindLocal.uploaded,
            file,
          },
          id: fileId,
        })(files);

        return {
          scene: updatedScene,
          files: updatedFiles,
        };
      });

      logUpdate();
    },
    [updateScene, logUpdate]
  );

  return {
    createNewElement: create,
    updateElement: update,
    createNewElementForFile,
    updateCount,
    setNewSkyboxFile,
  };
};
