import { SceneConfiguration, StoredSceneAndFiles } from "../types/scene";
import { SceneFilesLocal } from "../types/shared";
import { extractFilesToUploadAndLocations } from "./sceneParser";
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
}: {
  scene: SceneConfiguration;
  files: SceneFilesLocal;
}) => {
  const { fileLocations: storedFileLocations, toUpload } =
    extractFilesToUploadAndLocations({ scene, files });

  const storedSceneAndFiles: StoredSceneAndFiles = {
    scene,
    files: storedFileLocations,
  };

  const sceneConfigMetadata = createJsonFileFromObject(
    storedSceneAndFiles,
    metadataFileName
  );

  console.log({
    files,
    scene,
    storedFileLocations,
    toUpload,
  });

  return {
    sceneConfigMetadata,
    sceneAssetsToUpload: toUpload,
  };
};

export const saveSceneToIpfs = async ({
  scene,
  files,
}: {
  scene: SceneConfiguration;
  files: SceneFilesLocal;
}) => {
  const { sceneConfigMetadata, sceneAssetsToUpload } = await makeIpfsSceneFiles(
    { scene, files }
  );

  const allFiles = [sceneConfigMetadata, ...sceneAssetsToUpload];

  const client = makeWeb3StorageClient();

  const cid = await client.put(allFiles);

  return cid;
};
