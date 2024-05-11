import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import AuthUser from '../component/AuthUser';
import { Modal } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate,Navigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import LazyLoad from 'react-lazy-load';
function CustomModal({ show, onHide }) {

   const navigate = useNavigate();
    const joinclass=()=>{
       navigate('/join');
       onHide();
            }
    const createclass=()=>{ 
      navigate('/create');
      onHide();
     
    }
    const onHides=()=>{
      onHide();
    }
  return (
    <Modal show={show} onHide={onHide} backdrop="static">
  <Modal.Body>Select Class</Modal.Body>
  <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button variant="primary" onClick={joinclass}>Join Class</Button>
      <Button variant="success" onClick={createclass}>Create Class</Button>
    </div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button variant="secondary" onClick={onHides}> Close</Button>
    </div>
  </Modal.Footer>
</Modal>
 );
}

function ChangeableMovement({ event, show, setShow }) {
  const [selectedFileCounts, setSelectedFileCounts] = useState({
    file: 0,
    image: 0,
    video: 0
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
 const [visible, setVisible] = useState(false); 
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [checkname,setCheckname]=useState("");
  const [message, setMessage] = useState('');
   const [accessToken, setAccessToken] = useState('');
   const[InputErrorList,setInputErrorList] = useState({});
   const {http} = AuthUser();
  const handleClose = () => {
    setShow(false);
    window.location.href="/home";
  }
const handleImageChange = (e,fileType) => {
    const selectedImages = Array.from(e.target.files);
     setCheckname(fileType);
    setImages(selectedImages);

  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
   console.log('Selected files:', images);
  if (images.length === 0) {
    setMessage('No images selected.');
    return;
  }
  const formData = new FormData();
   if(checkname =="image"){
 images.forEach((image) => {
  formData.append('images[]', image);

});
   }
   if(checkname =="file")
   {
      console.log(checkname);
       images.forEach((image) => {
  formData.append('files[]', image);
});
   }
  if(checkname =="video")
   {
      console.log(checkname);
       images.forEach((image) => {
  formData.append('video[]', image);
});
   }
  formData.append('description', description);
  formData.append('visible', visible.toString());
  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const token = localStorage.getItem('token');
    http.post('/upload',formData,{
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
};



   

  const handleFileChange = (event, fileType) => {
    const files = event.target.files;

    const fileCounts = {
      file: 0,
      image: 0,
      video: 0
    };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (fileType === 'image' && file.type.startsWith('image/')) {
        fileCounts.image++;
      } else if (fileType === 'video' && file.type.startsWith('video/')) {
        fileCounts.video++;
      } else if (fileType === 'file') {
        fileCounts.file++;
      }
    }

    setSelectedFileCounts(fileCounts);
    setSelectedFiles(files);
    setSelectedFile(files[0]);
  };

  return (
    <Modal show={show}>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Select: {event}
          <Form.Group controlId="custom-switch" className="d-flex justify-content-end">
            <Form.Label><b>Visibility:</b></Form.Label>
            <span className="mr-1">Public</span>
            <Form.Check
              type="switch"
              id="custom-switch"
               checked={visible}
              onChange={(e)=>setVisible(e.target.checked)}
              label=""
            />
            <span className="ml-1">Private</span>
          </Form.Group>
          </div>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Write Something about ${event}`} />
          <span className="text-danger">{InputErrorList.description}</span> 
          <label htmlFor="fileInput" className="custom-file-label">
            {event === 'File' ? (
              selectedFile
                ? `${selectedFile.name} (${selectedFileCounts.file} selected)`
                : `Choose a File (${selectedFileCounts.file} selected)`
            ) : ''}
            {event === 'Image' ? (
              selectedFile
                ? `${selectedFile.name} (${selectedFileCounts.image} selected)`
                : `Choose an Image (${selectedFileCounts.image} selected)`
            ) : ''}
            {event === 'Video' ? (
              selectedFile
                ? `${selectedFile.name} (${selectedFileCounts.video} selected)`
                : `Choose a Video (${selectedFileCounts.video} selected)`
            ) : ''}
          </label>
           <input
            type="file"
            id="fileInput"
            onChange={(e) =>{handleFileChange(e, event.toLowerCase());handleImageChange(e,event.toLowerCase());}}
            multiple
            style={{ display: 'none' }}
          />
          <span className="text-danger">{InputErrorList.file}</span> 

         
        </Modal.Body>

        {message && <p>{message}</p>}
        <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="primary" type="submit">Submit</Button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </div>
        </Modal.Footer>
      
      </Form>
    </Modal>
  );
}

function Auth() {
     const navigate = useNavigate();
   const { logout } = AuthUser();
  const [show, setShow] = useState(false);
  const [showclass, setClass] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [check,setCheck] = useState(false);
  const[storedata,setStoredata]=useState([]);
 const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
   const [progress, setProgress] = useState(0);
    const {http} = AuthUser();
  const handleClose = () =>{
    setShow(false);
    setClass(false);
  }

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setShow(true);
  };

  const handleFile = (event) => {
    event.preventDefault();
    setSelectedEvent('File');
    setShow(true);
  }

  const handleImage = (event) => {
    event.preventDefault();
    setSelectedEvent('Image');
    setShow(true);
  }

  const handleVideo = (event) => {
    event.preventDefault();
    setSelectedEvent('Video');
    setShow(true);
  }

  const handleClass = () =>{
    setSelectedEvent('Class');
    setClass(true);
  }

  const logoutUser = () => {
    logout();
  }
   
 useEffect(()=>{
  fetchuserdata();
},[]);
 useEffect(()=>{
   userverify();
},[]);
useEffect(() => {
        if (progress === 100) {
            setLoading(false); // Progress completed, set loading to false
        }
    }, [progress]);
const userverify =()=>{
  http.get("/userverify").then((res)=>{
    console.log(res.data.status);
     setProgress(40);
     if(res.data.status===200)
     {
      
      setAuthenticated(true);
     }
      setProgress(100)
  }).catch((error)=>{
      if(error.response.status===401)
    {
      setAuthenticated(false);
      logout();
    }
  })
}
const fetchuserdata=()=>{
   http.get("/fetchUser").then((res)=>{
    
    if(res.data.check=='')
    {
       setCheck(false);
       console.log('empty')
    }
    else
    {
       const userData = res.data;
                let hasId = false;
                 setStoredata(res.data.check);
                setCheck(true);
    }
    
   }).catch(function(event){
    
   })
}
const navigateToSubject = (subjectname) => {
      
        navigate(`/${subjectname}`);
    }
    
 
  return (
    <>

     <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {!loading && 
      <>
      {['sm'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <img src="./image/book.jpg" width="50px" height="50px" style={{ borderRadius: '50%' }} />
            <Navbar.Brand as={Link} to="/">Notes Sharing</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>Notes Sharing</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
              <Nav className="mr-3 flex-grow-1 pe-3">
              <Nav.Link as={Link} to="/home" className="nav-link">Home</Nav.Link>
              <hr className="dropdown-divider" />
              <NavDropdown 
                title="Upload" 
                id={`offcanvasNavbarDropdown-expand-${expand}`}>
                <NavDropdown.Item as={Link} to="/file" onClick={handleFile}>File</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/image" onClick={handleImage}>Image</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/video" onClick={handleVideo}>Video</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/notification" className="nav-link">Notification</Nav.Link>
             

                 {check && <NavDropdown title="ClassNote" >

                                        {storedata.map((item, index) => (
                                <NavDropdown.Item key={index} onClick={() => navigateToSubject(item.subjectname)}>
                            {item.subjectname}
                        </NavDropdown.Item>          ))}
                                    </NavDropdown>
                                }
                                            
                                          
                </Nav>
                <Nav className="justify-content-end">
                  <NavDropdown title="Setting" id={`offcanvasNavbarDropdown-expand-${expand}`} align={{ sm: 'end' }}>
                    <NavDropdown.Item as={Link} to='/profile'>Your Profile</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action4">Your Project</NavDropdown.Item>
                    <NavDropdown.Divider />
                     <NavDropdown.Item onClick={handleClass}>Join or Create Class</NavDropdown.Item>
                    <NavDropdown.Divider />
                   
                     <NavDropdown.Item as={Link} to="/results">Results</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/Logout" onClick={logoutUser}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      
      </>
    }
     <ChangeableMovement event={selectedEvent} show={show} setShow={setShow} handleEventSelection={handleEventSelection} />
     
      <CustomModal show={showclass} onHide={handleClose} />
    </>
  );
}

export default Auth;
