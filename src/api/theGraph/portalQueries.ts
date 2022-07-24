import { useMemo } from "react";
import { WorldErc721 } from "../../types/world";
import { gql, useQuery } from "@apollo/client";

export type PortalFetchResponse = {
  tokenId: string;
  ownerAddress: string;
  tokenErc721: WorldErc721;
};

const allPortalsQuery = () => gql`
  {
    portals {
      space
      id
      targetId
      x
      y
      z
      toX
      toY
      toZ
    }
  }
`;

const portalsFromWorldQuery = (fromTokenId: string) => gql`
{
  portals(
    where: {space: "${fromTokenId.toLowerCase()}"}
  ) {
    space
    id
    targetId
    x
    y
    z
    toX
    toY
    toZ
  }
}
`;

export type PortalData = {
  space: string;
  id: string;
  targetId: string;
  x: string;
  y: string;
  z: string;
};

export type PortalsQueryData = {
  portals: PortalData[];
};

export function usePortalsFromWorld(tokenId: string) {
  const gql = useMemo(() => portalsFromWorldQuery(tokenId), [tokenId]);

  const { loading, data } = useQuery<PortalsQueryData>(gql, {
    pollInterval: 2500,
  });

  return {
    loading,
    data,
  };
}

export function usePortals() {
  const { loading, data } = useQuery<PortalsQueryData>(allPortalsQuery(), {
    pollInterval: 2500,
  });

  return {
    loading,
    data,
  };
}
