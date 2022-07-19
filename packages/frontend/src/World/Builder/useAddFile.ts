import { RefObject, startTransition, useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { Object3D, Raycaster } from "three";
import {
  ElementType,
  ImageElement,
  ModelElement,
  Transform,
} from "../../types/elements";
import { FileLocationKind, Optional } from "../../types/shared";
import { SceneUpdater } from "./useSceneWithUpdater";

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

const getAddElementTransform = (
  raycaster: Raycaster | null,
  offsetFromCamera = 2
): Transform | null => {
  if (!raycaster) return null;

  const { ray } = raycaster;

  const offset = ray.direction.clone().multiplyScalar(offsetFromCamera);

  const target = ray.origin.clone().add(offset);

  const refObject = new Object3D();
  refObject.position.copy(target);
  refObject.lookAt(ray.origin);

  return {
    position: target,
    rotation: {
      x: refObject.rotation.x,
      y: refObject.rotation.y,
      z: refObject.rotation.z,
    },
  };
};

const newFileToElementConfig = (file: File, transform: Optional<Transform>) => {
  const fileType = getFieType(file);
  let elementConfig: Element | null = null;

  if (fileType === FileType.glb) {
    const result: ModelElement = {
      elementType: ElementType.Model,
      transform,
      modelConfig: {
        file: {
          kind: FileLocationKind.blob,
          file,
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
          kind: FileLocationKind.blob,
          file,
        },
      },
    };
    return result;
  }

  return null;
};

const useAddFile = ({
  createNewElement,
  raycasterRef,
  startTransforming,
}: Pick<SceneUpdater, "createNewElement"> & {
  raycasterRef: RefObject<Raycaster>;
  startTransforming: (path: string[]) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejection: FileRejection[],
      event: DropEvent
    ) => {
      // Do something with the files
      setIsDragging(false);
      acceptedFiles.forEach((file) => {
        const transform = getAddElementTransform(raycasterRef.current);

        const elementConfig = newFileToElementConfig(file, transform);

        if (elementConfig) {
          const newElementId = createNewElement({
            elementConfig,
          });

          const pathToSelect: string[] = [newElementId];

          console.log(pathToSelect);

          startTransforming(pathToSelect);
        }
      });

      fileRejection.forEach((rejected) => {
        console.error(`${rejected.file.type}`);
      });
    },
    [createNewElement, startTransforming]
  );

  const onDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    noClick: true,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "video/mp4": [".mp4"],
      "model/glb": [".glb", ".gltf"],
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragging,
  };
};

export default useAddFile;
