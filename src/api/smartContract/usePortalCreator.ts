import { useCallback } from "react";
import { useSigner } from "wagmi";
import { useWayPointCreatePortal } from "../../generated";

export type CreatePortalArgs = {
  targetId: number;
  x: number;
  y: number;
  z: number;
  toX: number;
  toY: number;
  toZ: number;
};

const usePortalCreator = ({
  tokenId,
}: {
  tokenId?: string;
}) => {
  const { data: signerData } = useSigner();

  const {
    writeAsync: createPortalContractFn,
    isError,
    isSuccess,
    isIdle,
    reset,
  } = useWayPointCreatePortal();


  const createPortal = useCallback(
    ({ targetId, x, y, z, toX, toY, toZ }: CreatePortalArgs) => {
      if (!createPortalContractFn) throw new Error("no contract function");
      if (!tokenId) throw new Error("cannot create portal without from portal");

      const args = [
        tokenId,
        targetId,
        Math.round(x),
        Math.round(y),
        Math.round(z),
        Math.round(toX),
        Math.round(toY),
        Math.round(toZ),
      ];

      console.log("creating portal with args", args);

      createPortalContractFn({
        // @ts-ignore
        recklesslySetUnpreparedArgs: args
      });
    },
    [createPortalContractFn, tokenId]
  );

  return {
    canCreatePortal: !!tokenId,
    createPortal,
    isError,
    isSuccess,
    isRunning: !isIdle,
    reset,
  };
};

export type CreatePortalResponse = ReturnType<typeof usePortalCreator>;

export default usePortalCreator;
