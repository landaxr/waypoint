import { useCallback, useEffect, useState } from "react";
import { useContractWrite, useSigner, useAccount } from "wagmi";
import {
  createImageFromDataUri,
  saveSceneToIpfs,
} from "../ipfs/ipfsSceneSaver";
import { buildAndSaveTokenMetadataToIpfs } from "../nft/tokenSaver";
import deployedContracts from "./contracts/Waypoint.json";
import { SceneAndFiles } from "../../types/scene";
import { WorldErc721 } from "../../types/world";
import { makeNewScene } from "../../components/World/New";
import { ChainConfig } from "../../web3/chains";

export type MintedWorld = {
  erc721Cid: string;
  erc721: WorldErc721;
  tokenId: string;
};

export type MintWorldStatus = {
  isAllowedToMint: boolean;
  canMint: boolean;
  mintedWorld?: MintedWorld;
  minting: boolean;
};

export function useWorldTokenCreator({
  captureScreenshotFn,
  chain: { contractAddress, nftBaseUrl },
}: {
  captureScreenshotFn: (() => string) | undefined;
  chain: Pick<ChainConfig, "contractAddress" | "nftBaseUrl">;
}) {
  const [status, setStatus] = useState<MintWorldStatus>({
    isAllowedToMint: false,
    canMint: true,
    minting: false,
  });

  const { data: signerData } = useSigner();
  const { isConnected } = useAccount();

  useEffect(() => {
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const { writeAsync, isIdle, isSuccess, reset } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "mintNewSpace",
  });

  const { canMint, minting } = status;

  const createWorld = useCallback(
    async ({
      sceneAndFiles = makeNewScene(),
      name,
    }: {
      sceneAndFiles?: SceneAndFiles;
      name: string;
    }) => {
      console.log("minting world");
      if (!canMint) throw new Error("Cannot mint!");

      if (minting) return;

      setStatus((existing) => ({
        ...existing,
        minting: true,
        mintedWorld: undefined,
      }));

      let screenshotFile: File | undefined;
      if (captureScreenshotFn) {
        const screenShot = captureScreenshotFn();

        screenshotFile = await createImageFromDataUri(screenShot, "image.jpg");
      }

      const {
        sceneGraphFileUrl,
        sceneImageUrl: imageFileUrl,
        cid,
      } = await saveSceneToIpfs({
        ...sceneAndFiles,
        sceneImage: screenshotFile,
      });

      const {
        cid: erc721Cid,
        metadata: erc721,
        url,
      } = await buildAndSaveTokenMetadataToIpfs({
        name,
        tokenId: undefined,
        sceneGraphPath: sceneGraphFileUrl,
        sceneImagePath: imageFileUrl,
        cid,
        nftBaseUrl,
      });

      console.log("saved new: ", {
        erc721,
        erc721Cid,
        erc721Url: url,
        sceneGraphFileUrl,
      });

      await writeAsync({
        args: [url],
      });

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
    },
    [canMint, minting, captureScreenshotFn, nftBaseUrl, writeAsync]
  );

  const handleReset = useCallback(() => {
    reset();
    setStatus((existing) => ({
      ...existing,
      minting: false,
    }));
  }, [reset]);

  return {
    createWorld,
    status,
    isSuccess,
    reset: handleReset,
  };
}

export type WorldTokenCreator = ReturnType<typeof useWorldTokenCreator>;

export function useWorldTokenUpdater({
  sceneAndFiles,
  captureScreenshotFn,
  existingSceneCid,
  chain: { contractAddress, nftBaseUrl },
}: {
  sceneAndFiles: SceneAndFiles;
  captureScreenshotFn: (() => string) | undefined;
  existingSceneCid: string | undefined;
  chain: Pick<ChainConfig, "contractAddress" | "nftBaseUrl">;
}) {
  const [status, setStatus] = useState<MintWorldStatus>({
    isAllowedToMint: false,
    minting: false,
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

  const {
    writeAsync: changeURI,
    isSuccess,
    reset,
  } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "changeURI",
  });

  const { canMint, minting } = status;

  const updateWorld = useCallback(
    async (tokenId: string, newWorldName: string | undefined) => {
      if (!canMint) throw new Error("Cannot mint!");

      if (minting) return;

      setStatus((existing) => ({
        ...existing,
        minting: true,
        mintedWorld: undefined,
      }));

      let screenshotFile: File | undefined;
      if (captureScreenshotFn) {
        const screenShot = captureScreenshotFn();

        screenshotFile = await createImageFromDataUri(screenShot, "image.jpg");
      }

      const {
        sceneGraphFileUrl,
        sceneImageUrl: imageFileUrl,
        cid,
      } = await saveSceneToIpfs({
        ...sceneAndFiles,
        sceneImage: screenshotFile,
        forkedFrom: existingSceneCid,
      });

      const {
        cid: erc721Cid,
        metadata: erc721,
        url: erc721Url,
      } = await buildAndSaveTokenMetadataToIpfs({
        tokenId,
        name: newWorldName || "a World",
        sceneGraphPath: sceneGraphFileUrl,
        sceneImagePath: imageFileUrl,
        cid,
        nftBaseUrl,
      });

      console.log("updated: ", {
        erc721,
        erc721Cid,
        erc721Url,
        sceneGraphFileUrl,
      });

      await changeURI({
        args: [tokenId, erc721Url],
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
    [
      canMint,
      captureScreenshotFn,
      changeURI,
      existingSceneCid,
      minting,
      nftBaseUrl,
      sceneAndFiles,
    ]
  );

  const handleReset = useCallback(() => {
    reset();
    setStatus((existing) => ({
      ...existing,
      minting: false,
    }));
  }, [reset]);

  return {
    updateWorld,
    status,
    isSuccess,
    reset: handleReset,
  };
}

export type WorldTokenUpdater = ReturnType<typeof useWorldTokenUpdater>;

export default useWorldTokenUpdater;
