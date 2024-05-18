import { useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Stream from './Stream';
import Assignment from './Assignment';
import AuthUser from '../component/AuthUser';

function JoinComponent() {
    const { subjectname } = useParams();
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(100);
    const [userData, setUserData] = useState([]);
    const [activeButton, setActiveButton] = useState('stream'); // Default active button to 'stream'
    const { http } = AuthUser();

    useEffect(() => {
        fetchData(subjectname); // Fetch data when component mounts or subjectname changes
    }, [subjectname]);

    const fetchData = (code) => {
        setLoading(true); // Set loading to true when fetching data
        http.get('/fetchupload/' + code)
            .then((res) => {
                const data = res.data.checks;
                setUserData(data);
                setLoading(false);
                setProgress(100);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
                setProgress(100);
            });
    }

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    return (
        <div>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {!loading &&
                <>
                    <hr />
                    <Navbar bg="white" data-bs-theme="dark">
                        <Container>
                            <Nav className="me-auto">
                                <button
                                    onClick={() => handleButtonClick('stream')}
                                    className={`btn btn-outline-dark mr-3 ${activeButton === 'stream' ? 'active' : ''}`}>
                                    Stream
                                </button>
                                <div className="mx-2"></div>
                                <button
                                    onClick={() => handleButtonClick('Assign')}
                                    className={`btn btn-outline-dark mr-3 ${activeButton === 'Assign' ? 'active' : ''}`}>
                                    Assignment
                                </button>
                            </Nav>
                        </Container>
                    </Navbar>
                    <hr />
                    {activeButton === 'stream' && <Stream code={subjectname} />}
                    {activeButton === 'Assign' && <Assignment />}
                </>
            }
        </div>
    );
}

export default JoinComponent;
