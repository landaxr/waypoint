import Navbar, { LinkKind, MenuItem } from "./Navbar";

const homeMenuItems: MenuItem[] = [
  { link: "/", title: "Explore" },
  { link: "/your-worlds", title: "Your Worlds" },
  { link: "/worlds/new", title: "Build a World", kind: LinkKind.button },
];

const MainNavbar = () => <Navbar centerItems={homeMenuItems} />;

export default MainNavbar;
