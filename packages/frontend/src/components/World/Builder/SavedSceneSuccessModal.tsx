import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../Shared/Modal";

const SavedSceneSuccessModal = ({ savedCid }: { savedCid?: string }) => {
  const [closed, setClosed] = useState(false);

  const handleClose = useCallback(() => {
    setClosed(true);
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
      size={"lg"}
    >
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        ipfs address:&nbsp;
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a
          href={`//ipfs.io://ipfs/${savedCid}`}
          target={"_blank"}
        >{`ipfs.io://${savedCid}`}</a>
      </p>
      <p className="text-sm font-normal">
        <Link to={`/worlds/ipfs/${savedCid}`}>Load scene from IPFS</Link>
      </p>
    </Modal>
  );
};

export default SavedSceneSuccessModal;
