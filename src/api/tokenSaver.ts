import { SceneAndFiles } from "../types/scene";
import { WorldErc721 } from "../types/world";
import {
  createJsonFileFromObject,
  makeIpfsSceneFiles,
  metadataFileName,
} from "./ipfsSaver";
import { filterUndefined } from "./sceneParser";
import { makeWeb3StorageClient } from "./web3Storage";

const applicationCid = "Qmd2jeJvashH7Hb6JFpsnM4mHvGGdTdS6todHHMHPpwaw3";
// todo: use ipfs url
const makeInteractiveApplicationUrl = (tokenId: string) =>
  `ipfs://${applicationCid}/#/worlds/${tokenId}`;

export const erc721TokenFileName = "erc721.json";

export async function saveErc721ToIpfs(toSave: object) {
  const json = createJsonFileFromObject(toSave, erc721TokenFileName);

  const client = makeWeb3StorageClient();

  const cid = await client.put([json]);

  return cid;
}

export async function saveTokenMetadataAndSceneToIpfs({
  tokenId,
  sceneImage,
  name,
  sceneAndFiles,
}: {
  tokenId: string | undefined;
  name: string;
  sceneImage?: File;
  sceneAndFiles: SceneAndFiles;
}): Promise<{ erc721Cid: string; erc721: WorldErc721 }> {
  const sceneIpfsFiles = await makeIpfsSceneFiles(sceneAndFiles);

  const erc721Metadata: WorldErc721 = {
    image: sceneImage ? sceneImage.name : undefined,
    name,
    animation_url: tokenId ? makeInteractiveApplicationUrl(tokenId) : undefined,
    scene_graph_url: metadataFileName,
  };

  const erc721MetadataFile = createJsonFileFromObject(
    erc721Metadata,
    erc721TokenFileName
  );

  const client = makeWeb3StorageClient();

  const allFiles = filterUndefined([
    ...sceneIpfsFiles.sceneAssetsToUpload,
    sceneImage,
    sceneIpfsFiles.sceneConfigMetadata,
    erc721MetadataFile,
  ]);

  const cid = await client.put(allFiles);

  return {
    erc721: erc721Metadata,
    erc721Cid: cid,
  };
}
