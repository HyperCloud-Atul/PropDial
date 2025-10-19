import Modal from "react-bootstrap/Modal";
import { BarLoader, ClipLoader } from "react-spinners";

const ImageActionModal = ({ imageActionStatus }) => (
  <Modal show={imageActionStatus !== null} centered className="uploading_modal">
    <h6 style={{
      color: imageActionStatus === "uploading" ? "var(--theme-green2)" :
        imageActionStatus === "deleting" ? "var(--theme-red)" :
          "var(--theme-blue)"
    }}>
      {imageActionStatus === "uploading" ? "Uploading..." : "Deleting..."}
    </h6>
    <BarLoader
      color={imageActionStatus === "uploading" ? "var(--theme-green2)" :
        imageActionStatus === "deleting" ? "var(--theme-red)" :
          "var(--theme-blue)"}
      loading={true}
      height={10}
    />
  </Modal>
);

export default ImageActionModal;