import { useCallback, useEffect, useState } from "react";
import {
  createImageFromDataUri,
  saveSceneToIpfs,
} from "../ipfs/ipfsSceneSaver";
import { buildAndSaveTokenMetadataToIpfs } from "../nft/tokenSaver";
import { SceneAndFiles } from "../../types/scene";
import { WorldErc721 } from "../../types/world";
import { makeNewScene } from "../../components/World/New";
import { ChainConfig } from "../../web3/chains";
import { useWayPointChangeUri, useWayPointMintNewSpace } from "../../generated";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";

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
  chain: { nftBaseUrl, externalBaseUrl },
}: {
  captureScreenshotFn: (() => string) | undefined;
  chain: Pick<
    ChainConfig, "nftBaseUrl" | "externalBaseUrl"
  >;
}) {
  const [status, setStatus] = useState<MintWorldStatus>({
    isAllowedToMint: false,
    canMint: true,
    minting: false,
  });

  const { isConnected } = useAccount();

  useEffect(() => {
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const { writeAsync: mintNewSpaceContractWrite, isIdle, isSuccess, reset } = useWayPointMintNewSpace();

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
      if (!mintNewSpaceContractWrite) throw new Error("no contract function");
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
        externalBaseUrl,
      });

      console.log("saved new: ", {
        erc721,
        erc721Cid,
        erc721Url: url,
        sceneGraphFileUrl,
      });

      await mintNewSpaceContractWrite({
        recklesslySetUnpreparedArgs: [url]
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
    [
      canMint,
      minting,
      captureScreenshotFn,
      nftBaseUrl,
      externalBaseUrl,
      mintNewSpaceContractWrite,
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
  chain: { nftBaseUrl, externalBaseUrl },
}: {
  sceneAndFiles: SceneAndFiles;
  captureScreenshotFn: (() => string) | undefined;
  existingSceneCid: string | undefined;
  chain: Pick<
    ChainConfig,
    "nftBaseUrl" | "externalBaseUrl"
  >;
}) {
  const [status, setStatus] = useState<MintWorldStatus>({
    isAllowedToMint: false,
    minting: false,
    canMint: true,
  });

  const { isConnected } = useAccount();

  useEffect(() => {
    setStatus((existing) => ({
      ...existing,
      isAllowedToMint: isConnected,
    }));
  }, [isConnected]);

  const {
    writeAsync: changeURIContractWrite,
    isSuccess,
    reset,
  } = useWayPointChangeUri();

  const { canMint, minting } = status;

  const updateWorld = useCallback(
    async (tokenId: string, newWorldName: string | undefined) => {
      if (!changeURIContractWrite) throw new Error("no contract function");
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
        externalBaseUrl,
      });

      console.log("updated: ", {
        erc721,
        erc721Cid,
        erc721Url,
        sceneGraphFileUrl,
      });

      await changeURIContractWrite({
        recklesslySetUnpreparedArgs: [BigNumber.from(tokenId), erc721Url],
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
      changeURIContractWrite,
      existingSceneCid,
      externalBaseUrl,
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
