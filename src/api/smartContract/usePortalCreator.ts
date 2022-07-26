import { useCallback } from "react";
import { useContractWrite, useSigner } from "wagmi";
import deployedContracts from "./contracts/Waypoint.json";
import { contractAddress } from "./useWorldMinter";

export type CreatePortalArgs = {
  targetId: number;
  x: number;
  y: number;
  z: number;
  toX: number;
  toY: number;
  toZ: number;
};

const usePortalCreator = ({ tokenId }: { tokenId?: string }) => {
  const { data: signerData } = useSigner();

  const {
    writeAsync: createPortalContractFn,
    isError,
    isSuccess,
    isIdle,
    reset,
  } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "createPortal",
  });

  const createPortal = useCallback(
    ({ targetId, x, y, z, toX, toY, toZ }: CreatePortalArgs) => {
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
        args,
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
