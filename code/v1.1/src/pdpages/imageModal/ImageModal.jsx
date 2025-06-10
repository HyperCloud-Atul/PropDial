import React from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({ show, handleClose, imageUrl }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Image Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <img src={imageUrl} alt="Full Size" className="img-fluid" />
            </Modal.Body>
        </Modal>
    );
};

export default ImageModal;
