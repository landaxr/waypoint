import { useCallback, useEffect, useState } from "react";
import { useContractWrite, useSigner, useAccount } from "wagmi";
import {
  saveErc721ToIpfs,
  saveTokenMetadataAndSceneToIpfs,
} from "../../../../api/tokenSaver";
import { emptyWorldToken } from "../../../../api/worlds";
import deployedContracts from "../../../../contracts/Waypoint.json";
import { SceneAndFiles } from "../../../../types/scene";
import { WorldErc721 } from "../../../../types/world";

export type MintedWorld = {
  erc721Cid: string;
  erc721: WorldErc721;
  tokenId: string;
};

export type MintWorldStatus = {
  minting: boolean;
  isAllowedToMint: boolean;
  canMint: boolean;
  minted?: boolean;
  mintedWorld?: MintedWorld;
};

export function useWorldCreator() {
  const [status, setStatus] = useState<MintWorldStatus>({
    minting: false,
    isAllowedToMint: false,
    canMint: false,
  });

  const { data: signerData } = useSigner();
  const { isConnected } = useAccount();

  useEffect(() => {
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const { writeAsync } = useContractWrite({
    addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "mintNewSpace",
  });

  const { canMint, minting } = status;

  const createWorld = useCallback(async () => {
    if (!canMint) throw new Error("Cannot mint!");

    if (minting) return;

    setStatus((existing) => ({
      ...existing,
      minting: true,
      mintedWorld: undefined,
    }));

    const erc721 = emptyWorldToken();

    const erc721Cid = await saveErc721ToIpfs(erc721);

    console.log("saving new world");

    await writeAsync({
      args: [erc721Cid],
    });

    console.log("saved new world");

    setStatus((existing) => ({
      ...existing,
      minted: true,
      mintedWorld: {
        erc721,
        erc721Cid,
        // todo: figure out token id
        tokenId: "0",
      },
    }));
  }, [writeAsync, canMint, minting]);

  return {
    createWorld,
    status,
  };
}

export function useWorldUpdater() {
  const [status, setStatus] = useState<MintWorldStatus>({
    minting: false,
    isAllowedToMint: false,
    canMint: false,
  });

  const { data: signerData } = useSigner();
  const { isConnected } = useAccount();

  useEffect(() => {
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const { writeAsync } = useContractWrite({
    addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "changeURI",
  });

  const { canMint, minting } = status;

  const updateWorld = useCallback(
    async (tokenId: string, sceneAndFiles: SceneAndFiles) => {
      if (!canMint) throw new Error("Cannot mint!");

      if (minting) return;

      setStatus((existing) => ({
        ...existing,
        minting: true,
        mintedWorld: undefined,
      }));

      const { erc721Cid, erc721 } = await saveTokenMetadataAndSceneToIpfs({
        tokenId,
        sceneAndFiles,
      });

      await writeAsync({
        args: [tokenId, erc721Cid],
      });

      setStatus((existing) => ({
        ...existing,
        minted: true,
        mintedWorld: {
          erc721,
          erc721Cid,
          tokenId,
        },
      }));
    },
    [writeAsync, canMint, minting]
  );

  return {
    updateWorld,
    status,
  };
}

export default useWorldUpdater;
