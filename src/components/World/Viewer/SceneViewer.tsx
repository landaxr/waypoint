import { useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { SceneAndFiles } from "../../../types/scene";
import SetRaycasterFromCamera from "../Builder/SetRaycasterFromCamera";
import DynamicEnvironment from "../DynamicEnvironment";
import ElementsTree from "../Elements/ElementsTree";
import Navbar, { LinkKind, MenuItem } from "../../Nav/Navbar";
import { ClickedAndAudioContext } from "../useClickedAndAudioListener";
import AttachAudioListenerToCamera from "../Elements/utils/AttachAudioListenerToCamera";
import { Raycaster } from "three";
import ViewerControls from "./ViewerControls";
import { filterUndefined } from "../../../api/sceneParser";

const rootPath: string[] = [];

const viewMenu = ({
  pageTitle,
  handleStartFork,
  canEdit,
  editText,
}: {
  pageTitle: string;
  handleStartFork: () => void;
  canEdit?: boolean;
  editText?: string;
}): MenuItem[] => {
  const items: (MenuItem | undefined)[] = [
    { link: "#", title: pageTitle, kind: LinkKind.link },
    canEdit && editText
      ? {
          action: handleStartFork,
          title: editText,
          kind: LinkKind.button,
        }
      : undefined,
  ];
  const result: MenuItem[] = filterUndefined(items);

  return result;
};

const SceneViewer = ({
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
  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setMenuItems(
      viewMenu({
        pageTitle,
        handleStartFork: handleStartEdit,
        canEdit,
        editText,
      })
    );
  }, [handleStartEdit, editText, pageTitle, canEdit]);

  const raycasterRef = useRef(new Raycaster());

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

  return (
    <>
      <Navbar centerItems={menuItems} />
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

export default SceneViewer;
