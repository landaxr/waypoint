import { useEffect, useState } from "react";
import { SceneAndFiles } from "../../../types/scene";
import { LinkKind, MenuItem, UrlKind } from "../../Nav/Navbar";
import { filterUndefined } from "../../../api/sceneParser";
import SceneViewerContents from "./SceneViewerContents";
import { PortalWithScene } from "../Portals/useSavePortalScenes";

export const getWorldsPath = (tokenId: string) => `/worlds/${tokenId}`;

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
    { link: "#", title: pageTitle, kind: LinkKind.link, urlKind: UrlKind.localRedirect },
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
  sceneAndFiles,
  pageTitle,
  handleStartEdit,
  canEdit,
  editText,
  portals,
}: {
  sceneAndFiles: SceneAndFiles;
  pageTitle: string;
  canEdit?: boolean;
  handleStartEdit: () => void;
  editText?: string;
  portals: PortalWithScene[] | undefined;
}) => {
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

  return (
    <SceneViewerContents
      menuItems={menuItems}
      portals={portals}
      sceneAndFiles={sceneAndFiles}
    web3Enabled
    />
  );
};

export default SceneViewer;
