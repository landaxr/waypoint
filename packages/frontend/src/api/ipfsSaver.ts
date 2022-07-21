import { SceneConfiguration, StoredSceneAndFiles } from "../types/scene";
import { SceneFilesLocal } from "../types/shared";
import { extractFilesToUploadAndLocations } from "./sceneParser";
import { makeWeb3StorageClient } from "./web3Storage";

export const metadataFileName = "metadata.json";

const createSceneJsonFile = (scene: StoredSceneAndFiles) => {
  const fileContents = JSON.stringify(scene);

  const blob = new Blob([fileContents], { type: "application/json" });

  const file = new File([blob], metadataFileName);

  return file;
};

export const saveSceneToIpfs = async ({
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

  const sceneConfigMetadata = createSceneJsonFile(storedSceneAndFiles);

  console.log({
    files,
    scene,
    storedFileLocations,
    toUpload,
  });

  const allFiles = [sceneConfigMetadata, ...toUpload];

  const client = makeWeb3StorageClient();

  const cid = await client.put(allFiles);

  return cid;
};
