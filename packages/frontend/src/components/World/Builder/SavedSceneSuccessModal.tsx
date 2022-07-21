import { SyntheticEvent, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../Shared/Modal";

const SavedSceneSuccessModal = ({ savedCid }: { savedCid?: string }) => {
  const [closed, setClosed] = useState(false);

  const handleClose = useCallback(() => {
    setClosed(true);
  }, []);

  const handleSelectText = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      // @ts-ignore
      e.target.select();
      e.stopPropagation();
    },
    []
  );

  const preventChange = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
  }, []);

  return (
    <Modal
      handleClose={handleClose}
      show={!closed}
      header={
        <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
          World Saved to IPFS
        </h3>
      }
      footer={
        <Link
          to={`/worlds/ipfs/${savedCid}`}
          className="text-white bg-red hover:bg-red-light focus:ring-4 focus:outline-none focus:ring-red-light font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Load world from IPFS
        </Link>
      }
      size={"lg"}
    >
      <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        <div>
          <label
            htmlFor="ipfsAddress"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            IFPS address:
          </label>
          <input
            type="text"
            name="ipfsAddress"
            id="ipfsAddress"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white cursor-text"
            // disabled
            value={`ipfs://${savedCid}`}
            onClick={handleSelectText}
            onChange={preventChange}
          />
        </div>
        <p></p>
      </div>
    </Modal>
  );
};

export default SavedSceneSuccessModal;
