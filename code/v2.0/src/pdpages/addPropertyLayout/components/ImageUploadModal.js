import React from "react";
import Modal from "react-bootstrap/Modal";
import { BarLoader } from "react-spinners";

const ImageUploadModal = ({ status }) => {
  const getModalConfig = () => {
    switch (status) {
      case "uploading":
        return {
          message: "Uploading...",
          color: "var(--theme-green2)"
        };
      case "deleting":
        return {
          message: "Deleting...",
          color: "var(--theme-red)"
        };
      default:
        return {
          message: "",
          color: "var(--theme-blue)"
        };
    }
  };

  const config = getModalConfig();

  return (
    <Modal show={status !== null} centered className="uploading_modal">
      <h6 style={{ color: config.color }}>{config.message}</h6>
      <BarLoader color={config.color} loading={true} height={10} />
    </Modal>
  );
};

export default ImageUploadModal;    