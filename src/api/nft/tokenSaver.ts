import { WorldErc721 } from "../../types/world";
import { createJsonFileFromObject } from "../ipfs/ipfsSceneSaver";
import { makeWeb3StorageClient } from "../ipfs/web3Storage";

const applicationCid = "QmcPnK7wxgWhm969f4QNMXUiSyhvowS388ELJMRx6pdVn2";
// todo: use ipfs url
const makeInteractiveApplicationUrl = (tokenId: string) =>
  `ipfs://${applicationCid}/#/${tokenId}`;

export const erc721TokenFileName = "erc721.json";

export async function saveErc721ToIpfs(toSave: object) {
  const json = createJsonFileFromObject(toSave, erc721TokenFileName);

  const client = makeWeb3StorageClient();

  const cid = await client.put([json]);

  return cid;
}

export async function buildAndSaveTokenMetadataToIpfs({
  tokenId,
  name,
  sceneImagePath,
  sceneGraphPath,
}: {
  tokenId: string | undefined;
  name: string;
  sceneImagePath?: string;
  sceneGraphPath?: string;
}): Promise<{ cid: string; metadata: WorldErc721; url: string }> {
  const erc721Metadata: WorldErc721 = {
    image: sceneImagePath,
    name,
    animation_url: tokenId ? makeInteractiveApplicationUrl(tokenId) : undefined,
    scene_graph_url: sceneGraphPath,
  };

  const erc721MetadataFile = createJsonFileFromObject(
    erc721Metadata,
    erc721TokenFileName
  );

  const client = makeWeb3StorageClient();

  console.log({
    erc721MetadataFile,
    sceneImagePath,
    sceneGraphPath,
  });

  const cid = await client.put([erc721MetadataFile]);

  const erc721Url = `ipfs://${cid}/erc721.json`;

  return {
    metadata: erc721Metadata,
    cid: cid,
    url: erc721Url,
  };
}