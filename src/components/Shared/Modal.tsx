import clsx from "clsx";

export const ModalHeader3 = ({ text }: { text: string }) => (
  <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
    {text}
  </h3>
);

const CloseButton = ({ handleClose }: { handleClose: () => void }) => (
  <button
    type="button"
    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
    data-modal-toggle="crypto-modal"
    onClick={handleClose}
  >
    <svg
      aria-hidden="true"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      ></path>
    </svg>
    <span className="sr-only">Close modal</span>
  </button>
);

const Modal = ({
  children,
  show,
  handleClose,
  header,
  footer,
  size = "md",
}: {
  children: JSX.Element | JSX.Element[];
  show?: boolean;
  handleClose: () => void;
  header?: JSX.Element;
  footer?: JSX.Element;
  size?: "lg" | "md";
}) => {
  const hidden = !show;
  return (
    <div
      tabIndex={-1}
      aria-hidden={!show}
      className={`${clsx(
        { hidden: hidden },
        "bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 mx-auto w-full md:inset-0 h-modal md:h-full z-50"
      )}`}
    >
      <div
        className={`mx-auto relative p-4 w-full max-w-${size} h-full md:h-auto`}
      >
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          {header && (
            <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
              {header}
            </div>
          )}
          <CloseButton handleClose={handleClose} />
          {/* <!-- Modal body --> */}
          <div className="p-6">{children}</div>
          {/* <!-- Modal footer --> */}
          {footer && (
            <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
