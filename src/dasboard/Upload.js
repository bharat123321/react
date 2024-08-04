import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import ImagePreview from './ImagePreview';
import AuthUser from '../component/AuthUser';

function Upload({ event, show, setShow }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { http } = AuthUser();
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    window.location.href = "/home";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setMessage('No files selected.');
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files[]', file);
    });
    formData.append('description', description);
    formData.append('topic', topic);
    formData.append('visible', visible.toString());
    formData.append('category', selectedCategory);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      setLoading(true);
      await http.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken
        }
      });
      setLoading(false);
      setMessage('Upload successful!');
    } catch (error) {
      setLoading(false);
      setMessage('Error uploading files.');
      console.error('Error uploading files:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files); // Debug log to check selected files
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Modal show={show}>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Select: {event}</span>
            <Form.Group controlId="custom-switch" className="d-flex justify-content-end">
              <Form.Label><b>Visibility:</b></Form.Label>
              <span className="mr-1">Public</span>
              <Form.Check
                type="switch"
                id="custom-switch"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                label=""
              />
              <span className="ml-1">Private</span>
            </Form.Group>
          </div>
          <Form.Control type="text" onChange={(e) => setTopic(e.target.value)} placeholder='Topic' />
          <br />
          <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option>Select Category</option>
            <option value="Education">Education</option>
            <option value="Engineering">Engineering</option>
            <option value="Science & Technology">Science & Technology</option>
            <option value="Food">Food</option>
            <option value="Law">Law</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Art and Photo">Art and Photo</option>
            <option value="Design">Design</option>
            <option value="Analytics">Analytics</option>
          </Form.Control>
          <br />
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Write Something about ${event}`}
          />
          <div
            className="drag-drop-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '10px', cursor: 'pointer' }}
          >
            <p>Drag and drop files here, or click to select files</p>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          {selectedFiles.map((file, index) => (
            <ImagePreview key={index} file={file} removeFile={() => removeFile(index)} />
          ))}
        </Modal.Body>
        {message && <p>{message}</p>}
        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              'Submit'
            )}
          </Button>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default Upload;
