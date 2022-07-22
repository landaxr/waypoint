import { useCallback, useState } from "react";
import { WalletConnectIcon, MetamaskIcon } from "../Shared/Icons";
import { useAccount, useConnect, useEnsName, useEnsAvatar } from "wagmi";
import Modal, { ModalHeader3 } from "../Shared/Modal";

const Web3LoginModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  //   const { data: account } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <Modal
      handleClose={handleClose}
      show={show}
      header={<ModalHeader3 text="Connect wallet" />}
    >
      <>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Connect with one of our available wallet providers or create a new
          one.
        </p>
        <ul className="my-4 space-y-3">
          {connectors.map((connector) => (
            <li key={connector.id}>
              <button
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
              </button>
            </li>
          ))}
        </ul>
      </>
    </Modal>
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
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
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
  // @ts-ignore
  const { data, isError, isLoading } = useEnsName({
    address,
  });
  // @ts-ignore
  const { data: avatarData } = useEnsAvatar({
    addressOrName: address,
  });

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return (
    <>
      <div className="text-sm text-black dark:text-white">
        @{data} {avatarData}
      </div>
      <div className="text-xs text-black dark:text-white font-light w-20 truncate hover:text-clip">
        {address}
      </div>
    </>
  );
};

const Web3Login = () => {
  const { isConnected, address } = useAccount();

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
