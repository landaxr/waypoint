import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Euler, Object3D, Raycaster, Vector3 } from "three";
import { Transform, Element, IVector3 } from "../../../../types/elements";
import { SceneAndFiles } from "../../../../types/scene";
import { Optional } from "../../../../types/shared";
import { isElementUserData } from "../../Elements/ElementsTree";
import useAddFile from "./useAddFile";
import useSaveToIpfs from "./useSaveToIpfs";
import { useSceneUpdater } from "./useSceneUpdater";
import useWorldTokenUpdater, {
  useWorldTokenCreator,
} from "../../../../api/smartContract/useWorldMinter";
import usePortalCreator from "../../../../api/smartContract/usePortalCreator";
import { ChainConfig } from "../../../../web3/chains";

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

const useKeyPressEvent = (key: string, cb: () => any) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) {
        cb();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [cb]);
};

export const useBuilder = ({
  sceneAndFiles,
  tokenId,
  chain,
}: {
  sceneAndFiles: SceneAndFiles;
  tokenId: string | undefined;
  chain: ChainConfig;
}) => {
  const raycasterRef = useRef<Raycaster>(new Raycaster());

  const [updatedSceneWithFiles, updateScene] = useState<SceneAndFiles>(
    () => sceneAndFiles
  );

  const {
    createNewElementForFile,
    updateElement,
    updateCount,
    setNewSkyboxFile,
  } = useSceneUpdater({
    updateScene,
  });

  const [captureScreenshotFn, setCaptureScreenShotFn] = useState<{
    fn: () => string;
  }>();

  const worldTokenUpdater = useWorldTokenUpdater({
    sceneAndFiles: updatedSceneWithFiles,
    captureScreenshotFn: captureScreenshotFn?.fn,
    existingSceneCid: sceneAndFiles.cid,
    chain,
  });

  const portalCreator = usePortalCreator({
    tokenId,
    contractAddress: chain.contractAddress,
  });

  const worldTokenCreator = useWorldTokenCreator({
    captureScreenshotFn: captureScreenshotFn?.fn,
    chain,
  });

  const { handleSaveToIpfs, hasChangesToSave, saveSceneStatus } = useSaveToIpfs(
    {
      ...updatedSceneWithFiles,
      updateCount,
      forkedFrom: sceneAndFiles.cid,
    }
  );

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

  const [selectedElement, selectElement] = useState<string | null>();

  const stopTransforming = useCallback(() => {
    setTransforming({ isTransforming: false, elementPath: null });
    setTargetElement(null);
    selectElement(null);
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

  useKeyPressEvent("Escape", stopTransforming);

  const [showContentTree, setShowContentTree] = useState(false);

  const [transformMode, setTransformMode] = useState<TransformMode>(
    TransformMode.translate
  );

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

  const [camera, setCamera] = useState<Camera>();

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
    ...updatedSceneWithFiles,
    setNewSkyboxFile,
    worldTokenCreator,
    worldTokenUpdater,
    setCaptureScreenShotFn,
    portalCreator,
    tokenId,
    camera,
    setCamera,
    showContentTree,
    setShowContentTree,
    selectElement,
    selectedElement,
  };
};

export type BuilderState = ReturnType<typeof useBuilder>;
