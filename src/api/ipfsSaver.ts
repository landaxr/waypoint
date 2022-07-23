import { CIDString } from "web3.storage";
import { SceneConfiguration, StoredSceneAndFiles } from "../types/scene";
import { SceneFilesLocal } from "../types/shared";
import {
  extractFilesToUploadAndLocations,
  filterUndefined,
} from "./sceneParser";
import { makeWeb3StorageClient } from "./web3Storage";

export const metadataFileName = "metadata.json";

// source: https://stackoverflow.com/questions/12168909/blob-from-dataurl
async function dataURItoBlob(dataURI: string) {
  return await (await fetch(dataURI)).blob();
}

export const createImageFromDataUri = async (
  dataUri: string,
  fileName: string
) => {
  const blob = await dataURItoBlob(dataUri);

  const file = new File([blob], fileName);

  return file;
};

export const createJsonFileFromObject = (object: Object, fileName: string) => {
  const fileContents = JSON.stringify(object);

  const blob = new Blob([fileContents], { type: "application/json" });

  const file = new File([blob], fileName);

  return file;
};

export const makeIpfsSceneFiles = async ({
  scene,
  files,
  forkedFrom,
  sceneImage,
}: {
  scene: SceneConfiguration;
  files: SceneFilesLocal;
  forkedFrom?: string;
  sceneImage?: File;
}) => {
  const { fileLocations: storedFileLocations, toUpload } =
    extractFilesToUploadAndLocations({ scene, files });

  const storedSceneAndFiles: StoredSceneAndFiles = {
    scene,
    files: storedFileLocations,
    forkedFrom,
  };

  const sceneConfigMetadata = createJsonFileFromObject(
    storedSceneAndFiles,
    metadataFileName
  );

  return {
    sceneConfigMetadata,
    sceneAssetsToUpload: toUpload,
  };
};

const toFileInIpfsFolder = (cid: CIDString, file: File | undefined) => {
  if (!file) return undefined;

  return `ipfs://${cid}/${file.name}`;
};

export const saveSceneToIpfs = async ({
  scene,
  files,
  sceneImage,
  forkedFrom,
}: {
  scene: SceneConfiguration;
  files: SceneFilesLocal;
  sceneImage?: File;
  forkedFrom?: string;
}) => {
  const { sceneConfigMetadata, sceneAssetsToUpload } = await makeIpfsSceneFiles(
    { scene, files, forkedFrom }
  );

  const allFiles = filterUndefined([
    sceneConfigMetadata,
    ...sceneAssetsToUpload,
    sceneImage,
  ]);

  const client = makeWeb3StorageClient();

  const cid = await client.put(allFiles);

  const sceneGraphFileUrl = toFileInIpfsFolder(
    cid,
    sceneConfigMetadata
  ) as string;
  const sceneImageUrl = toFileInIpfsFolder(cid, sceneImage);

  return {
    cid,
    sceneGraphFileUrl,
    sceneImageUrl: sceneImageUrl,
  };
};
