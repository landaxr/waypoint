import { useCallback, useState } from "react";
import { useContractWrite, useSigner } from "wagmi";
import { saveTokenMetadataAndSceneToIpfs } from "../../../../api/tokenSaver";
import deployedContracts from "../../../../contracts/Waypoint.json";
import { SceneAndFiles } from "../../../../types/scene";
import { WorldErc721 } from "../../../../types/world";

export type MintWorldStatus = {
  minting: boolean;
  canMint: boolean;
  minted?: boolean;
  mintedWorld?: {
    erc721Cid: string;
    erc721: WorldErc721;
    tokenId: string;
  };
};

function useWorldMinter() {
  const [mintWorldStatus, setMintWorldStatus] = useState<MintWorldStatus>({
    minting: false,
    canMint: false,
  });

  const { data: signerData } = useSigner();

  const { writeAsync } = useContractWrite({
    addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    contractInterface: deployedContracts,
    // contractInterface:
    //   deployedContracts[31337].localhost.contracts.Webway.abi,
    signerOrProvider: signerData,
    functionName: "createToken",
  });

  const { canMint, minting } = mintWorldStatus;

  const updateWorld = useCallback(
    async (tokenId: string, sceneAndFiles: SceneAndFiles) => {
      if (!canMint) throw new Error("Cannot mint!");

      if (minting) return;

      setMintWorldStatus((existing) => ({
        ...existing,
        minting: true,
        mintedWorld: undefined,
      }));

      const { erc721Cid, erc721 } = await saveTokenMetadataAndSceneToIpfs({
        tokenId,
        sceneAndFiles,
      });

      await writeAsync({
        args: [tokenId, erc721Cid],
      });

      setMintWorldStatus((existing) => ({
        ...existing,
        minted: true,
        mintedWorld: {
          erc721,
          erc721Cid,
          tokenId,
        },
      }));
    },
    [writeAsync, canMint, minting]
  );

  return {
    updateWorld,
  mintWorldStatus
  };
}

export default useWorldMinter;
