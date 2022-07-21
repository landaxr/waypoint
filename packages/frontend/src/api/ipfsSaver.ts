import { FilesByPath, SceneConfiguration } from "../types/scene";
import { extractFilesToUploadForSceneAndSetPaths} from "./sceneParser";
import { makeWeb3StorageClient } from "./web3Storage";

export const metadataFileName = "metadata.json";

const createSceneJsonFile = (scene: SceneConfiguration) => {
  const fileContents = JSON.stringify(scene);

  const blob = new Blob([fileContents], { type: "application/json" });

  const file = new File([blob], metadataFileName);

  return file;
};

export const saveSceneToIpfs = async ({
  scene,
files
}: {
  scene: SceneConfiguration;
files: FilesByPath
}) => {
  const { filesToUpload, sceneWithPathsForFiles } =
    extractFilesToUploadForSceneAndSetPaths(scene, files);

  const sceneConfigMetadata = createSceneJsonFile(sceneWithPathsForFiles);

  console.log({
    files,
    filesToUpload,
    scene,
    sceneWithPathsForFiles,
  });

  console.log("uploading files...");

  const allFiles = [sceneConfigMetadata, ...filesToUpload];

  const client = makeWeb3StorageClient();

  const cid = await client.put(allFiles);

  return cid;
};
