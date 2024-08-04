import React, { useState } from 'react';
import AuthUser from '../component/AuthUser';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Userdetail = () => {
  const [selectedFileCounts, setSelectedFileCounts] = useState({
    file: 0,
    image: 0,
    video: 0
  });
  const [selectedprofile, setSelectedProfile] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const { http } = AuthUser();
  
  const handleImage = (event) => {
    const filesArray = Array.from(event.target.files); // Convert FileList to array
    setSelectedProfile(filesArray);
    setSelectedFile(filesArray[0].name);
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true
    setMessage(''); // Clear any previous messages
    
    if (selectedprofile.length === 0) {
      setMessage('No images selected.');
      setLoading(false);
      return;
    } 

    const formData = new FormData();
    selectedprofile.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      await http.post('/profilepic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': csrfToken
        }
      }).then((res) => {
        setMessage(res.data.message);
        setLoading(false); // Set loading to false
      }).catch((error) => {
        if (error.response) {
          if (error.response.status === 422) {
            setMessage(error.response.data.message);
          } else if (error.response.status === 500) {
            setMessage(error.response.data.message);
          }
        } else {
          setMessage('An error occurred while uploading the images.');
        }
        setLoading(false); // Set loading to false
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage('An error occurred while uploading the images.');
      setLoading(false); // Set loading to false
    }
  }

  return (
    <>
      <Form>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="form-row" style={{ textAlign: "center" }}>
                <label htmlFor="fileInput" className="custom-file-label">
                  <h4 className="uploadProfile">Upload Profile</h4>
                </label><br />
                <input type="file" id="fileInput" onChange={handleImage} style={{ display: 'none' }} />
                {selectedprofile.map((item, index) => (
                  <div key={index}>
                    <h4>{item.name}</h4>
                  </div>
                ))}
                {message && <p>{message}</p>}
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export default Userdetail;
