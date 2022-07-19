import { buttonGroup, useControls } from "leva";
import { useCallback, useEffect, useRef, useState } from "react";
import { Object3D, Raycaster } from "three";
import { Transform, Element } from "../../types/elements";
import { Optional } from "../../types/shared";
import { isElementUserData } from "../ElementsTree";
import useAddFile from "./useAddFile";
import { SceneUpdater } from "./useSceneWithUpdater";

export enum TransformMode {
  translate = "translate",
  rotate = "rotate",
  scale = "scale",
}

const transformOptions: { [key: string]: TransformMode } = {
  translate: TransformMode.translate,
  rotate: TransformMode.rotate,
  scale: TransformMode.scale,
};

function findParentElement(selectedMesh: Object3D): Object3D | null {
  if ((selectedMesh.userData as isElementUserData).isElement) return selectedMesh;

  if (!selectedMesh.parent) return null;

  return findParentElement(selectedMesh.parent);
}

export const useBuilder = ({
  createNewElement,
  updateElement,
}: SceneUpdater) => {
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
        const selectedMesh = selected[0];

        const selectedElement = findParentElement(selectedMesh);

        if (!selectedElement) {
          console.error("could not find parent with name");
        } else {
          const path = [selectedElement.name];
          startTransforming(path);
          setTargetElement(selectedElement);
        }
      }
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

  const [values, set] = useControls(() => ({
    transform: {
      options: transformOptions,
    },
  }));

  useEffect(() => {
    set({ transform: TransformMode.translate });
  }, []);

  const transformMode = values.transform;

  const handleTransformComplete = useCallback(() => {
    if (!targetElement || !transforming.elementPath) return;
    let update: Transform;

    const { position, rotation, scale } = targetElement;

    if (transformMode === TransformMode.translate) {
      update = {
        position: { x: position.x, y: position.y, z: position.z },
      };
    } else if (transformMode === TransformMode.rotate) {
      update = {
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        },
      };
    } else {
      update = {
        scale: {
          x: scale.x,
          y: scale.y,
          z: scale.z,
        },
      };
    }

    const elementId =
      transforming.elementPath[transforming.elementPath.length - 1];

    const toUpdate: Partial<Element> = {
      transform: update,
    };

    updateElement({ id: elementId, elementConfig: toUpdate });
  }, [transformMode, targetElement, transforming.elementPath]);

  return {
    ...addFile,
    transforming,
    transformMode,
    raycasterRef,
    targetElement,
    selectTargetElement,
    updateElement,
    handleTransformComplete,
  };
};

export type BuilderState = ReturnType<typeof useBuilder>;
