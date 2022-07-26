import { useCallback, useEffect, useState } from "react";
import { convertURIToHTTPS } from "../../../api/ipfs/ipfsUrlUtils";
import {
  useErc721TokenForFileUrl,
  useWorlds,
  WorldData,
} from "../../../api/theGraph/worldsQueries";
import Modal, { ModalHeader3 } from "../../Shared/Modal";
import { CreatePortalResponse } from "../../../api/smartContract/usePortalCreator";
import ErrorBoundary from "../../Shared/ErrorBoundary";
import { Camera, Vector3 } from "three";
import clsx from "clsx";

const WorldEntry = ({
  world,
  onSelect,
  selected,
  canSelect,
}: {
  world: WorldData;
  onSelect: (tokenId: string) => void;
  selected: boolean;
  canSelect: boolean;
}) => {
  const { erc721Token } = useErc721TokenForFileUrl(world.uri);

  if (!erc721Token) return <p>loading...</p>;

  return (
    <li
      className={clsx("cursor-pointer", { "bg-gray-400": selected })}
      onClick={() => (!selected && canSelect ? onSelect(world.id) : undefined)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-20 h-20"
            src={convertURIToHTTPS({ url: erc721Token.image })}
            crossOrigin="anonymous"
            alt="World"
          ></img>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {erc721Token.name} (Token {world.id})
          </p>
        </div>
      </div>
    </li>
  );
};

const SelectWorldToPortalTo = ({
  setTokenId,
  worlds,
  selectedWorld,
  canSelect,
}: {
  setTokenId: (tokenId: string) => void;
  worlds: WorldData[];
  selectedWorld: string | undefined;
  canSelect: boolean;
}) => {
  return (
    <>
      <p>Select a world to portal to:</p>

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-scroll">
          {worlds.map((world, id) => (
            <ErrorBoundary key={id}>
              <WorldEntry
                key={id}
                world={world}
                onSelect={setTokenId}
                selected={selectedWorld === world.id}
                canSelect={canSelect}
              />
            </ErrorBoundary>
          ))}
        </ul>
      </div>
    </>
  );
};

const PORTAL_POSITION_OFFSET = 7;

const CreatePortalDialogModal = ({
  portalCreator: { canCreatePortal, createPortal, isRunning, isSuccess, reset },
  currentWorldTokenId,
  handleClose,
  camera,
}: {
  portalCreator: CreatePortalResponse;
  currentWorldTokenId: string | undefined;
  handleClose: () => void;
  camera: Camera;
}) => {
  const [selectedWorldTokenId, setSelectedWorldTokenId] = useState<
    string | undefined
  >();
  const { data: worldsResult } = useWorlds();

  const worldsWithoutCurrent = worldsResult?.spaces.filter(
    (x) => x.id !== currentWorldTokenId
  );

  useEffect(() => {
    reset();
  }, [reset]);

  const handleCreatePortal = useCallback(() => {
    if (!selectedWorldTokenId) return;

    const position = camera.position.clone();
    const lookAt = new Vector3();
    camera.getWorldDirection(lookAt);
    lookAt.normalize();

    const portalPosition = position.add(
      lookAt.multiplyScalar(PORTAL_POSITION_OFFSET)
    );
    createPortal({
      targetId: +selectedWorldTokenId,
      x: portalPosition.x,
      y: portalPosition.y,
      z: portalPosition.z,
      toX: 0,
      toY: 0,
      toZ: 0,
    });
  }, [createPortal, camera, selectedWorldTokenId]);

  const footerControls = isSuccess ? (
    <>
      Your Create Portal transaction has been submitted. Please wait for it to
      propagate.
    </>
  ) : (
    <button
      className="text-white bg-red hover:bg-red-light focus:ring-4 focus:outline-none focus:ring-red-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red dark:hover:bg-red-light dark:focus:ring-red-light disabled:bg-gray-300"
      disabled={!canCreatePortal || isRunning || !selectedWorldTokenId}
      onClick={handleCreatePortal}
    >
      Create a Portal to This World
    </button>
  );

  return (
    <Modal
      handleClose={handleClose}
      show
      header={<ModalHeader3 text="Create a Portal to Another World" />}
      footer={footerControls}
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        {worldsWithoutCurrent && !isSuccess && (
          <>
            <SelectWorldToPortalTo
              setTokenId={setSelectedWorldTokenId}
              worlds={worldsWithoutCurrent}
              selectedWorld={selectedWorldTokenId}
              canSelect={!isRunning}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default CreatePortalDialogModal;
