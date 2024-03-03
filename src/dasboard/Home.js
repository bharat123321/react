import React, { useState } from 'react';
import Auth from '../navbar_design/Auth'
function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`image${index}`, file);
    });

    try {
      const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Images uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <>
        <Auth />
      <h2>Multiple Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} multiple />
        <button type="submit">Upload</button>
      </form>
      {selectedFiles.length > 0 && (
        <div>
          <h3>Selected Files:</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Home;
