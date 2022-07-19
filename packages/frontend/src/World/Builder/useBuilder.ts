import { useCallback, useEffect, useRef, useState } from "react";
import { Object3D, Raycaster } from "three";
import { Optional } from "../../types/shared";
import useAddFile from "./useAddFile";
import { SceneUpdater } from "./useSceneWithUpdater";

export const useBuilder = ({ createNewElement }: SceneUpdater) => {
  const raycasterRef = useRef<Raycaster>(new Raycaster());

  const [transforming, setTransforming] = useState<{
    isTransforming: boolean;
    elementPath: Optional<string[]>;
  }>({ isTransforming: false, elementPath: null });

  const [targetElement, setTargetElement] = useState<Object3D | null>();

  const startTransforming = useCallback((path: string[]) => {
    setTransforming({
      isTransforming: true,
      elementPath: path,
    });
  }, []);

  const stopTransforming = useCallback(() => {
    setTransforming({ isTransforming: false, elementPath: null });
    setTargetElement(null);
  }, []);

  const addFile = useAddFile({
    createNewElement,
    raycasterRef,
    startTransforming,
  });

  const selectTargetElement = useCallback(
    (selected: Object3D[] | null | undefined) => {
      if (selected && selected[0]) {
        setTargetElement(selected[0]);
      } //else setTargetElement(null);
    },
    []
  );

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopTransforming();
      }
    };
    document.addEventListener("keydown", cb);
    return () => document.removeEventListener("keydown", cb);
  }, []);

  return {
    ...addFile,
    transforming,
    startTransforming,
    stopTransforming,
    raycasterRef,
    targetElement,
    selectTargetElement,
  };
};

export type BuilderState = ReturnType<typeof useBuilder>;
