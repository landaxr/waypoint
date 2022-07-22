import clsx from "clsx";
import { BuilderState, TransformMode } from "./useBuilder";

const TransformControlButton = ({
  setTransformMode,
transformMode
}: Pick<BuilderState, "setTransformMode" | "transformMode">) => {
  const buttons: {
    icon: JSX.Element;
    text: string;
  transformMode: TransformMode
  }[] = [
    {
      icon: (
        <svg
          aria-hidden="true"
          className="mr-2 w-4 h-4 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
      text: "Translate",
      transformMode: TransformMode.translate,
    },
    {
      icon: (
        <svg
          aria-hidden="true"
          className="mr-2 w-4 h-4 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
      text: "Rotate",
      transformMode: TransformMode.rotate,
    },
    {
      icon: (
        <svg
          aria-hidden="true"
          className="mr-2 w-4 h-4 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clip-rule="evenodd"
          ></path>
        </svg>
      ),
      text: "Scale",
      transformMode: TransformMode.scale,
    },
  ];

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {buttons.map((button, i) => (
        <button
          type="button"
          key={i}
          className={clsx(
            
            "inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700",
{
              "rounded-l-lg": i === 0,
              "rounded-r-lg": i === buttons.length - 1,
            "bg-gray-900": button.transformMode === transformMode
            },
          )}
          onClick={() => setTransformMode(button.transformMode)}
        >
          {button.icon}
          {button.text}
        </button>
      ))}
    </div>
  );
};
const Menu = ({ setTransformMode, transforming: {isTransforming, elementPath}, targetElement, transformMode }: BuilderState) => {
  return (
    <div className="absolute m-2 top-15 left-0 z-50">
      {isTransforming && elementPath && targetElement && (<TransformControlButton setTransformMode={setTransformMode} transformMode={transformMode} />)}
    </div>
  );
};

export default Menu;
