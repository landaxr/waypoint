import { useAccount } from "wagmi";
import { filterUndefined } from "../../api/sceneParser";
import Navbar, { LinkKind, MenuItem, UrlKind } from "./Navbar";

const homeMenuItems = (isLoggedIn: boolean): (MenuItem | undefined)[] => [
  { link: "/", title: "Explore", urlKind: UrlKind.localRedirect },
  isLoggedIn ? { link: "/your-worlds", title: "Your Worlds", urlKind: UrlKind.localRedirect } : undefined,
  isLoggedIn
    ? { link: "/worlds/new", title: "Build a World", kind: LinkKind.button, urlKind: UrlKind.localRedirect }
    : undefined,
];

const MainNavbar = () => {
  const { isConnected } = useAccount();

  return <Navbar centerItems={filterUndefined(homeMenuItems(isConnected))} web3Enabled />;
};

export default MainNavbar;
