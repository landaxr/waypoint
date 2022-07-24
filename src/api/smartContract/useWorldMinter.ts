import { useCallback, useEffect, useState } from "react";
import { useContractWrite, useSigner, useAccount } from "wagmi";
import {
  createImageFromDataUri,
  saveSceneToIpfs,
} from "../ipfs/ipfsSceneSaver";
import { buildAndSaveTokenMetadataToIpfs } from "../nft/tokenSaver";
import deployedContracts from "./contracts/Waypoint.json";
// import deployedContracts from "../../../contracts/WayPoint.json";
import { SceneAndFiles } from "../../types/scene";
import { WorldErc721 } from "../../types/world";
import { makeNewScene } from "../../components/World/New";

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

export const localContractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const rinkebyContractAddress =
  "0x8f181e382dF37f4DAB729c1868D0A190A929D614";
export const mumbaiContractAddress =
  "0x9db2f20e541412292677aa43e8d09732f3998992";

export const contractAddress = mumbaiContractAddress;

export function useWorldTokenCreator({
  captureScreenshotFn,
}: {
  captureScreenshotFn: (() => string) | undefined;
}) {
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

  const { writeAsync } = useContractWrite({
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

      const { sceneGraphFileUrl, sceneImageUrl: imageFileUrl, cid } = await saveSceneToIpfs({
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
      cid
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
    [canMint, minting, captureScreenshotFn, writeAsync]
  );

  return {
    createWorld,
    status,
  };
}

export function useWorldTokenUpdater({
  sceneAndFiles,
  captureScreenshotFn,
  existingSceneCid,
}: {
  sceneAndFiles: SceneAndFiles;
  captureScreenshotFn: (() => string) | undefined;
  existingSceneCid: string | undefined;
}) {
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

  const {
    writeAsync: changeURI,
    error,
    data,
    isError,
    isSuccess,
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

      const { sceneGraphFileUrl, sceneImageUrl: imageFileUrl, cid } =
        await saveSceneToIpfs({
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
      cid
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
      sceneAndFiles,
    ]
  );

  return {
    updateWorld,
    status,
  };
}

export default useWorldTokenUpdater;
