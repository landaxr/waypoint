import { useEffect, useMemo, useState } from "react";
import { WorldErc721 } from "../types/world";
import { gql, useQuery } from "@apollo/client";
import { convertURIToHTTPS } from "./ipfsUrls";

export const catImage =
  "https://ipfs.io/ipfs/bafybeido4mv24yrnidcebqdl5yrvm5xittpynsjnnuh53phss3mwsuyhxe/CatImage.png";

export type WorldFetchResponse = {
  tokenId: string;
  ownerAddress: string;
  tokenErc721: WorldErc721;
};

export const useErc721TokenForFileUrl = (fileUrl: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [erc721Token, setErc721Token] = useState<WorldErc721>();

  useEffect(() => {
    if (!fileUrl) return;
    setLoading(true);
    const tokenUrl = convertURIToHTTPS({
      url: fileUrl,
    });

    (async () => {
      try {
        console.log("fetching", tokenUrl);
        const fileContentsText = await (await fetch(tokenUrl)).text();

        const fileContents = JSON.parse(fileContentsText) as WorldErc721;


        // hack - get cid from url:
        const urlSplit = tokenUrl.split('/');
        const cid = urlSplit[urlSplit.length-2];

        const withPathsFixed = appendIpfsPathToContents(fileContents, cid );

        console.log({withPathsFixed, fileContents});

        setErc721Token(withPathsFixed);
      } finally {
        setLoading(false);
      }
    })();
  }, [fileUrl]);

  return {
    erc721Token,
    loading,
  };
};

const spacesQuery = () => gql`
  {
    spaces {
      owner {
        id
      }
      uri
      id
    }
  }
`;

const spacesOfOwnerQuery = (ownerAddress: string) => gql`
{
  spaces(
    where: {owner: "${ownerAddress.toLowerCase()}"}
  ) {
    owner {
      id
    }
    uri
    id
  }
}
`;

const spaceQuery = (tokenId: string) => gql`
{
  spaces(
    where: {id: "${tokenId}"}
  ) {
    owner {
      id
    }
    uri
    id
  }
}
`;

export type WorldData = {
  owner: {
    id: string;
  };
  uri: string;
  id: string;
};

export type SpacesQueryData = {
  spaces: WorldData[];
};

export function useWorldsOwnedByAddress(address: string | undefined) {
  const spacesGql = useMemo(
    () => (address ? spacesOfOwnerQuery(address) : spacesQuery()),
    [address]
  );

  const { loading, data } = useQuery<SpacesQueryData>(spacesGql, {
    pollInterval: 2500,
  });

  return {
    loading,
    data,
  };
}

export function useWorlds() {
  const { loading, data } = useQuery<SpacesQueryData>(spacesQuery(), {
    pollInterval: 2500,
  });

  return {
    loading,
    data,
  };
}



export function useWorld(tokenId: string) {
  const worldGql = useMemo(() => spaceQuery(tokenId), [tokenId]);

  const { loading, data } = useQuery<SpacesQueryData>(worldGql, {
    pollInterval: 2500,
  });

  return {
    loading,
    world: data ? data.spaces[0] : undefined,
  };
}

const makeIpfsUrlFromPath = (path: string|undefined, cid: string) => {
  if (!path) return undefined;

  return `ipfs://${cid}/${path}`;
}

function appendIpfsPathToContents(fileContents: WorldErc721, cid: string) {

  const result: WorldErc721 = {
    ...fileContents,
    animation_url: makeIpfsUrlFromPath(fileContents.animation_url, cid),
    image: makeIpfsUrlFromPath(fileContents.image, cid),
    scene_graph_url: makeIpfsUrlFromPath(fileContents.scene_graph_url, cid),
  };

  return result;
}

