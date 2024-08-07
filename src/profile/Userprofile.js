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

function Userprofile() {
    const [closeprofile, setCloseprofile] = useState(true);
    const [show, setShow] = useState(false);
    const [activeButton, setActiveButton] = useState(''); // State to track active button
    const { http } = AuthUser();
    const [userData, setUserData] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const navigate = useNavigate();

    const handleButtonClick = (buttonName) => {
        setShow(true);
        setCloseprofile(false);
        setActiveButton(buttonName); // Set the active button when clicked
        setSelectedSubject(null);
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

            <Card className="col-md-12">
                <Card.Header>Your File</Card.Header>
                {Array.isArray(userData) && userData.length > 0 ? (
                    userData.map((item, index) => {
                        const fileUrl = `http://127.0.0.1:8000/api/files/${item.file}`;
                        console.log('Constructed file URL:', fileUrl);
                        return (
                            <Card border="dark" key={index} className="col-md-4">
                                <div className="pdf-preview">
                                    <Pagepdf url={fileUrl} />
                                    <p className="designPdf">PDF</p>
                                </div>
                                <Card.Body>
                                    <div>
                                        <Card.Title>{item.category}</Card.Title>
                                        <Card.Title>{item.file}</Card.Title>
                                        <Card.Text className="nav-link text-left" as={Link} to={`/viewdetail/${item.id}`}>
                                            <b style={{ fontSize: "12px" }}>Added By {item.firstname} ...</b>
                                        </Card.Text>
                                    </div>
                                    <Button variant="primary" onClick={() => handleDownload(item.id)}>Download</Button>
                                </Card.Body>
                            </Card>
                        );
                    })
                ) : (
                    <p>No data available</p>
                )}
            </Card>

            {activeButton === 'userDetail' && <Userdetail />}
            {activeButton === 'bookmark' && <BookMark />}
        </>
    );
}

export default Userprofile;
