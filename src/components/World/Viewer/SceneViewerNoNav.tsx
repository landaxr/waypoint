import { useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useMemo, useRef } from "react";
import { SceneAndFiles } from "../../../types/scene";
import SetRaycasterFromCamera from "../Builder/SetRaycasterFromCamera";
import DynamicEnvironment from "../DynamicEnvironment";
import ElementsTree from "../Elements/ElementsTree";
import { ClickedAndAudioContext } from "../useClickedAndAudioListener";
import AttachAudioListenerToCamera from "../Elements/utils/AttachAudioListenerToCamera";
import { Raycaster } from "three";
import ViewerControls from "./ViewerControls";

const rootPath: string[] = [];

const SceneViewerNoNav = ({
  sceneAndFiles: { scene, files },
  pageTitle,
  handleStartEdit,
  canEdit,
  editText,
}: {
  sceneAndFiles: SceneAndFiles;
  pageTitle: string;
  canEdit?: boolean;
  handleStartEdit: () => void;
  editText?: string;
}) => {
  const raycasterRef = useRef(new Raycaster());

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

  // todo: share this code with SceneViewer and SceneBuilder
  return (
    <>
      <div className={clsx("w-screen h-screen", cursorClass)}>
        <Canvas>
          <ContextBridge>
            <>
              <AttachAudioListenerToCamera />
              <SetRaycasterFromCamera raycasterRef={raycasterRef} />
              <DynamicEnvironment
                environment={scene.environment}
                files={files}
              />
              <ElementsTree
                elements={scene.elements}
                parentId={null}
                parentPath={rootPath}
                files={files}
              />
            </>
            <ViewerControls />
          </ContextBridge>
        </Canvas>
      </div>
    </>
  );
};

export default SceneViewerNoNav;
