import { SyntheticEvent, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useHttpsUriForIpfs } from "../../../api/ipfs/ipfsUrlUtils";
import {
  SpacesQueryData,
  useErc721TokenForFileUrl,
  useWorldsOwnedByAddress,
} from "../../../api/theGraph/worldsQueries";
import Modal, { ModalActionButton, ModalHeader3 } from "../../Shared/Modal";
import { MintWorldStatus } from "../../../api/smartContract/useWorldMinter";
import { SceneAndFiles } from "../../../types/scene";

export const SelectedWorld = ({
  tokenId,
  worlds,
}: {
  tokenId: string;
  worlds: SpacesQueryData;
}) => {
  const world = worlds.spaces.find((x) => x.id === tokenId);

  const { erc721Token, loading } = useErc721TokenForFileUrl(world?.uri);
  const worldImageUrl = useHttpsUriForIpfs(erc721Token?.image);

  if (!world || !erc721Token) return null;

  return (
    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg" src={erc721Token?.image || ""} alt="" />
      <div className="p-5">
        <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
          Updating: {erc721Token.name}
        </h5>
        {worldImageUrl && (
          <img
            className="h-20 w-20"
            src={worldImageUrl}
            alt={erc721Token.name}
          />
        )}
      </div>
    </div>
  );
};

export const UpdateWorldDialogModal = ({
  updateWorldStatus,
  handleClose,
  updateWorld,
  currentWorldName,
  currentWorldTokenId,
  sceneAndFiles,
}: {
  updateWorldStatus: MintWorldStatus;
  handleClose: () => void;
  updateWorld: (tokenId: string, newWorldName: string | undefined) => void;
  currentWorldName: string | undefined;
  currentWorldTokenId: string | undefined;
  sceneAndFiles: SceneAndFiles;
}) => {
  const [tokenId, setTokenId] = useState<string | undefined>(
    currentWorldTokenId
  );
  const { address } = useAccount();
  const { data: worlds, loading } = useWorldsOwnedByAddress(address);

  return (
    <Modal
      handleClose={handleClose}
      show
      header={<ModalHeader3 text="Update this World with this Scene" />}
      footer={
        <>
          {!updateWorldStatus.minted ? (
            <div>
              <ModalActionButton
                disabled={
                  !tokenId ||
                  !updateWorldStatus.canMint ||
                  !updateWorldStatus.isAllowedToMint ||
                  updateWorldStatus.minting
                }
                onClick={
                  tokenId
                    ? () => updateWorld(tokenId, currentWorldName)
                    : undefined
                }
                text="Update World"
              />
            </div>
          ) : (
            <p>
              Your world has been successfully updated. Please stand by as the
              transaction propagates...
            </p>
          )}
        </>
      }
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        <SceneGraphRender sceneAndFiles={sceneAndFiles} />
      </div>
    </Modal>
  );
};

const labelClass = "text-monospace text-black dark:text-white";

const SceneGraphRender = ({sceneAndFiles}:{sceneAndFiles: SceneAndFiles}) => (
<>
<label className={labelClass}>scene graph:</label>
        <div className="w-full h-32 overflow-scroll">
          <pre className="text-xs" style={{ marginTop: "0px" }}>
            {JSON.stringify(sceneAndFiles.scene, null, 2)}
          </pre>
        </div>
        <label className={labelClass}>files:</label>
        <div className="w-full m-h-1 overflow-scroll">
          <pre className="text-xs" style={{ marginTop: "0px" }}>
            <ul className="p-0 m-0">
              {Object.keys(sceneAndFiles.files).map((file, id) => (
                <li key={id}>{file}</li>
              ))}
            </ul>
          </pre>
        </div>
</>
)

export const MintToNewWorldDialogModal = ({
  createNewWorld,
  handleClose,
  sceneAndFiles,
  status,
}: {
  createNewWorld: (args: {
    sceneAndFiles?: SceneAndFiles;
    name: string;
  }) => void;
  handleClose: () => void;
  sceneAndFiles: SceneAndFiles;
  status: MintWorldStatus;
}) => {
  const [worldName, setWorldName] = useState<string>("A Whole new World");

  const handleWorldTextChanged = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      e.stopPropagation();
      e.preventDefault();
      // @ts-ignore
      setWorldName(e.target.value);
    },
    []
  );

  return (
    <Modal
      handleClose={handleClose}
      show
      disableClose={status.minted}
      header={<ModalHeader3 text="Mint this Scene to a new World" />}
      footer={
        <>
          <div className="grid grid-rows-2 gap-4">
            <div>
              {!status.minted ? (
                <ModalActionButton
                  disabled={
                    !status.canMint || !status.isAllowedToMint || status.minting
                  }
                  text="Mint new World"
                  onClick={() => {
                    createNewWorld({
                      sceneAndFiles,
                      name: worldName,
                    });
                  }}
                />
              ) : (
                <p>
                  Your new world has been successfully minted. Please stand by
                  as the transaction propagates...
                </p>
              )}
            </div>
          </div>
        </>
      }
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        <SceneGraphRender sceneAndFiles={sceneAndFiles} />
        <div>
          <label htmlFor="worldName" className={labelClass}>
            world name
          </label>
          <input
            type="text"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={worldName}
            onChange={handleWorldTextChanged}
            disabled={status.minted || status.minting}
          />
        </div>
      </div>
    </Modal>
  );
};
