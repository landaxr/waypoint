import { useWorlds } from "../api/theGraph/worldsQueries";
import MainNavbar from "./Nav/MainNavbar";
import { World } from "./World/YourWorlds";

const Explore = () => {
  const worldsResponse = useWorlds();
  return (
    <>
      <MainNavbar />
      <div className="container mx-auto flex flex-col items-center p-4 justify-center">
        <h1 className="text-2xl font-monospace font-bold text-center mt-2 mb-4">
          Explore Worlds Minted to Polygon <a href="https://testnets.opensea.io/collection/name-l3isedjj89" className={'text-red underline'}>(View on OpenSea)</a>
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {worldsResponse.data?.spaces.map((world, id) => (
            <World world={world} key={id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
