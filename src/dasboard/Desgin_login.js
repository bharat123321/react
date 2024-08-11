import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
import { Modal, Spinner } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { BiDotsVertical } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import RenderPdf from './RenderPdf';
import Fetchpdf from './Fetchpdf';

const TemplateCard = () => (
    <Card style={{ margin: "auto" }} className="col-md-8 col-md-offset-1">
        <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: "5%", height: "5%", borderRadius: "50%", backgroundColor: "#ccc" }} />
            <h4 style={{ paddingLeft: "10px", backgroundColor: "#ccc", width: "50%" }}>&nbsp;</h4>
        </Card.Header>
        <hr />
        <Card.Body>
            <div style={{ width: "100%", height: "200px", backgroundColor: "#eee" }} />
            <br />
            <h6 style={{ backgroundColor: "#eee", width: "30%" }}>&nbsp;</h6>
            <h6 style={{ position: "absolute", right: "0px", bottom: "17px", backgroundColor: "#eee", width: "30%" }}>&nbsp;</h6>
        </Card.Body>
    </Card>
);

function Design_login() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [showFull, setShowFull] = useState(false);

    const toggleShowFull = () => setShowFull(!showFull);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://127.0.0.1:8000/api/fetchpublicdata', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
            .then((res) => {
                const data = res.data.data;
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

    const lookupWord = async (e) => {
        e.preventDefault();
        if (!word.trim()) {
            alert('Please enter a word.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/lookup/${word}`);
            setDefinition(res.data[0]?.meanings[0]?.definitions[0]?.definition || 'Definition not found');
        } catch (error) {
            setDefinition(error.response?.data?.message || 'Error fetching definition');
        }
        setIsLoading(false);
    };

    const handleUploadClick = () => setShowUploadOptions(!showUploadOptions);

    const handleEventSelection = (event) => {
        setSelectedEvent(event);
        setShow(true);
    };

    const handleFile = () => handleEventSelection('File');
    const handleImage = () => handleEventSelection('Image');
    const handleVideo = () => handleEventSelection('Video');

    const handleClose = () => setShow(false);
    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    return (
        <>
            <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />

            <div style={{ margin: '0px 10%' }}>
                {!loading ? userData.map((item, index) => {
                    const topic = item?.topic || '';
                    const truncatedText = topic.split(' ').slice(0, 3).join(' ');
                    const isLongDescription = topic.split(' ').length > 3;

                    return (
                        <React.Fragment key={index}>
                            <Card style={{ margin: "auto" }} className="col-md-8 col-md-offset-1">
                                <Card.Header style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Card.Img
                                            variant="bottom"
                                            src={`http://localhost:8000/avatar/${item.avatar}`}
                                            style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                                        />
                                        <div>
                                            <h4 style={{ margin: 0 }}>{item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)} {item.lastname}</h4>
                                            <h6 style={{ fontSize: "12px", color: "#888" }}><FontAwesomeIcon icon={faGlobeAmericas} /> {item.formatted_date}</h6>
                                        </div>
                                    </div>
                                    <div className="HiddenIcon" style={{ alignSelf: 'flex-end', marginTop: '10px' }}>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="link" bsPrefix="p-2">
                                                <BiDotsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item as={Link} to="/Login">Download</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Card.Header>
                                
                                <Card.Body>
                                    <h4>
                                        {showFull ? topic : `${truncatedText}${isLongDescription ? '...' : ''}`}
                                    </h4>
                                    {isLongDescription && (
                                        <a onClick={toggleShowFull} style={{ cursor: 'pointer', color: 'blue' }}>
                                            {showFull ? 'Show less' : 'Show more'}
                                        </a>
                                    )}

                                    <hr />
                                    
                                    {item.image && (
                                        <>
                                            <Carousel>
                                                {item.image.split(',').map((imageName, imageIndex) => (
                                                    <Carousel.Item key={imageIndex}>
                                                        <img
                                                            className="d-block w-100"
                                                            src={`http://localhost:8000/images/${imageName.trim()}`}
                                                            alt={`Image ${imageIndex}`}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                            <br />
                                            <h6>Viewed: 1223</h6>
                                            <h6 style={{ position: "absolute", right: "0px", bottom: "17px" }}>Downloaded: 1223</h6>
                                        </>
                                    )}

                                    {item.file && (
                                        <Fetchpdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                                    )}
                                </Card.Body>
                            </Card>
                            <br />
                        </React.Fragment>
                    );
                }) : (
                    Array.from({ length: 3 }).map((_, index) => (
                        <TemplateCard key={index} />
                    ))
                )}

                <Button variant="primary" onClick={handleModalOpen} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999' }}>
                    Lookup Word
                </Button>

                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Dictionary Lookup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={lookupWord}>
                            <Form.Group controlId="formWord">
                                <Form.Label>Enter Word</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter word"
                                    value={word}
                                    onChange={(e) => setWord(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? <Spinner animation="border" size="sm" /> : 'Search'}
                            </Button>
                        </Form>
                        {definition && (
                            <Card style={{ marginTop: '20px' }}>
                                <Card.Body>
                                    <strong>Definition:</strong> {definition}
                                </Card.Body>
                            </Card>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default Design_login;
