import { useEffect, useMemo, useState } from "react";
import { WorldErc721 } from "../../types/world";
import { gql, useQuery } from "@apollo/client";
import { convertURIToHTTPS } from "../ipfs/ipfsUrlUtils";

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
        const fileContentsText = await (await fetch(tokenUrl)).text();

        const fileContents = JSON.parse(fileContentsText) as WorldErc721;

        setErc721Token(fileContents);
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