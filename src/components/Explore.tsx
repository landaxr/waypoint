import { useWorlds } from "../api/worldsQueries";
import MainNavbar from "./Nav/MainNavbar";
import { World } from "./World/YourWorlds";

const Explore = () => {
  const worldsResponse = useWorlds();
  return (
    <>
      <MainNavbar />
      <div className="container mx-auto flex flex-col items-center p-4 justify-center">
        <h1 className="text-2xl font-monospace font-bold text-center mt-2 mb-4">
          Explore Minted Worlds
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
