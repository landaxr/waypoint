
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

const rootPath: string[] = [];

const viewMenu = ({
  worldId,
}: {
  worldId: string;
}): MenuItem[] => {
  return [
    { link: "#", title: `Viewing ${worldId}`, kind: LinkKind.link },
    // {
    //   action: handleSaveToIpfs,
    //   title: savingScene ? "Saving to IPFS" : "Save to IPFS",
    //   kind: LinkKind.button,
    //   disabled: savingScene,
    // },
  ];
};

const SceneViewer = ({
  sceneAndFiles: { scene, files},
  worldId,
}: {
  sceneAndFiles: SceneAndFiles;
  worldId: string;
}) => {
  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setMenuItems(
      viewMenu({
        worldId,
      })
    );
  }, [worldId]);

  const raycasterRef = useRef(new Raycaster());

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

  return (
    <>
      <Navbar centerItems={menuItems} />
      <div
        className={clsx("w-screen h-screen", cursorClass,)}
      >
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
          <ViewerControls/>
          </ContextBridge>
        </Canvas>
      </div>
    </>
  );
};

export default SceneViewer;
