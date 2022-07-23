import { useState } from "react";
import { useAccount } from "wagmi";
import { convertURIToHTTPS } from "../../../api/ipfs/ipfsUrls";
import {
  SpacesQueryData,
  useErc721TokenForFileUrl,
  useWorlds,
  WorldData,
} from "../../../api/theGraph/worldsQueries";
import Modal, { ModalHeader3 } from "../../Shared/Modal";
import { MintWorldStatus } from "../../../api/smartContracts/useWorldMinter";
import { CreatePortalResponse } from "../../../api/smartContracts/usePortalCreator";
import { zeroPad } from "ethers/lib/utils";
import ErrorBoundary from "../../Shared/ErrorBoundary";

const WorldEntry = ({
  world,
  onSelect,
}: {
  world: WorldData;
  onSelect: (tokenId: string) => void;
}) => {
  const { erc721Token } = useErc721TokenForFileUrl(world.uri);

  if (!erc721Token) return <p>loading...</p>;

  return (
    <li className="py-3 sm:py-4" onClick={() => onSelect(world.id)}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-8 h-8 rounded-full"
            src={convertURIToHTTPS({ url: erc721Token.image })}
            crossOrigin="anonymous"
            alt="World"
          ></img>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            World: {erc721Token.name} ({world.id})
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            Has a scene?: {erc721Token.scene_graph_url ? "Yes" : "No"}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          Select &gt;&gt;
        </div>
      </div>
    </li>
  );
};

const SelectWorldToPortalTo = ({
  setTokenId,
  worlds,
}: {
  setTokenId: (tokenId: string) => void;
  worlds: WorldData[];
}) => {
  return (
    <>
      <p>Select a world to portal to:</p>

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {worlds.map((world, id) => (
            <ErrorBoundary key={id}>
              <WorldEntry key={id} world={world} onSelect={setTokenId} />
            </ErrorBoundary>
          ))}
        </ul>
      </div>
    </>
  );
};

const SelectedWorld = ({
  tokenId,
  worlds,
}: {
  tokenId: string;
  worlds: WorldData[];
}) => {
  const world = worlds.find((x) => x.id === tokenId);

  const { erc721Token, loading } = useErc721TokenForFileUrl(world?.uri);
  // const worldImageUrl = useHttpsUriForIpfs(world?.tokenErc721.image);

  if (!world) return null;

  return (
    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg" src={erc721Token?.image || ""} alt="" />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          World at Token {world.id}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Has scene? {!!erc721Token?.scene_graph_url ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

const CreatePortalDialogModal = ({
  portalCreator: { canCreatePortal, createPortal, isRunning },
  currentWorldTokenId,
  handleClose,
}: {
  portalCreator: CreatePortalResponse;
  currentWorldTokenId: string | undefined;
  handleClose: () => void;
}) => {
  const [selectedWorldTokenId, setSelectedWorldTokenId] = useState<
    string | undefined
  >();
  const { data: worldsResult } = useWorlds();

  const worldsWithoutCurrent = worldsResult?.spaces.filter(
    (x) => x.id !== currentWorldTokenId
  );

  return (
    <Modal
      handleClose={handleClose}
      show
      header={<ModalHeader3 text="Creaet a Portal to Another World" />}
      footer={
        <button
          className="text-white bg-red hover:bg-red-light focus:ring-4 focus:outline-none focus:ring-red-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red dark:hover:bg-red-light dark:focus:ring-red-light disabled:bg-gray-300"
          disabled={!canCreatePortal || isRunning || !selectedWorldTokenId}
          onClick={() =>
            selectedWorldTokenId
              ? createPortal({
                  targetId: +selectedWorldTokenId,
                  x: 0,
                  y: 0,
                  z: 0,
                  toX: 0,
                  toY: 0,
                  toZ: 0,
                })
              : undefined
          }
        >
          Create a Portal to This World
        </button>
      }
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        {worldsWithoutCurrent && (
          <>
            {worldsWithoutCurrent && (
              <SelectWorldToPortalTo
                setTokenId={setSelectedWorldTokenId}
                worlds={worldsWithoutCurrent}
              />
            )}
            {selectedWorldTokenId && worldsWithoutCurrent && (
              <SelectedWorld
                tokenId={selectedWorldTokenId}
                worlds={worldsWithoutCurrent}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default CreatePortalDialogModal;
