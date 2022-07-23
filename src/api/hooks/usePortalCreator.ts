import { useCallback } from "react";
import { useContractWrite, useSigner } from "wagmi";
import deployedContracts from "../../contracts/Waypoint.json";
import { contractAddress } from "./useWorldMinter";

export type CreatePortalArgs = {
    targetId: number,
  x: number,
  y: number,
  z: number,
  toX: number,
  toY: number,
  toZ: number
}
  
const usePortalCreator = ({tokenId}:{
    tokenId?: string
}) => {
  const { data: signerData } = useSigner();

  const {
    writeAsync: createPortal,
    isError,
    isSuccess,
  isIdle
  } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: deployedContracts,
    signerOrProvider: signerData,
    functionName: "createPortal",
  });

  const handleCreatePortal = useCallback(({
  targetId, x, y, z, toX, toY, toZ
  }: CreatePortalArgs) => {
if (!tokenId) throw new Error('cannot create portal without from portal');

const args = [tokenId, targetId, x, y, z, toX, toY, toZ];

createPortal({
    args
})

  }, [
    createPortal, tokenId
  ]);


  return {
    canCreateportal: !!tokenId,
    handleCreatePortal,
isError,
isSuccess,
isRunning: !isIdle
  }
}

export type UserPortalCreatorResponse = ReturnType<typeof usePortalCreator>;

export default usePortalCreator;