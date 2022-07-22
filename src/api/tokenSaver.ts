import { SceneAndFiles } from "../types/scene";
import { WorldErc721 } from "../types/world";
import {
  createJsonFileFromObject,
  makeIpfsSceneFiles,
  metadataFileName,
} from "./ipfsSaver";
import { makeWeb3StorageClient } from "./web3Storage";
import { catImage } from "./worlds";

const applicationCid = "Qmd2jeJvashH7Hb6JFpsnM4mHvGGdTdS6todHHMHPpwaw3";
// todo: use ipfs url
const makeInteractiveApplicationUrl = (tokenId: string) =>
  `ipfs://${applicationCid}/#/worlds/${tokenId}`;

export const erc721TokenFileName = "erc721.json";

export async function saveTokenMetadataAndSceneToIpfs({
  tokenId,
  sceneAndFiles,
}: {
  tokenId: string;
  sceneAndFiles: SceneAndFiles;
}): Promise<{ erc721Cid: string; erc721: WorldErc721 }> {
  const sceneIpfsFiles = await makeIpfsSceneFiles(sceneAndFiles);

  const erc721Metadata: WorldErc721 = {
    image: catImage,
    animation_url: makeInteractiveApplicationUrl(tokenId),
    scene_graph_url: metadataFileName,
  };

  const erc721MetadataFile = createJsonFileFromObject(
    erc721Metadata,
    erc721TokenFileName
  );

  const client = makeWeb3StorageClient();

  const allFiles = [
    ...sceneIpfsFiles.sceneAssetsToUpload,
    sceneIpfsFiles.sceneConfigMetadata,
    erc721MetadataFile,
  ];

  const cid = await client.put(allFiles);

  return {
    erc721: erc721Metadata,
    erc721Cid: cid,
  };
}
