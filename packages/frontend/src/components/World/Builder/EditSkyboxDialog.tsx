/* eslint-disable jsx-a11y/alt-text */
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import {
  FileReference,
  Optional,
  SceneFilesLocal,
} from "../../../types/shared";
import Modal, { ModalHeader3 } from "../../Shared/Modal";

const EditSkyboxDialog = ({
  setNewSkybox,
  skyboxFile,
  files,
  handleClose,
}: {
  setNewSkybox: ({ file }: { file: File }) => void;
  skyboxFile: Optional<FileReference> | undefined;
  files: SceneFilesLocal;
  handleClose: () => void;
}) => {
  const fileUrl = useHttpsUrl(skyboxFile, files);
  const onDropAccepted = useCallback((files: File[]) => {
    if (files.length === 0) return;
  
    setNewSkybox({file: files[0]});
  }, [setNewSkybox]);

  const {getRootProps, getInputProps} = useDropzone({
    onDropAccepted,
    accept: {
    //   "image/png": [".png"],
    //   "image/jpg": [".jpg", ".jpeg"],
      "image/hdr": [".hdr", ".pic"]
    },
    multiple: false
  });

  return (
    <Modal
      size="md"
      header={<ModalHeader3 text="Change Scene Skybox/Environment Map" />}
      handleClose={handleClose}
    show
    >
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a skybox file here (must be an .hdr or .pic file), or click to select file</p>
      </div>
    </Modal>
  );
};

export default EditSkyboxDialog;
