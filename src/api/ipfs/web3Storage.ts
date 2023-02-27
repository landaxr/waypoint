import { Web3Storage } from "web3.storage";

const web3StorageKey = import.meta.env.VITE_APP_WEB3_STORAGE_KEY;

export const makeWeb3StorageClient = () => {
  if (!web3StorageKey)
    throw new Error(
      "VITE_APP_WEB3_STORAGE_KEY environment variable must be defined."
    );
  // @ts-ignore
  return new Web3Storage({ token: web3StorageKey });
};
