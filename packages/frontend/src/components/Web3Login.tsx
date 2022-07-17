import { useCallback, useState } from "react";
import clsx from "clsx";
import { WalletConnectIcon, MetamaskIcon } from "./Icons";
import { useAccount, useConnect, useEnsName, useEnsAvatar } from "wagmi";

const Web3LoginModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  //   const { data: account } = useAccount();
  const { connect, connectors, error, pendingConnector } = useConnect();

  return (
    <div
      id="crypto-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${clsx(
        { hidden: !show },
        "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
      )}`}
    >
      <div className="relative p-4 w-full max-w-md h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          {/* <!-- Modal header --> */}
          <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
              Connect wallet
            </h3>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6">
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Connect with one of our available wallet providers or create a new
              one.
            </p>
            <ul className="my-4 space-y-3">
              {connectors.map((connector) => (
                <li key={connector.id}>
                  <a
                    href="#"
                    className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    // @ts-ignore
                    disabled={!connector.ready}
                    onClick={(e) => {
                      e.preventDefault();
                      connect({ connector });
                    }}
                  >
                    {connector.name === "MetaMask" && (
                      <>
                        <MetamaskIcon />
                        <span className="flex-1 ml-3 whitespace-nowrap">
                          MetaMask
                        </span>
                        <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                          Popular
                        </span>
                      </>
                    )}
                    {connector.name === "WalletConnect" && (
                      <>
                        <WalletConnectIcon />
                        <span className="flex-1 ml-3 whitespace-nowrap">
                          WalletConnect
                        </span>
                      </>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginButton = () => {
  const [modalOpened, setModalOpened] = useState(false);

  const handleOpenModel = useCallback(() => {
    setModalOpened(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpened(false);
  }, []);

  return (
    <>
      <button
        type="button"
        data-modal-toggle="crypto-modal"
        className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        onClick={handleOpenModel}
      >
        <svg
          aria-hidden="true"
          className="mr-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          ></path>
        </svg>
        Connect wallet
      </button>
      {<Web3LoginModal show={modalOpened} handleClose={handleClose} />}
    </>
  );
};

const Web3Profile = ({ address }: { address: string }) => {
  const { data, isError, isLoading } = useEnsName({
    address,
  });
  const { data: avatarData } = useEnsAvatar({
    addressOrName: address,
  });

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return (
    <>
      <div className="text-sm">
        @{data} {avatarData}
      </div>
      <div className="text-xs font-light w-20 truncate hover:text-clip">
        {address}
      </div>
    </>
  );
};

const Web3Login = () => {
  const { connector: activeConnector, isConnected, address } = useAccount();

  return (
    <>
      {isConnected && address && (
        <div>
          <Web3Profile address={address} />
        </div>
      )}
      {!isConnected && <LoginButton />}
    </>
  );
};

export default Web3Login;
