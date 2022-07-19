import Web3Login from "./Web3Login";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

enum LinkKind {
  button = "button",
}

const homeMenuItems: { link: string; title: string; kind?: LinkKind }[] = [
  { link: "/", title: "Explore" },
  { link: "/your-worlds", title: "Your Worlds" },
  { link: "/worlds/new", title: "Build a World", kind: LinkKind.button },
];

const Navbar = () => (
  <nav className="bg-white border-gray-200 px-2 sm:px-4 py-1 rounded dark:bg-gray-900">
    <div className="container flex flex-wrap justify-between items-center mx-auto">
      <a href="https://flowbite.com/" className="flex items-center">
        <img
          src="/logo192.png"
          className="mr-3 h-6 sm:h-9"
          alt="Waypoint Logo"
        ></img>
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          w@y_point
        </span>
      </a>
      <div className="flex md:order-2">
        <Web3Login />
        <button
          data-collapse-toggle="navbar-cta"
          type="button"
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-cta"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
        id="navbar-cta"
      >
        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          {homeMenuItems.map((menuItem) => (
            <li key={menuItem.link}>
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    { ["font-bold active"]: isActive,
                     ['rounded-full bg-green-600 text-md font-medium hover:bg-green-900 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300'] : menuItem.kind === LinkKind.button,
                     ['bg-blue-700 rounded md:bg-transparent md:text-blue-700 dark:text-white'] : menuItem.kind !== LinkKind.button
                     },
                    "block py-2 pr-4 pl-3 text-white md:p-2"
                  )
                }
                to={menuItem.link}
              >
                {menuItem.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
