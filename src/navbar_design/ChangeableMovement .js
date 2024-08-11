import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ChangeableMovement = ({ showClass, handleClose }) => {
  return (
    <Modal show={showClass} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Join or Create Class</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add join or create class content here */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary">Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeableMovement;
