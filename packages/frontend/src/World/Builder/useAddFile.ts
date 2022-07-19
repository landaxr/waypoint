import { RefObject, useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { Object3D, Raycaster } from "three";
import {
  ElementType,
  ImageElement,
  ModelElement,
  Transform,
} from "../../types/elements";
import { FileLocationKind } from "../../types/shared";
import { SceneUpdater } from "./useSceneUpdater";

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

const useAddFile = ({
  createNewElement,
  raycasterRef,
}: Pick<SceneUpdater, "createNewElement"> & {
  raycasterRef: RefObject<Raycaster>;
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
        const fileType = getFieType(file);
        const transform = getAddElementTransform(raycasterRef.current);

        if (fileType === FileType.glb) {
          const elementConfig: ModelElement = {
            elementType: ElementType.Model,
            transform,
            modelConfig: {
              file: {
                kind: FileLocationKind.blob,
                file,
              },
            },
          };

          createNewElement({
            elementConfig,
          });
        } else if (fileType === FileType.image) {
          const elementConfig: ImageElement = {
            elementType: ElementType.Image,
            transform,
            imageConfig: {
              file: {
                kind: FileLocationKind.blob,
                file,
              },
            },
          };

          createNewElement({
            elementConfig,
          });
        }
      });

      fileRejection.forEach((rejected) => {
        console.error(`${rejected.file.type}`);
      });
    },
    [createNewElement]
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
