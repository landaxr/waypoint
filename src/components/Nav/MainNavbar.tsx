import { useAccount } from "wagmi";
import { filterUndefined } from "../../api/sceneParser";
import Navbar, { LinkKind, MenuItem } from "./Navbar";

const homeMenuItems = (isLoggedIn: boolean): (MenuItem | undefined)[] => [
  { link: "/", title: "Explore" },
  isLoggedIn ? { link: "/your-worlds", title: "Your Worlds" } : undefined,
  isLoggedIn
    ? { link: "/worlds/new", title: "Build a World", kind: LinkKind.button }
    : undefined,
];

const MainNavbar = () => {
  const { isConnected } = useAccount();

  return <Navbar centerItems={filterUndefined(homeMenuItems(isConnected))} />;
};

export default MainNavbar;
