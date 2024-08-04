import React, { useState, useEffect } from 'react';
import AuthUser from '../component/AuthUser';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBar from 'react-top-loading-bar';
import Carousel from 'react-bootstrap/Carousel';
import { BiDotsVertical } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas, faLock } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; // Import Modal
import { Link } from 'react-router-dom';
import RenderPdf from '../dasboard/RenderPdf';
import axios from 'axios'; // Import Axios or your preferred HTTP client

const MyFile = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for showing confirmation modal
    const [postToDelete, setPostToDelete] = useState(null); // State to store post ID to be deleted
    const { http } = AuthUser();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Initialize openDropdowns array with false values for each user
        setOpenDropdowns(new Array(userData.length).fill(false));
    }, [userData]);

    const fetchData = () => {
        setProgress(30); // Start loading progress
        http.get('/fetchalldata')
            .then((res) => {
                const data = res.data.data;
                setUserData(data);
                setProgress(70); // Intermediate loading progress
                setLoading(false);
                setProgress(100); // Complete loading progress
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
                setProgress(100); // Complete loading progress
            });
    }

    const handleDropDown = (index) => {
        const updatedDropdowns = [...openDropdowns];
        updatedDropdowns[index] = !updatedDropdowns[index];
        setOpenDropdowns(updatedDropdowns);
    }

    const updatePrivacy = (id) => {
        http.put(`/images/${id}/privacy`)
            .then(res => {
                console.log(res.data.message);
                // Implement any necessary UI updates or state changes after successful update
            })
            .catch(error => {
                console.error("Error updating privacy:", error);
                // Handle errors or display error messages as needed
            });
    }

    const deletePost = () => {
        if (postToDelete) {
            http.delete(`images/${postToDelete}`)
                .then(res => {
                    console.log(res.data.message);
                    // Implement any necessary UI updates or state changes after successful deletion
                })
                .catch(error => {
                    console.error("Error deleting post:", error);
                    // Handle errors or display error messages as needed
                });
        }
        // Close modal after delete or cancel
        setShowConfirmModal(false);
        setPostToDelete(null); // Reset postToDelete state
    }

    const handleDeleteClick = (id) => {
        setPostToDelete(id); // Set post ID to delete
        setShowConfirmModal(true); // Show confirmation modal
    }

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deletePost}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {!loading ? (
                userData.length > 0 ? (
                    <div style={{ margin: '0px 10%' }}>
                        {userData.map((item, index) => (
                            <Card key={item.id} style={{ margin: "20px auto" }} className="col-md-8 col-md-offset-1">
                                <Card.Header style={{ display: 'flex', alignItems: 'center' }}>
                                    <Card.Img
                                        variant="bottom"
                                        src={`http://127.0.0.1:8000/avatar/${item.avatar}`}
                                        style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                                    />
                                    <div>
                                        <h4 style={{ margin: 0 }}>{`${item.firstname.charAt(0).toUpperCase()}${item.firstname.slice(1)} ${item.lastname}`}</h4>
                                        <h6 style={{ fontSize: "12px", color: "#888" }}>
                                            {item.visible === "true" ? (
                                                <FontAwesomeIcon icon={faLock} /> // Show lock icon for private posts
                                            ) : (
                                                <FontAwesomeIcon icon={faGlobeAmericas} /> // Show globe icon for public posts
                                            )}
                                            {' '}
                                            {item.formatted_date}
                                        </h6>
                                    </div>
                                    <div className="ml-auto">
                                        <Dropdown show={openDropdowns[index]} onToggle={() => handleDropDown(index)}>
                                            <Dropdown.Toggle variant="link" bsPrefix="p-2">
                                                <BiDotsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => updatePrivacy(item.id)}>Edit Privacy</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleDeleteClick(item.id)}>Delete Post</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <h3>{item.subjectname}</h3>
                                    {item.image && (
                                        <Carousel>
                                            {item.image.split(',').map((imageName, imageIndex) => (
                                                <Carousel.Item key={imageIndex}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={`http://127.0.0.1:8000/images/${imageName.trim()}`}
                                                        alt={`Image ${imageIndex}`}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}
                                    {item.file && (
                                        <RenderPdf url={`http://127.0.0.1:8000/api/files/${item.file}`} />
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}><h1>No data available</h1></div>
                )
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px' }}><h1>Loading...</h1></div>
            )}
        </>
    );
}

export default MyFile;
