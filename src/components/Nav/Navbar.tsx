import Web3Login from "./Web3Login";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";

export enum LinkKind {
  button = "button",
  link = "link",
}

export type MenuItem = (
  | { link: string; action?: undefined }
  | { action: () => any; link?: undefined; disabled?: boolean }
) & { title: string | JSX.Element; kind?: LinkKind };

const linkClass = ({
  isActive,
  kind,
  disabled,
}: {
  isActive: boolean;
  kind: LinkKind | undefined;
  disabled?: boolean;
}) =>
  clsx(
    {
      "font-bold active": isActive,
      "rounded-full bg-red text-white text-md font-medium active:bg-red focus:outline-none focus:ring focus:ring-red-light":
        kind === LinkKind.button,
      "bg-red-700 rounded md:bg-transparent text-red dark:text-white":
        kind === LinkKind.link,
    },
    {
      "bg-gray-500": disabled && kind === LinkKind.button,
    },
    {
      "hover:bg-red-light": !disabled && kind === LinkKind.button,
    },
    "block py-2 pr-4 pl-3 md:p-2 font-monospace"
  );

const Navbar = ({ centerItems }: { centerItems: MenuItem[] }) => (
  <nav className="bg-white dark:bg-black border-gray-200 px-2 sm:px-4 py-1 rounded">
    <div className="container flex flex-wrap justify-between items-center mx-auto">
      <Link to="/" className="flex items-center">
        <img
          src="/logo192.png"
          className="mr-3 h-6 sm:h-9"
          alt="Waypoint Logo"
        ></img>
        <span className="self-center text-xl font-monospace font-bold whitespace-nowrap text-black dark:text-white">
          w@y_point
        </span>
      </Link>
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
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
        id="navbar-cta"
      >
        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          {centerItems.map((menuItem) => (
            <li key={menuItem.link}>
              {menuItem.link && (
                <NavLink
                  className={({ isActive }) =>
                    linkClass({ isActive, kind: menuItem.kind })
                  }
                  to={menuItem.link}
                >
                  {menuItem.title}
                </NavLink>
              )}
              {menuItem.action && (
                <button
                  className={linkClass({
                    isActive: false,
                    kind: menuItem.kind,
                    disabled: menuItem.disabled,
                  })}
                  disabled={menuItem.disabled}
                  onClick={menuItem.action}
                >
                  {menuItem.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
