import React from 'react';
import { Modal } from 'react-bootstrap';

const CustomModal = ({ show, handleClose, selectedEvent }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedEvent}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add form content here */}
      </Modal.Body>
      <Modal.Footer>
        <button variant="secondary" onClick={handleClose}>Close</button>
        <button variant="primary">Save Changes</button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
