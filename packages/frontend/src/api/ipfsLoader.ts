import { FilesByPath, SceneAndFiles, SceneConfiguration } from "../types/scene";
import { metadataFileName } from "./ipfsSaver";
import { makeWeb3StorageClient } from "./web3Storage";

const loadSceneFromIpfs = async (cid: string): Promise<SceneAndFiles> => {
  const client = makeWeb3StorageClient();

  const res = await client.get(cid);

  if (!res?.ok) {
    throw new Error(
      `failed to get ${cid} - [${res?.status}] ${res?.statusText}`
    );
  }

  const files = await res?.files();

  const metadataFile = files.find((x) => x.name === metadataFileName);

  if (!metadataFile)
    throw new Error("missing metadata.json files from archive");

  const metadataText = await metadataFile.text();

  const scene = JSON.parse(metadataText) as SceneConfiguration;

  const filesByPath = files.reduce((acc: FilesByPath, file): FilesByPath => {
    return {
      ...acc,
      [file.name]: file,
    };
  }, {});

  return {
    scene,
    files: filesByPath,
  };
};

export default loadSceneFromIpfs;
