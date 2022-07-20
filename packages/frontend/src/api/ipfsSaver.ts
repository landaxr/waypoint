import { Web3Storage } from "web3.storage";
import { SceneConfiguration } from "../types/scene";
import { extractFilesToUploadForSceneAndSetPaths } from "./sceneParser";

const web3StorageKey = process.env.REACT_APP_WEB3_STORAGE_KEY;

const createSceneJsonFile = (scene: SceneConfiguration) => {
  const fileContents = JSON.stringify(scene);

  const blob = new Blob([fileContents], { type: "application/json" });

  const file = new File([blob], "metadata.json");

  return file;
};

export const saveSceneToIpfs = async ({
  scene,
}: {
  scene: SceneConfiguration;
}) => {
  const { files, sceneWithPathsForFiles } =
    extractFilesToUploadForSceneAndSetPaths(scene);

  const sceneConfigMetadata = createSceneJsonFile(sceneWithPathsForFiles);

  console.log({
    files,
    scene,
    sceneWithPathsForFiles,
  });

  if (!web3StorageKey)
    throw new Error(
      "REACT_APP_WEB3_STORAGE_KEY environment variable must be defined."
    );
  // @ts-ignore
  const client = new Web3Storage({ token: web3StorageKey });

  console.log("uploading files...");

  const allFiles = [sceneConfigMetadata, ...files];

  const cid = await client.put(allFiles);

  return cid;
};
