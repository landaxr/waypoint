import { WorldErc721 } from "../types/world";

const danAddress = "0x3a6aF697e89b8c1caFf43d685ebc2b20b8B65F86";
const otherAddress = "0x031684bfC1CC93381ae52591d55d8DCE99Fb8096";

export const catImage =
  "ipfs://bafybeido4mv24yrnidcebqdl5yrvm5xittpynsjnnuh53phss3mwsuyhxe";

type WorldFetchResponse = {
  tokenId: string;
  ownerId: string;
  tokenErc721: WorldErc721;
};

const fetchMockWorlds = async (): Promise<WorldFetchResponse[]> => {
  const fakeScenes: WorldFetchResponse[] = [
    // firstToken has no scene yet
    {
      tokenId: "0",
      ownerId: danAddress,
      tokenErc721: {
        image: catImage,
      },
    },
    {
      tokenId: "1",
      ownerId: otherAddress,
      tokenErc721: {
        image: catImage,
        scene_graph_url:
          "ipfs://bafybeigvnnsg4sseufvp2b2brorlsepkeo2nokwrojeh3by4m5j243vtea/metadata.json",
      },
    },
    {
      tokenId: "2",
      ownerId: danAddress,
      tokenErc721: {
        image: catImage,
        scene_graph_url:
          "ipfs://bafybeieqxa3biirsixl63m5rmwng5xohvixjz3hvhtpoezzodrgwrc4gnm/metadata.json",
      },
    },
  ];

  return fakeScenes;
};

export const fetchAll = async (): Promise<WorldFetchResponse[]> => {
  return await fetchMockWorlds();
};
