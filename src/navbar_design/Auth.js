import React, { useState,useEffect,useRef } from 'react';
import Button from 'react-bootstrap/Button'; 
import { Modal } from "react-bootstrap";
import { Navbar, Nav, Container, Form, Offcanvas, ListGroup } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faHome, faUpload } from '@fortawesome/free-solid-svg-icons';
import LoadingBar from 'react-top-loading-bar';
import AdminNavbar from './AdminNavbar';
import DistributorNavbar from './DistributorNavbar';
import UserNavbar from './User_navbar';
import AuthUser from '../component/AuthUser';
import { FormControl, InputGroup, Button as BsButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
 
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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, http } = AuthUser();
const [show, setShow] = useState(false);
  const [showClass, setShowClass] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [userRole, setUserRole] = useState('');
  const searchResultsRef = useRef(null);
  const [user, setUser] = useState([]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      http.get(`/search?q=${term}`).then((res) => {
        setSearchResults(res.data.resultdata);
      }).catch((error) => console.error("Error fetching search results:", error));
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/searched/${searchTerm}`);
    }
  };
   const handleClose = () => {
    setShow(false);
    setShowClass(false);
  }
  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setSearchTerm('');
    setSearchResults([]);
  };
  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setShow(true);
  }

    const handleClass = () => {
      setSelectedEvent('Class');
      setShowClass(true);
    }
  const userVerify = async () => {
    setProgress(40);
    try {
      const res = await http.get("/userverify");
      setUser(res.data.user);
      const roleId = parseInt(res.data.user.roles_id);
      setUserRole(roleId === 1 ? "Admin" : roleId === 2 ? "Distributor" : "User");
      setProgress(100);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      setProgress(100);
    }
  };

  useEffect(() => {
    userVerify();
  }, []);

   // Function to handle clicks outside the search results
  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside of search results
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      {['sm'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-light shadow-sm mb-3" fixed="top">
          <Container fluid>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
              <img src="./image/book.jpg" width="50px" height="50px" className="rounded-circle me-2" alt="Logo" />
              <span>GFN</span>
            </Navbar.Brand>

            <Form className="d-flex me-auto" onSubmit={(e) => e.preventDefault()}>
              <FontAwesomeIcon icon={faSearch} className="me-2" onClick={handleSearchToggle} />
              {searchVisible && (
                <Form.Control
                  type="search"
                  placeholder="Search Topic"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchSubmit}
                />
              )}
            </Form>

            <Nav className="ms-auto">
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
              <Navbar.Offcanvas id={`offcanvasNavbar-expand-${expand}`} placement="start">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Notes Sharing</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  {userRole === 'Admin' && <AdminNavbar />}
                  {userRole === 'Distributor' && <DistributorNavbar />}
                  {userRole === 'User' && <UserNavbar />}
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Nav>
          </Container>

          {searchResults.length > 0 && (
            <ListGroup className="search-results" ref={searchResultsRef}>
              {searchResults.map((result, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => navigate(`/searched/${result.topic}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{result.topic}</strong>
                  <br />
                  {result.description}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Navbar>
      ))}
      <ChangeableMovement event={selectedEvent} show={show} setShow={setShow} handleEventSelection={handleEventSelection} />
      <CustomModal show={showClass} onHide={handleClose} />
    </>
  );
}

export default Auth;