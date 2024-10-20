import React from "react";
import { Modal } from "react-bootstrap";

const ImageModal = ({ show, handleClose, imageUrl, imageModalTitle }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      centered
      className="my_modal margin_top"
    >
      <span class="material-symbols-outlined modal_close" onClick={handleClose}>
        close
      </span>
      <Modal.Body className="text-center">
        <h6 className="r16 r16-14-m lh22 mb-3">{imageModalTitle}</h6>
        {imageUrl && (
        <img src={imageUrl} alt="Full Size" className="img-fluid"    style={{
            objectFit: "contain",
            borderRadius: "5px",
          }}/>
    )}  
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;
