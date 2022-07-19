import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { ElementType, ImageElement, ModelElement } from "../../types/elements";
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

const useAddFile = ({
  createNewElement,
}: Pick<SceneUpdater, "createNewElement">) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejection: FileRejection[]) => {
      // Do something with the files
      setIsDragging(false);
      acceptedFiles.forEach((file) => {
        const fileType = getFieType(file);
        if (fileType === FileType.glb) {
          const elementConfig: ModelElement = {
            elementType: ElementType.Model,
            transform: {
              scale: {
                x: 0.01,
                y: 0.01,
                z: 0.01,
              },
            },
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
