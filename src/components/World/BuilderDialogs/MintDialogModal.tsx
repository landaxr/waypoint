import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import {
  convertURIToHTTPS,
  useHttpsUriForIpfs,
} from "../../../api/ipfs/ipfsUrls";
import {
  SpacesQueryData,
  useErc721TokenForFileUrl,
  useWorldsOwnedByAddress,
  WorldData,
} from "../../../api/theGraph/worldsQueries";
import Modal, { ModalHeader3 } from "../../Shared/Modal";
import { MintWorldStatus } from "../../../api/smartContracts/useWorldMinter";

const WorldEntry = ({
  world,
  onSelect,
}: {
  world: WorldData;
  onSelect: (tokenId: string, worldName: string) => void;
}) => {
  const { erc721Token } = useErc721TokenForFileUrl(world.uri);

  const tokenImage = useHttpsUriForIpfs(erc721Token?.image);

  if (!erc721Token) return <p>loading...</p>;

  return (
    <li
      className="py-3 sm:py-4"
      onClick={() => onSelect(world.id, erc721Token.name)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {tokenImage && (
            <img
              className="w-8 h-8"
              src={tokenImage}
              crossOrigin="anonymous"
              alt="World"
            ></img>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            World: {world.id}
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

const SelectWorldToMintTo = ({
  selectWorld,
  worlds: { spaces },
}: {
  selectWorld: (tokenId: string, worldName: string) => void;
  worlds: SpacesQueryData;
}) => {
  return (
    <>
      <p>Select a world to mint to:</p>

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {spaces.map((world, id) => (
            <WorldEntry key={id} world={world} onSelect={selectWorld} />
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
  worlds: SpacesQueryData;
}) => {
  const world = worlds.spaces.find((x) => x.id === tokenId);

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

const MintDialogModal = ({
  updateWorldStatus,
  handleClose,
  updateWorld,
  currentWorldName,
  currentWorldTokenId,
}: {
  updateWorldStatus: MintWorldStatus;
  handleClose: () => void;
  updateWorld: (tokenId: string, newWorldName: string | undefined) => void;
  currentWorldName: string | undefined;
  currentWorldTokenId: string | undefined;
}) => {
  const [tokenId, setTokenId] = useState<string | undefined>(
    currentWorldTokenId
  );
  const { address } = useAccount();
  const { data: worlds, loading } = useWorldsOwnedByAddress(address);

  const [worldName, setWorldName] = useState(currentWorldName);

  const setWorld = useCallback((tokenId: string, name: string) => {
    setTokenId(tokenId);
    setWorldName(name);
  }, []);

  return (
    <Modal
      handleClose={handleClose}
      show
      header={<ModalHeader3 text="Mint this Scene to your World to Polygon" />}
      footer={
        <>
          <label htmlFor="worldName">World Name</label>
          <input
            type="text"
            value={worldName}
            onChange={(e) => setWorldName(e.target.value)}
          />
          <button
            className="text-white bg-red hover:bg-red-light focus:ring-4 focus:outline-none focus:ring-red-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red dark:hover:bg-red-light dark:focus:ring-red-light disabled:bg-gray-300"
            disabled={
              !tokenId ||
              !updateWorldStatus.canMint ||
              !updateWorldStatus.isAllowedToMint ||
              updateWorldStatus.minting
            }
            onClick={
              tokenId ? () => updateWorld(tokenId, worldName) : undefined
            }
          >
            Apply/Mint Scene to World
          </button>
        </>
      }
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        {!tokenId && worlds && (
          <SelectWorldToMintTo selectWorld={setWorld} worlds={worlds} />
        )}
        {tokenId && worlds && (
          <SelectedWorld tokenId={tokenId} worlds={worlds} />
        )}
      </div>
    </Modal>
  );
};

export default MintDialogModal;
