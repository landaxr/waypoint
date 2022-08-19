import clsx from "clsx";
import { SyntheticEvent, useCallback } from "react";
import { BuilderState } from "../hooks/useBuilder";
import ElementIcon from "./Icons";
import { Element } from "../../../../types/elements";

function elementName(element: Element): string {
  return element.name || element.elementType;
}

const ContentTree = ({
  showContentTree,
  setShowContentTree,
  scene: { elements },
  selectElement,
  selectedElement,
}: BuilderState) => {
  const stopPropagation = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  console.log(selectedElement);

  return (
    <div
      id="drawer-navigation"
      className={clsx(
        "fixed z-40 h-screen p-4 overflow-y-auto bg-white w-80 dark:bg-gray-800 transition-transform",
        { "-translate-x-full": !showContentTree }
      )}
      tabIndex={-1}
      aria-labelledby="drawer-navigation-label"
      onClick={stopPropagation}
    >
      <h5
        id="drawer-navigation-label"
        className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
      >
        Content
      </h5>
      <button
        type="button"
        data-drawer-dismiss="drawer-navigation"
        aria-controls="drawer-navigation"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={() => setShowContentTree(false)}
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Close menu</span>
      </button>
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-2">
          {Object.entries(elements || {}).map(([elementId, element]) => (
            <li>
              <a
                href="#"
                className={clsx(
                  "flex items-center p-2 text-base font-normal text-gray-900 dark:text-white rounded-lg cursor-pointer",
                  {
                    "hover:bg-gray-200 dark:hover:bg-gray-700":
                      elementId !== selectedElement,
                    "rounded-lg dark:text-white bg-gray-200 dark:bg-gray-700":
                      elementId === selectedElement,
                  }
                )}
                onClick={(e) => {
                  e.preventDefault();
                  selectElement(elementId);
                }}
              >
                <ElementIcon elementType={element.elementType} />

                <span className="ml-3">{elementName(element)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContentTree;
