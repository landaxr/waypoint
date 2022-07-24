import { useEffect, useState } from "react";
import { SceneAndFiles } from "../../../types/scene";
import { LinkKind, MenuItem } from "../../Nav/Navbar";
import { filterUndefined } from "../../../api/sceneParser";
import { PortalData } from "../../../api/theGraph/portalQueries";
import SceneViewerContents from "./SceneViewerContents";

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
  portals: PortalData[] | undefined;
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
    />
  );
};

export default SceneViewer;
