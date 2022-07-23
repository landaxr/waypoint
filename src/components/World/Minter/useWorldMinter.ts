import { useCallback, useEffect, useState } from "react";
import { useContractWrite, useSigner, useAccount } from "wagmi";
import { saveTokenMetadataAndSceneToIpfs } from "../../../api/tokenSaver";
import deployedContracts from "../../../contracts/WayPoint.json";
import { SceneAndFiles } from "../../../types/scene";
import { WorldErc721 } from "../../../types/world";
import { makeNewScene } from "../New";

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

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function useWorldCreator() {
  const [status, setStatus] = useState<MintWorldStatus>({
    minting: false,
    isAllowedToMint: false,
    canMint: true,
  });

  const { data: signerData } = useSigner();
  const { isConnected } = useAccount();

  useEffect(() => {
    console.log({ isConnected });
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const { writeAsync } = useContractWrite({
    addressOrName: contractAddress,
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

    const emptyScene = makeNewScene();

    const { erc721Cid, erc721 } = await saveTokenMetadataAndSceneToIpfs({
      sceneAndFiles: emptyScene,
      name: "New World",
      tokenId: undefined,
    });

    console.log("saving new world");

    await writeAsync({
      args: [`ipfs://${erc721Cid}/erc721.json`],
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

export function useWorldUpdater(sceneAndFiles: SceneAndFiles) {
  const [status, setStatus] = useState<MintWorldStatus>({
    minting: false,
    isAllowedToMint: false,
    canMint: true,
  });

  const { data: signerData } = useSigner();
  const { isConnected } = useAccount();

  useEffect(() => {
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const { writeAsync, error, data, isError, isSuccess } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "changeURI",
  });

  const { canMint, minting } = status;

  const updateWorld = useCallback(
    async (tokenId: string, screenShot?: File) => {
      if (!canMint) throw new Error("Cannot mint!");

      if (minting) return;

      setStatus((existing) => ({
        ...existing,
        minting: true,
        mintedWorld: undefined,
      }));

      const { erc721Cid, erc721 } = await saveTokenMetadataAndSceneToIpfs({
        tokenId,
        name: "my world",
        sceneImage: screenShot,
        sceneAndFiles,
      });

      await writeAsync({
        args: [tokenId, `ipfs://${erc721Cid}/erc721.json`],
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
    [writeAsync, canMint, minting, sceneAndFiles]
  );

  return {
    updateWorld,
    status,
  };
}

export default useWorldUpdater;
