import React, { useState,useEffect,useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link ,useLocation} from 'react-router-dom';
import AuthUser from '../component/AuthUser';
import { Modal } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate,Navigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormControl, InputGroup, ListGroup, Button as BsButton } from 'react-bootstrap';
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
  const [check, setCheck] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isNotificationClicked, setIsNotificationClicked] = useState(false);
  const [isUploadClicked, setIsUploadClicked] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchResultsRef = useRef(null); 
  const [user,setUser]=useState([]);
  const handleSearchToggle = () => {
    setSearchVisible(true);
     
      setSearchTerm("");
      setSearchResults([]);
    
  };

  const handleSearchClose = () => {
    setSearchVisible(false);
    
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    console.log(term);
   if (term) {
      try {
        const response = http.get(`/search?q=${term}`, {
          params: { term }
        }).then((res)=>{
          setSearchResults(res.data.resultdata);
          console.log(res.data.resultdata);
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
        } else {
      setSearchResults([]);
    }
  };

  const handleClose = () => {
    setShow(false);
    setShowClass(false);
  }

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    setShow(true);
  }

  const handleClass = () => {
    setSelectedEvent('Class');
    setShowClass(true);
  }

  const logoutUser = () => {
    logout();
  }

  const handleClick = (icon) => {
    if (icon === 'home') {
      setIsHomeClicked(true);
      setIsNotificationClicked(false);
      setIsUploadClicked(false);
    } else if (icon === 'notification') {
      setIsHomeClicked(false);
      setIsNotificationClicked(true);
      setIsUploadClicked(false);
    } else if (icon === 'upload') {
      setIsHomeClicked(false);
      setIsNotificationClicked(false);
      setIsUploadClicked(true);
    }
  }

  
  useEffect(() => {
    if (progress === 100) {
      setLoading(false); // Progress completed, set loading to false
    }
  }, [progress]);

 useEffect(()=>{
  userVerify();
  fetchUserData();
 },[])

  const userVerify = () => {
   const response =  http.get("/userverify").then((res) => {
      setProgress(40);
      if (res.data.status === 200) {
        setUser(res.data.user);
        setAuthenticated(true);
      }
      setProgress(100)
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        setAuthenticated(false);
       logout();
        
    } else {
        console.error("Error verifying user:", error);
    }
    })
  }

  


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                if (window.scrollY > lastScrollY) {
                    setNavbarVisible(false);
                } else {
                    setNavbarVisible(true);
                }
            } else {
                setNavbarVisible(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    
    const fetchUserData = () => {
      console.log('Fetching user data...');
      http.get("/fetchUser")
          .then((res) => {
              console.log('User data response:', res.data);
              if (res.data.check === '') {
                  setCheck(false);
              } else {
                  setStoreData(res.data.check);
                  setCheck(true);
              }
          })
          .catch((error) => {
              console.error('Error fetching user data:', error);
              if (error.response && error.response.status === 401) {
                  
              }
          });
  }
  

  const navigateToSubject = (subjectName) => {
    navigate(`/${subjectName}`);
  }

  // Function to handle search submission
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      navigate(`/searched/${searchTerm}`); // Navigate to the search page with query
    }
  };

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
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {!loading && (
        <>
          {['sm'].map((expand) => (
            <Navbar key={expand} expand={expand} style={{ display: navbarVisible ? 'block' : 'none' }}  className={`bg-body-tertiary mb-3 ${navbarVisible ? 'navbar-visible' : 'navbar-hidden'}`} 
              fixed="top">
              <Container fluid>
                <img src="./image/book.jpg" width="50px" height="50px" style={{ borderRadius: '50%' }} />
                <Navbar.Brand as={Link} to="/">GFN</Navbar.Brand>
                 
                <Form
              role="search"
              className="d-flex me-auto search-wrapper"
              onSubmit={(e) => e.preventDefault()} 
            >
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <Form.Control
                type="search"
                placeholder="Search Topic"
                aria-label="Search"
                className="me-2 search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearch}
              />
            </Form>
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
                      <Nav.Link as={Link} to="/home" className="nav-link" onClick={() => handleClick('home')}>
                        <img src={isHomeClicked ? "./image/whitehome.png" : "./homelogo.png"} width="50px" height="50px" alt="Home" />
                      <br/>
                        {isHomeClicked && <div>Home</div>}
                      </Nav.Link>

                      {/* <Nav.Link as={Link} to="/notification" className="nav-link" onClick={() => handleClick('notification')}>
                        <img src={isNotificationClicked ? "./image/whitenotification.png" : "./image/blacknotification.png"} width="50px" height="50px" alt="Notification" />
                        {isNotificationClicked && <p>Notification</p>}
                      </Nav.Link> */}

                      <Nav.Link as={Link} to="/book" className="nav-link" onClick={() => handleClick('upload')}>
                       
                        <FontAwesomeIcon icon={faBook} style={{ width: "50px", height: "50px", margin: "5px", cursor: "pointer" }} />
                        {isUploadClicked && <div>Book</div>}
                      </Nav.Link>

                      {check && (
                        <NavDropdown title={
                          <img src="./image/classnote.png" width="50px" height="50px" />
                        }>
                          {storeData.map((item, index) => (
                            <NavDropdown.Item key={index} onClick={() => navigateToSubject(item.class_code)}>
                              {item.subjectname}
                            </NavDropdown.Item>
                          ))}
                        </NavDropdown>
                      )}
                    </Nav>
                 
                    <Nav className="justify-content-end">
                      <NavDropdown title={<i className="bi bi-gear bi-2x" style={{ fontSize: '40px' }}></i>} id={`offcanvasNavbarDropdown-expand-${expand}`} align={{ sm: 'end' }} noCaret>
                        <NavDropdown.Item as={Link} to='/profile'>
                        
                      
                       {user.avatar ? (
                         <img 
                           src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000/avatar/${user.avatar}`} 
                           width="30px" 
                           height="30px" 
                           style={{ marginLeft:"-10px", borderRadius: '50%' }} 
                           alt="User Profile"
                         />
                       ) : (
                         <img 
                           src="./image/book.jpg" 
                           width="30px" 
                           height="30px" 
                           style={{ float: "left", borderRadius: '50%' }} 
                           alt="User Profile"
                         />
                       )}
                         Your Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleClass}>Join or Create Class</NavDropdown.Item>
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
      )}
       
      <ChangeableMovement event={selectedEvent} show={show} setShow={setShow} handleEventSelection={handleEventSelection} />
      <CustomModal show={showClass} onHide={handleClose} />
    </>
  );
}

export default Auth;