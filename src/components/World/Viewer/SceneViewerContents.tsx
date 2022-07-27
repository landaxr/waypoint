import { useContextBridge } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import { useMemo, useRef } from "react";
import { SceneAndFiles } from "../../../types/scene";
import SetRaycasterFromCamera from "../Builder/SetRaycasterFromCamera";
import DynamicEnvironment from "../DynamicEnvironment";
import ElementsTree from "../Elements/ElementsTree";
import Navbar, { MenuItem } from "../../Nav/Navbar";
import { ClickedAndAudioContext } from "../useClickedAndAudioListener";
import AttachAudioListenerToCamera from "../Elements/utils/AttachAudioListenerToCamera";
import { Raycaster } from "three";
import ViewerControls from "./ViewerControls";
import { useNavigate } from "react-router";
import WorldPortals from "../Portals/WorldPortals";
import { PortalWithScene } from "../Portals/useSavePortalScenes";

const rootPath: string[] = [];

export const getWorldsPath = (tokenId: string) => `/worlds/${tokenId}`;

const SceneViewerContents = ({
  sceneAndFiles: { scene, files },
  portals,
  menuItems,
web3Enabled
}: {
  sceneAndFiles: SceneAndFiles;
  portals: PortalWithScene[] | undefined;
  menuItems: MenuItem[];
web3Enabled: boolean;
}) => {
  const raycasterRef = useRef(new Raycaster());

  const cursorClass = useMemo(() => {
    return "cursor-pointer";
  }, []);

  const ContextBridge = useContextBridge(ClickedAndAudioContext);

  const navigate = useNavigate();

  return (
    <>
      {menuItems.length > 0 && <Navbar centerItems={menuItems} web3Enabled={web3Enabled}/>}
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
            {portals && (
              <WorldPortals
                portals={portals}
                navigate={navigate}
                getWorldPath={getWorldsPath}
              />
            )}
          </ContextBridge>
        </Canvas>
      </div>
    </>
  );
};

export default SceneViewerContents;
