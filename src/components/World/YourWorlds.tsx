import { Link } from "react-router-dom";
import { useAccount, useEnsName } from "wagmi";
import { useHttpsUriForIpfs } from "../../api/ipfs/ipfsUrlUtils";
import {
  useErc721TokenForFileUrl,
  useWorldsOwnedByAddress,
  WorldData,
} from "../../api/theGraph/worldsQueries";
import { useWayPoint } from "../../generated";
import { ChainConfig } from "../../web3/chains";
import MainNavbar from "../Nav/MainNavbar";
import OpenSeaIcon from "../Shared/OpenSeaIcon";

export const AccountDescriptionText = ({ address }: { address: string }) => {
  const { data } = useEnsName({
    address: (address as `0x${string}`),
  });

  if (data) return <>{data}</>;

  return <>{address}</>;
};

const toOpenSeaAddress = ({
  tokenId,
  path,
  contractAddress,
}: {
  tokenId: string;
  path: string;
  contractAddress: string;
}) =>
  `https://testnets.opensea.io/assets/${path}/${contractAddress}/${tokenId}`;

export const World = ({
  world,
  chain
}: {
  world: WorldData;
  chain: ChainConfig;
}) => {
  const { erc721Token } = useErc721TokenForFileUrl(world.uri);

  const imageUrl = useHttpsUriForIpfs(erc721Token?.image);
  
  const contractAddress = useWayPoint()?.address;

  return (
    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/worlds/${world.id}`}>
        {imageUrl && <img className="rounded-t-lg" src={imageUrl} alt="" />}
      </Link>
      <div className="p-5">
        <div className="flex align-middle mb-2">
          <Link to={`/worlds/${world.id}`}>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {erc721Token?.name ? erc721Token.name : `World token ${world.id}`}
            </h5>
          </Link>
          {contractAddress && (<a
            href={toOpenSeaAddress({ tokenId: world.id, path: chain.path, contractAddress})}
            className="ml-2 mt-1"
            title="View on Opensea"
          >
            <OpenSeaIcon size={25} />
          </a>)}
        </div>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 truncate ...">
          Owner: <AccountDescriptionText address={world.owner.id} />
        </p>
      </div>
    </div>
  );
};

const YourWorlds = ({ chain }: { chain: ChainConfig }) => {
  const { address } = useAccount();
  const worldsResponse = useWorldsOwnedByAddress(address);
  // const { createWorld, status } = useWorldTokenCreator();

  if (!address) return null;

  return (
    <>
      <MainNavbar />
      <div className="container mx-auto flex flex-col items-center p-8 justify-center">
        <h1 className="text-2xl font-sans font-bold">Your Worlds</h1>
        <div className="grid grid-cols-3 gap-4">
          {worldsResponse.data?.spaces.map((world, id) => (
            <World world={world} key={id} chain={chain}  />
          ))}
        </div>
      </div>
    </>
  );
};

export default YourWorlds;
