/* eslint-disable jsx-a11y/alt-text */
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
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
  const onDropAccepted = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      setNewSkybox({ file: files[0] });
      handleClose();
    },
    [setNewSkybox, handleClose]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    accept: {
      //   "image/png": [".png"],
      //   "image/jpg": [".jpg", ".jpeg"],
      "image/hdr": [".hdr", ".pic"],
    },
    multiple: false,
  });

  return (
    <Modal
      size="md"
      header={<ModalHeader3 text="Scene Skybox &amp; Environment Map" />}
      handleClose={handleClose}
      show
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} id="dropzone-file" />
        <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 space-y-6">
        <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col justify-center items-center pt-5 pb-6">
            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload a Skybox File</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">.pic or .hdr file types accepted</p>
        </div>
    </label> 
        </div>
      </div>
    </Modal>
  );
};

export default EditSkyboxDialog;
