import clsx from "clsx";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import CreatePortalDialogModal from "../../BuilderDialogs/CreatePortalDialog";
import EditSkyboxDialog from "../EditSkyboxDialog";
import { BuilderState, TransformMode } from "../hooks/useBuilder";
import { GiTransform, GiResize, GiCheckboxTree } from "react-icons/gi";
import { Tb3DRotate } from "react-icons/tb";

const transformIconClass = "m-0 w-6 h-6";

const DocumentAddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const MenuButton = ({
  active,
  onClick,
  icon,
}: {
  active?: boolean;
  onClick: () => void;
  icon: JSX.Element;
}) => (
  <button
    type="button"
    className={clsx(
      "inline-flex rounded-full items-center mx-2 p-2 text-sm font-medium border border-gray-900 hover:bg-gray-900 hover:text-red dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700",
      {
        "bg-white text-gray-900": !active,
        "ring-gray-500 bg-gray-900 text-red": active,
      }
    )}
    onClick={onClick}
  >
    {icon}
  </button>
);

const MenuSection = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <div
    className="inline-flex shadow-sm text-white dark:text-gray-900 mr-2"
    role="group"
  >
    {children}
  </div>
);

const TransformControlButton = ({
  setTransformMode,
  transformMode,
}: Pick<BuilderState, "setTransformMode" | "transformMode">) => {
  const buttons: {
    icon: JSX.Element;
    text: string;
    transformMode: TransformMode;
  }[] = [
    {
      icon: <GiTransform className={transformIconClass} />,
      text: "Translate",
      transformMode: TransformMode.translate,
    },
    {
      icon: <Tb3DRotate className={transformIconClass} />,
      text: "Rotate",
      transformMode: TransformMode.rotate,
    },
    {
      icon: <GiResize className={transformIconClass} />,
      text: "Scale",
      transformMode: TransformMode.scale,
    },
  ];

  return (
    <MenuSection>
      {buttons.map((button, i) => (
        <MenuButton
          key={i}
          active={button.transformMode === transformMode}
          onClick={() => setTransformMode(button.transformMode)}
          icon={button.icon}
        />
      ))}
    </MenuSection>
  );
};

const EditSkyboxButton = ({ editSkybox }: { editSkybox: () => void }) => {
  return (
    <MenuSection>
      <MenuButton
        onClick={editSkybox}
        icon={
          <svg
            className={transformIconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            ></path>
          </svg>
        }
      />
    </MenuSection>
  );
};

const CreatePortalButton = ({ openDialog }: { openDialog: () => void }) => {
  return (
    <>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={clsx(
            "inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700",
            "rounded-l-lg rounded-r-lg"
          )}
          onClick={openDialog}
        >
          <DocumentAddIcon />
          Create a Portal
        </button>
      </div>
    </>
  );
};

const TopMenu = ({
  showContentTree,
  setShowContentTree,
  transformMode,
  setTransformMode,
  setEditingSkybox,
  portalCreator,
  transforming: { isTransforming, elementPath },
  targetElement,
  setCreatingPortal,
}: Pick<
  BuilderState,
  | "showContentTree"
  | "setShowContentTree"
  | "transformMode"
  | "setTransformMode"
  | "portalCreator"
  | "transforming"
  | "targetElement"
> & {
  editingSkybox: boolean;
  setEditingSkybox: (editing: boolean) => void;

  setCreatingPortal: (creating: boolean) => void;
}) => {
  const shouldBeTransforming = isTransforming && elementPath && targetElement;

  return (
    <div
      className={clsx("absolute mx-0 pl-2 my-2 left-0 top-15 z-10 transition-transform", {
        "translate-x-80": showContentTree,
      })}
    >
      <MenuSection>
        <MenuButton onClick={() => setShowContentTree(existing => !existing)} icon={<GiCheckboxTree className={transformIconClass}/>} active={showContentTree}  />
      </MenuSection>
      {shouldBeTransforming && (
        <TransformControlButton
          setTransformMode={setTransformMode}
          transformMode={transformMode}
        />
      )}
      {!shouldBeTransforming && (
        <>
          <EditSkyboxButton editSkybox={() => setEditingSkybox(true)} />
          {portalCreator.canCreatePortal && (
            <CreatePortalButton openDialog={() => setCreatingPortal(true)} />
          )}
        </>
      )}
    </div>
  );
};

const BuilderMenu = (builderState: BuilderState) => {
  const { scene, files, setNewSkyboxFile, tokenId, portalCreator, camera } =
    builderState;
  const [editingSkybox, setEditingSkybox] = useState(false);

  const [creatingPortal, setCreatingPortal] = useState(false);

  useEffect(() => {
    if (editingSkybox) setCreatingPortal(false);
  }, [editingSkybox]);

  useEffect(() => {
    if (creatingPortal) setEditingSkybox(false);
  }, [creatingPortal]);

  const stopPropagation = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div onClick={stopPropagation}>
      <TopMenu
        {...builderState}
        editingSkybox={editingSkybox}
        setEditingSkybox={setEditingSkybox}
        setCreatingPortal={setCreatingPortal}
      />
      {editingSkybox && (
        <EditSkyboxDialog
          setNewSkybox={setNewSkyboxFile}
          skyboxFile={scene.environment?.environmentMap}
          files={files}
          handleClose={() => setEditingSkybox(false)}
        />
      )}
      {creatingPortal && camera && (
        <CreatePortalDialogModal
          currentWorldTokenId={tokenId}
          handleClose={() => setCreatingPortal(false)}
          portalCreator={portalCreator}
          camera={camera}
        />
      )}
    </div>
  );
};

export default BuilderMenu;
