import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Userdetail from '../profile/Userdetail';
import Notes from '../profile/Notes';
import MyFile from '../profile/MyFile';
import Dropdown from 'react-bootstrap/Dropdown';
import AuthUser from '../component/AuthUser';
import LoadingBar from 'react-top-loading-bar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SelectedNotes from '../profile/SelectedNotes'; 
function Userprofile() {
    const [closeprofile, setCloseprofile] = useState(true);
    const [show, setShow] = useState(false);
    const [activeButton, setActiveButton] = useState(''); // State to track active button
    const { http } = AuthUser();
    const [userData, setUserData] = useState([]);
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
    }, []);

    const fetchData = () => {
        setProgress(30);
        http.get('/fetchcreateddata')
            .then((res) => {
                const data = res.data.fetchdata;
                console.log(res.data);
                setUserData(data);
                setLoading(false);
                setProgress(100);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
                setProgress(100);
            });
    };
      const handleSubjectSelect = (subjectName) => {
        setSelectedSubject(subjectName);
        setActiveButton(null);
    };

    return (
        <>
            <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress(0)} />
            <hr />
            <Navbar bg="white" data-bs-theme="dark" style={{marginTop:"120px"}}>
                <Container>
                    <Nav className="me-auto">
                        <Dropdown className="mr-3">
                            <Dropdown.Toggle variant="outline-dark">
                                List
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {userData.map((item, index) => (
                                    <NavDropdown.Item key={index} 
                                     className={`btn btn-outline-dark ${activeButton === 'Notes' ? 'active' : ''}`}
                                    onClick={() => handleSubjectSelect(item.class_code)}>
                                    {item.subjectname}
                                </NavDropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <button
                            onClick={() => handleButtonClick('Notes')}
                            className={`btn btn-outline-dark ${activeButton === 'Notes' ? 'active' : ''}`}>
                            Created Notes
                        </button>
                        <button
                            onClick={() => handleButtonClick('myfile')}
                            className={`btn btn-outline-dark ${activeButton === 'myfile' ? 'active' : ''}`}
                        >
                            My File
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

                                <div>
                {selectedSubject && (
                    <div>
                        {<SelectedNotes data={selectedSubject} />}
                    </div>
                )}
            </div>
            {activeButton === 'userDetail' && <Userdetail />}
            {activeButton === 'Notes' && <Notes />}
            {activeButton==='myfile'&&<MyFile/>}
        </>
    );
}

export default Userprofile;
