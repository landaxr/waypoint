import { Web3File } from "web3.storage";
import { SceneAndFiles, StoredSceneAndFiles } from "../types/scene";
import {
  FileLocationKindLocal,
  FileLocationKindStored,
  FileLocationLocal,
  FileLocationStored,
  SceneFilesLocal,
  SceneFilesStored,
} from "../types/shared";
import { metadataFileName } from "./ipfsSaver";
import { makeWeb3StorageClient } from "./web3Storage";

async function toLocalFile(
  fileLocation: FileLocationStored,
  files: Web3File[],
  folderCid: string | undefined
): Promise<FileLocationLocal> {
  if (fileLocation.kind === FileLocationKindStored.https)
    return {
      kind: FileLocationKindLocal.https,
      url: fileLocation.url,
    };

  if (fileLocation.kind === FileLocationKindStored.local) {
    const file = files.find((x) => x.name === fileLocation.path);

    if (!file)
      throw new Error(
        `did not get file for stored file with id ${fileLocation.path}`
      );

    return {
      kind: FileLocationKindLocal.ipfs,
      file,
      cid: file.cid,
      url: `ipfs://${folderCid}/${fileLocation.path}`,
    };
  }

  if (fileLocation.kind === FileLocationKindStored.ipfs) {
    const files = await (
      await makeWeb3StorageClient().get(fileLocation.cid)
    )?.files();

    if (!files || !files[0])
      throw new Error(`could not get file for cid ${fileLocation.cid}`);

    return {
      kind: FileLocationKindLocal.ipfs,
      file: files[0],
      cid: fileLocation.cid,
      url: fileLocation.url,
    };
  }

  throw new Error("unknown file location kind");
}

async function storedFilesToLocal(
  storedFiles: SceneFilesStored,
  files: Web3File[],
  folderCid: string | undefined
): Promise<SceneFilesLocal> {
  const localFiles = await Promise.all(
    Object.entries(storedFiles).map(async ([id, configuredFile]) => {
      const localFile = await toLocalFile(configuredFile, files, folderCid);

      return { id, localFile };
    })
  );

  return localFiles.reduce(
    (acc: SceneFilesLocal, { id, localFile }): SceneFilesLocal => {
      return {
        ...acc,
        [id]: localFile,
      };
    },
    {}
  );
}

// function localFilesToStored

const loadSceneFromIpfs = async (
  cid: string,
  handleProgress: (progress: number) => void
): Promise<SceneAndFiles> => {
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

  const { scene, files: configuredFiles } = JSON.parse(
    metadataText
  ) as StoredSceneAndFiles;

  const localFiles = await storedFilesToLocal(configuredFiles, files, cid);

  return {
    scene,
    files: localFiles,
  };
};

export default loadSceneFromIpfs;
