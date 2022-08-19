import clsx from "clsx";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import CreatePortalDialogModal from "../../BuilderDialogs/CreatePortalDialog";
import EditSkyboxDialog from "../EditSkyboxDialog";
import { BuilderState, TransformMode } from "../hooks/useBuilder";

const transformIconClass = "mr-2 w-4 h-4 fill-current";

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
      icon: (
        <svg
          aria-hidden="true"
          className={transformIconClass}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: "Translate",
      transformMode: TransformMode.translate,
    },
    {
      icon: (
        <svg
          aria-hidden="true"
          className={transformIconClass}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: "Rotate",
      transformMode: TransformMode.rotate,
    },
    {
      icon: (
        <svg
          aria-hidden="true"
          className={transformIconClass}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: "Scale",
      transformMode: TransformMode.scale,
    },
  ];

  return (
    <div className="inline-flex rounded-md shadow-sm text-white" role="group">
      {buttons.map((button, i) => (
        <button
          type="button"
          key={i}
          className={clsx(
            "inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700",
            {
              "rounded-l-lg": i === 0,
              "rounded-r-lg": i === buttons.length - 1,
              "bg-gray-900 text-white": button.transformMode === transformMode,
            }
          )}
          onClick={() => setTransformMode(button.transformMode)}
        >
          {button.icon}
          {button.text}
        </button>
      ))}
    </div>
  );
};
const EditSkyboxButton = ({ editSkybox }: { editSkybox: () => void }) => {
  return (
    <>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={clsx(
            "inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700",
            "rounded-l-lg rounded-r-lg"
          )}
          onClick={editSkybox}
        >
          <svg
            className="w-6 h-6"
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
          Change Skybox
        </button>
      </div>
    </>
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

const BuilderMenu = ({
  scene,
  setTransformMode,
  files,
  transforming: { isTransforming, elementPath },
  targetElement,
  transformMode,
  setNewSkyboxFile,
  tokenId,
  portalCreator,
  camera,
}: BuilderState) => {
  const shouldBeTransforming = isTransforming && elementPath && targetElement;
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
      <div className="absolute m-2 top-15 left-0 z-10">
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
