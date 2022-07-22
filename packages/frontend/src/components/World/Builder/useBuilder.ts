import { useControls } from "leva";
import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Object3D, Raycaster, Vector3 } from "three";
import { saveSceneToIpfs } from "../../../api/ipfsSaver";
import { Transform, Element, IVector3 } from "../../../types/elements";
import { SceneAndFiles } from "../../../types/scene";
import { Optional } from "../../../types/shared";
import { isElementUserData } from "../Elements/ElementsTree";
import useAddFile from "./useAddFile";
import { useSceneUpdater } from "./useSceneUpdater";

export enum TransformMode {
  translate = "translate",
  rotate = "rotate",
  scale = "scale",
}

export type SceneSaveStatus = {
  saving: boolean;
  saved?: boolean;
  error?: Error;
  savedCid?: string;
};

const transformOptions: { [key: string]: TransformMode } = {
  translate: TransformMode.translate,
  rotate: TransformMode.rotate,
  scale: TransformMode.scale,
};

function findParentElement(selectedMesh: Object3D): Object3D | null {
  if ((selectedMesh.userData as isElementUserData).isElement)
    return selectedMesh;

  if (!selectedMesh.parent) return null;

  return findParentElement(selectedMesh.parent);
}

const toIVector3 = (vector3: Vector3 | Euler): IVector3 => ({
  x: vector3.x,
  y: vector3.y,
  z: vector3.z,
});

export const useBuilder = ({
  sceneAndFiles,
}: {
  sceneAndFiles: SceneAndFiles;
}) => {
  const raycasterRef = useRef<Raycaster>(new Raycaster());

  const [{ scene: sceneWithUpdates, files: filesWithUpdates }, updateScene] =
    useState<SceneAndFiles>(() => sceneAndFiles);

  const {
    createNewElementForFile,
    updateElement,
    updateCount,
    setNewSkyboxFile,
  } = useSceneUpdater({
    updateScene,
  });

  const [saveSceneStatus, setSaveSceneStatus] = useState<SceneSaveStatus>({
    saving: false,
  });

  const [hasChangesToSave, setHasChangesToSave] = useState(false);

  useEffect(() => {
    if (updateCount > 0) setHasChangesToSave(true);
  }, [updateCount]);

  const handleSaveToIpfs = useCallback(async () => {
    if (saveSceneStatus.saving) return;
    setSaveSceneStatus({
      saving: true,
    });
    try {
      const cid = await saveSceneToIpfs({
        scene: sceneWithUpdates,
        files: filesWithUpdates,
      });

      setSaveSceneStatus({
        savedCid: cid,
        saving: false,
        saved: true,
      });

      setHasChangesToSave(false);
    } catch (e) {
      console.error(e);

      setSaveSceneStatus({
        saving: false,
        error: e as Error,
      });
    }
  }, [sceneWithUpdates, saveSceneStatus.saving, filesWithUpdates]);

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
    createNewElementForFile: createNewElementForFile,
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
    [startTransforming]
  );

  useEffect(() => {
    const cb = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopTransforming();
      }
    };
    document.addEventListener("keydown", cb);
    return () => document.removeEventListener("keydown", cb);
  }, [stopTransforming]);

  const [values, set] = useControls(() => ({
    transform: {
      options: transformOptions,
    },
  }));

  useEffect(() => {
    set({ transform: TransformMode.translate });
  }, [set]);

  const setTransformMode = useCallback(
    (mode: TransformMode) => {
      set({ transform: mode });
    },
    [set]
  );

  const transformMode = values.transform;

  const handleTransformComplete = useCallback(() => {
    if (!targetElement || !transforming.elementPath) return;
    let update: Transform;

    const { position, rotation, scale } = targetElement;

    if (transformMode === TransformMode.translate) {
      update = {
        position: toIVector3(position),
      };
    } else if (transformMode === TransformMode.rotate) {
      update = {
        rotation: toIVector3(rotation),
      };
    } else {
      update = {
        scale: toIVector3(scale),
      };
    }

    const elementId =
      transforming.elementPath[transforming.elementPath.length - 1];

    const toUpdate: Partial<Element> = {
      transform: update,
    };

    updateElement({ id: elementId, elementConfig: toUpdate });
  }, [targetElement, transforming.elementPath, transformMode, updateElement]);

  return {
    ...addFile,
    transforming,
    transformMode,
    raycasterRef,
    targetElement,
    selectTargetElement,
    updateElement,
    handleTransformComplete,
    handleSaveToIpfs,
    saveSceneStatus,
    setTransformMode,
    canSave: hasChangesToSave,
    scene: sceneWithUpdates,
    files: filesWithUpdates,
    setNewSkyboxFile,
  };
};

export type BuilderState = ReturnType<typeof useBuilder>;
