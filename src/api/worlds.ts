import { useEffect, useState } from "react";
import { WorldErc721 } from "../types/world";

const danAddress = "0x3a6aF697e89b8c1caFf43d685ebc2b20b8B65F86";
const otherAddress = "0x031684bfC1CC93381ae52591d55d8DCE99Fb8096";

const scaffoldAddress = "0xF93113F729D81BE7C4078F9B3177708D5D4d1847";

export const catImage =
  "ipfs://bafybeido4mv24yrnidcebqdl5yrvm5xittpynsjnnuh53phss3mwsuyhxe";

export type WorldFetchResponse = {
  tokenId: string;
  ownerAddress: string;
  tokenErc721: WorldErc721;
};

export const emptyWorldToken = (): WorldErc721 => ({
  image: catImage,
});

const fetchMockWorlds = async (): Promise<WorldFetchResponse[]> => {
  const fakeScenes: WorldFetchResponse[] = [
    // firstToken has no scene yet
    {
      tokenId: "0",
      ownerAddress: danAddress,
      tokenErc721: emptyWorldToken(),
    },
    {
      tokenId: "1",
      ownerAddress: otherAddress,
      tokenErc721: {
        image: catImage,
        scene_graph_url:
          "ipfs://bafybeigvnnsg4sseufvp2b2brorlsepkeo2nokwrojeh3by4m5j243vtea/metadata.json",
      },
    },
    {
      tokenId: "2",
      ownerAddress: danAddress,
      tokenErc721: {
        image: catImage,
        scene_graph_url:
          "ipfs://bafybeieqxa3biirsixl63m5rmwng5xohvixjz3hvhtpoezzodrgwrc4gnm/metadata.json",
      },
    },
    {
      tokenId: "3",
      ownerAddress: scaffoldAddress,
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

export function useWorldsOwnedByAddress(address: string | undefined) {
  const [worlds, setWorlds] = useState<WorldFetchResponse[]>([]);

  useEffect(() => {
    (async () => {
      setWorlds(
        (await fetchMockWorlds()).filter((x) => x.ownerAddress === address)
      );
    })();
  }, [address]);

  return worlds;
}
