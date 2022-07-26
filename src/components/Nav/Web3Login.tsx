import { useCallback, useState } from "react";
import { WalletConnectIcon, MetamaskIcon } from "../Shared/Icons";
import { useConnect, useEnsName, useEnsAvatar } from "wagmi";
import Modal, { ModalHeader3 } from "../Shared/Modal";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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

const Web3Login = () => {
  return <ConnectButton showBalance={false} />;
};

export default Web3Login;
