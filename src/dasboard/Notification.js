import React, { useState } from 'react';
import axios from 'axios';
import AuthUser from '../component/AuthUser';
const Notification = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const {http} = AuthUser();
const handleImageChange = (e) => {
  setSelectedImages(Array.from(e.target.files));
};


   const handleSubmit = async (e) => {
  e.preventDefault();
 
  const formData = new FormData();
  selectedImages.forEach((image, index) => {
    formData.append(`images${index}`, image);
  });
 console.log(Array.from(formData));
  // Log FormData object to the console
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}:`, value);
  // }
  try {
    const token = localStorage.getItem('token');
    http.post('/upload',formData,{
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}).then((res) => {
    console.log(res.data.message);
  }).catch((error) => {
 
    console.error('Error uploading images:', error.message);
  });
    
  } catch (error) {
   
    console.error('Error uploading images:', error);
  }
};



  return (
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleImageChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default Notification;
