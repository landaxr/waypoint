import { SyntheticEvent, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { convertURIToHTTPS, useHttpsUriForIpfs } from "../../../api/ipfsUrls";
import { useWorldsOwnedByAddress, WorldFetchResponse } from "../../../api/worlds";
import Modal, { ModalHeader3 } from "../../Shared/Modal";
import { MintWorldStatus } from "./useWorldMinter";

const SelectWorldToMintTo = ({
  setTokenId,
  worlds
}: {
  setTokenId: (tokenId: string) => void;
worlds: WorldFetchResponse[]
}) => {


  return (
    <>
      <p>Select a world to mint to:</p>

      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {worlds.map((world, id) => (
            <li className="py-3 sm:py-4" key={id} onClick={() => setTokenId(world.tokenId)}>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={convertURIToHTTPS({ url: world.tokenErc721.image })}
                    crossOrigin="anonymous"
                    alt="World"
                  ></img>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    World: {world.tokenId}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    Has a scene?:{" "}
                    {world.tokenErc721.scene_graph_url ? "Yes" : "No"}
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    Select &gt;&gt;
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const SelectedWorld = ({tokenId, worlds}: { tokenId: string, worlds: WorldFetchResponse[] }) => {
  const world = worlds.find(x => x.tokenId === tokenId);

const worldImageUrl = useHttpsUriForIpfs(world?.tokenErc721.image);

  if (!world)
  return null;

  return (

<div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <img className="rounded-t-lg" src={worldImageUrl || ""} alt="" />
    <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">World at Token {world.tokenId}</h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Has scene? {!!world.tokenErc721.scene_graph_url ? "Yes" : "No"}</p>
    </div>
</div>

  )
};

const MintDialogModal = ({
  updateWorldStatus,
  handleClose,
  updateWorld,
  currentWorldTokenId,
}: {
  updateWorldStatus: MintWorldStatus;
  handleClose: () => void;
  updateWorld: (tokenId: string) => void;
  currentWorldTokenId: string | undefined;
}) => {
  const [tokenId, setTokenId] = useState<string | undefined>(
    currentWorldTokenId
  );
  const { address } = useAccount();
  const worlds = useWorldsOwnedByAddress(address);

  return (
    <Modal
      handleClose={handleClose}
      show
      header={<ModalHeader3 text="Mint this Scene to your World to Polygon" />}
      footer={
        <button
          className="text-white bg-red hover:bg-red-light focus:ring-4 focus:outline-none focus:ring-red-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red dark:hover:bg-red-light dark:focus:ring-red-light disabled:bg-gray-300"
          disabled={!tokenId || !updateWorldStatus.canMint || !updateWorldStatus.isAllowedToMint || updateWorldStatus.minting}
          onClick={tokenId ? () => updateWorld(tokenId) : undefined}
        >
          Mint Scene to World
        </button>
      }
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        {!tokenId && <SelectWorldToMintTo setTokenId={setTokenId} worlds={worlds}/>}
        {tokenId && <SelectedWorld tokenId={tokenId} worlds={worlds} />}
      </div>
    </Modal>
  );
};

export default MintDialogModal;
