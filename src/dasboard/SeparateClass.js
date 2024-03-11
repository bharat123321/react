import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

function CustomModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body>You launched the modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function SeparateClass() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
       
            <Button variant="primary" onClick={handleShow}>
              Primary
            </Button>
          
           
           

      <CustomModal show={show} onHide={handleClose} />
    </div>
  );
}
