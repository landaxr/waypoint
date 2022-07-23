import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useHttpsUriForIpfs } from "../../api/ipfsUrls";
import {
  useErc721TokenForFileUrl,
  useWorldsOwnedByAddress,
  WorldData,
} from "../../api/worldsQueries";
import MainNavbar from "../Nav/MainNavbar";
import { useWorldTokenCreator } from "./Minter/useWorldMinter";

const World = ({ world }: { world: WorldData }) => {
  // const { loading, error, data } = useQuery<WorldsData>(GET_LOCAL_WORLDS);

  const { erc721Token, loading } = useErc721TokenForFileUrl(world.uri);

  const imageUrl = useHttpsUriForIpfs(erc721Token?.image);

  return (
    <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/worlds/${world.id}`}>
        {imageUrl && <img className="rounded-t-lg" src={imageUrl} alt="" />}
      </Link>
      <div className="p-5">
        <Link to={`/worlds/${world.id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            token: {world.id}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{`owned by ${world.owner.id}`}</p>
      </div>
    </div>
  );
};

const YourWorlds = () => {
  const { address } = useAccount();
  const worldsResponse = useWorldsOwnedByAddress(address);
  const { createWorld, status } = useWorldTokenCreator();

  return (
    <>
      <MainNavbar />
      <div className="container mx-auto flex flex-col items-center p-8 justify-center">
        <h1 className="text-2xl font-sans font-bold">Your Worlds</h1>
        <p>
          <button
            onClick={createWorld}
            disabled={
              !status.canMint || !status.isAllowedToMint || status.minting
            }
            className="rounded-full bg-red text-white text-md font-medium active:bg-red focus:outline-none focus:ring focus:ring-red-light py-2 pr-4 pl-3 md:p-2 m-4 font-monospace"
          >
            Create a World on Polygon
          </button>
        </p>
        <div className="grid grid-cols-3 gap-4">
          {worldsResponse.data?.spaces.map((world, id) => (
            <World world={world} key={id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default YourWorlds;
