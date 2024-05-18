import React, { useState } from 'react';
import AuthUser from '../component/AuthUser';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Userdetail = () => {
  const [selectedFileCounts, setSelectedFileCounts] = useState({
    file: 0,
    image: 0,
    video: 0
  });
  const [selectedprofile, setSelectedProfile] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [message, setMessage] = useState('');
  const { http } = AuthUser();
  
  const handleImage = (event) => {
    const filesArray = Array.from(event.target.files); // Convert FileList to array
    setSelectedProfile(filesArray);
    setSelectedFile(filesArray[0].name);

  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
      console.log(selectedFile);  
    if (selectedprofile.length === 0) {
    setMessage('No images selected.');
    return;
  } 
  const data = {selectedFile:selectedFile};
     const formData = new FormData();

   selectedprofile.forEach((image) => {
  formData.append('images[]', image);
});
     
    try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const token = localStorage.getItem('token');
    http.post('/profilepic',formData,{
  headers: {
    'Content-Type': 'multipart/form-data',
    'X-CSRF-TOKEN': csrfToken
  }
}).then((res) => {
    console.log(res.data.message);
    setMessage(res.data.message);
  }).catch((error) => {
    console.log(error.response.data.message);
   if(error.response)
        {
         if(error.response.status === 422){
       setMessage(error.response.data.message);
         }
         if(error.response.status === 500){ 
           setMessage(error.response.message);
           
         }
        }
   
  });
    
  } catch (error) {
   
    console.error('Error uploading images:', error);
  }
   
  }

  return (
    <>
      <Form>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="form-row" style={{textAlign:"center"}}>
                <label htmlFor="fileInput" className="custom-file-label">
                  <h4 className="uploadProfile">Upload Profile</h4>
                </label><br />
                <input type="file" id="fileInput" onChange={(e) => { handleImage(e) }} 
                  style={{ display: 'none' }} />
                {selectedprofile.map((item, index) => (
                  <div key={index}>
                    <h4>{item.name}</h4>
                  </div>
                ))}
                {message && <p>{message}</p>}
                <Button variant="primary" onClick={handleSubmit}>Upload</Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}

export default Userdetail;
