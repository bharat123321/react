import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Userdetail from '../profile/Userdetail';
import AuthUser from '../component/AuthUser';
import LoadingBar from 'react-top-loading-bar';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookMark from '../profile/BookMark';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Pagepdf from '../dasboard/Pagepdf';
import '../dasboard/Book.js';
function Userprofile() {
    const [closeprofile, setCloseprofile] = useState(true);
    const [show, setShow] = useState(false);
    const [activeButton, setActiveButton] = useState(''); // State to track active button
    const { http } = AuthUser();
    const [userData, setUserData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState(false);
    const navigate = useNavigate();

    const handleButtonClick = (buttonName) => {
        setShow(true);
        setCloseprofile(false);
        setActiveButton(buttonName); // Set the active button when clicked
        setSelectedSubject(false);
    };

    useEffect(() => {
        fetchData();
        fetchUserFile();
    }, []);

    const fetchData = () => {
        setProgress(30);
        // http.get('/fetchcreateddata')
        //     .then((res) => {
        //         const data = res.data.fetchdata || []; // Default to an empty array if undefined
        //         console.log('Fetched data:', data);
        //         setUserData(data);
        //         setLoading(false);
        //         setProgress(100);
        //     })
        //     .catch((error) => {
        //         console.error("Error fetching data:", error);
        //         setLoading(false);
        //         setProgress(100);
        //     });
    };

    const fetchUserFile = () => {
        setProgress(30);
        http.get('/fetchuserfile')
            .then((res) => {
                const files = res.data.data || []; // Default to an empty array if undefined
                console.log('Fetched user files:', files);
                setUserData(files);
                setLoading(false);
                setProgress(100);
                setSelectedSubject(true);
            })
            .catch((error) => {
                console.error("Error fetching user files:", error);
                setLoading(false);
                setProgress(100);
            });
    };

    const handleSubjectSelect = (subjectName) => {
        setSelectedSubject(subjectName);
        setActiveButton(null);
    };

    const handleDownload = (id) => {
        // Implement download functionality here
        console.log('Download file with id:', id);
    };

    return (
        <>
            <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
            <hr />
            <Navbar bg="white" data-bs-theme="dark" style={{ marginTop: "120px" }}>
                <Container>
                    <Nav className="me-auto">
                        <button
                            onClick={() => handleButtonClick('bookmark')}
                            className={`btn btn-outline-dark ${activeButton === 'bookmark' ? 'active' : ''}`}
                        >
                            BookMark
                        </button>
                        <div className="mx-2"></div>
                        <button
                            onClick={() => handleButtonClick('userDetail')}
                            className={`btn btn-outline-dark ${activeButton === 'userDetail' ? 'active' : ''}`}
                        >
                            Profile Update
                        </button>
                    </Nav>
                </Container>
            </Navbar>
            <hr />
     {selectedSubject && (
  <Card className="col-md-12">
    <Card.Header>Your File</Card.Header>
    {Array.isArray(userData) && userData.length > 0 ? (
      <div className="d-flex flex-wrap"> {/* Use flexbox to align cards horizontally */}
        {userData.map((item, index) => {
          const fileUrl = `http://127.0.0.1:8000/api/files/${item.file}`;
          return (
            <div className="col-md-4 mb-4" key={item.id}> {/* Added mb-4 for margin between cards */}
              <Card className="h-100 shadow-sm d-flex flex-row"> {/* Added flex-row for horizontal layout */}
                <div className="d-flex align-items-center p-3">
                  {/* PDF preview section */}
                  <div className="pdf-preview" style={{ cursor: 'pointer', width: '120px', height: '120px' }}>
                    <Pagepdf url={fileUrl} />
                    <p className="designPdf"style={{color:"white"}}>PDF</p>
                  </div>
                </div>
                <Card.Body>
                  <div>
                    <Card.Title>{item.category}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{item.file}</Card.Subtitle>
                    <Card.Text className="nav-link text-left" as={Link} to={`/viewdetail/${item.id}`}>
                      <b style={{ fontSize: "12px" }}>Added By {item.firstname} ...</b>
                    </Card.Text>
                  </div>
                  <Button variant="primary" onClick={() => handleDownload(item.id)}>Download</Button>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    ) : (
      <p>No data available</p>
    )}
  </Card>
)}

            {activeButton === 'userDetail' && <Userdetail />}
            {activeButton === 'bookmark' && <BookMark />}
        </>
    );
}

export default Userprofile;
