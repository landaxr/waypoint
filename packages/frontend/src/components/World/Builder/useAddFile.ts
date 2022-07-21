import { RefObject, useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { Object3D, Raycaster } from "three";
import { Transform } from "../../../types/elements";

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
  createNewElementForFile,
  raycasterRef,
  startTransforming,
}: {
  raycasterRef: RefObject<Raycaster>;
  startTransforming: (path: string[]) => void;
  createNewElementForFile: (params: {
    file: File;
    transform: Transform | null;
  }) => string;
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

        const newElementId = createNewElementForFile({ file, transform });

        const pathToSelect: string[] = [newElementId];

        startTransforming(pathToSelect);
      });

      fileRejection.forEach((rejected) => {
        console.error(`${rejected.file.type}`);
      });
    },
    [createNewElementForFile, raycasterRef, startTransforming]
  );

  const onDragEnter = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
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
