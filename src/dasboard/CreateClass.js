import React, { useState, useRef } from 'react';
import { Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import AuthUser from '../component/AuthUser';

function CreateClass() {
    const { http } = AuthUser();
    const [generatedCode, setGeneratedCode] = useState(generateRandomCode(10));
    const [userCode, setUserCode] = useState('');
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [videos, setVideos] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [subjectname, setSubjectname] = useState("");
    const inputRef = useRef();
    const [copied, setCopied] = useState(false);

    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomCode = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomCode += characters[randomIndex];
        }
        return randomCode;
    }

    function handleUserCodeChange(event) {
        setUserCode(event.target.value);
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const fileList = Array.from(event.dataTransfer.files);
        categorizeFiles(fileList);
    };

    const handleClassimage = (event) => {
        const fileList = Array.from(event.target.files);
        categorizeFiles(fileList);
    };

    const categorizeFiles = (fileList) => {
        const imageFiles = [];
        const otherFiles = [];
        const videoFiles = [];

        fileList.forEach(file => {
            if (file.type.startsWith('image/')) {
                imageFiles.push(file);
            } else if (file.type.startsWith('video/')) {
                videoFiles.push(file);
            } else {
                otherFiles.push(file);
            }
        });

        setImages(prev => [...prev, ...imageFiles]);
        setFiles(prev => [...prev, ...otherFiles]);
        setVideos(prev => [...prev, ...videoFiles]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const uploadFiles = async (fileType, files) => {
            const formData = new FormData();
            files.forEach(file => {
                formData.append(`${fileType}[]`, file);
            });
            formData.append('userCode', userCode);
            formData.append('filestypes', fileType);
            formData.append('subjectname', subjectname);

            return http.post(`/classcode/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken
                }
            });
        };

        try {
            if (images.length) await uploadFiles('images', images);
            if (files.length) await uploadFiles('files', files);
            if (videos.length) await uploadFiles('videos', videos);

            setShowAlert(true);
            setImages([]);
            setFiles([]);
            setVideos([]);
        } catch (error) {
            console.error('Error uploading files:', error);
            setShowAlert(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <>
            <Card style={{ margin: '130px 10% 0px' }}>
                <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link as={Link} className="btn btn-outline-white mr-3" to="/create" style={{ cursor: 'pointer' }}><h3>Create Class</h3></Link>
                        <Link as={Link} to="/join" className="btn btn-outline-dark mr-3" style={{ cursor: 'pointer' }}>Join Class</Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        Generated Code: {generatedCode}
                        <img src="./image/nextimage.jpg" onClick={() => setGeneratedCode(generateRandomCode(10))} style={{ cursor: 'pointer', marginLeft: '20px', width: '20px' }} />
                        <Button variant="outline-secondary" size="sm" onClick={copyToClipboard} style={{ marginLeft: '10px' }}>
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Enter Code</InputGroup.Text>
                                <Form.Control
                                    aria-label="Enter Code"
                                    value={userCode}
                                    onChange={handleUserCodeChange}
                                    required
                                />
                            </InputGroup>
                            <label htmlFor="subjectname">Subject Name</label>
                            <input
                                type="text"
                                placeholder="Write Subject Name"
                                className="form-control"
                                value={subjectname}
                                onChange={(e) => setSubjectname(e.target.value)}
                                required
                            />
                        </div>
                        <br />
                        <div className="dragdrop" onDragOver={handleDragOver} onDrop={handleDrop}>
                            <h2 className="text-reset">Drag and Drop Files to Upload</h2>
                            <h1>Or</h1>
                            <input type='file' onChange={handleClassimage} multiple hidden ref={inputRef} />
                            <button type="button" onClick={() => inputRef.current.click()}>Select Files</button>
                            {images.length > 0 && <p>Selected Images: {images.length}</p>}
                            {files.length > 0 && <p>Selected Files: {files.length}</p>}
                            {videos.length > 0 && <p>Selected Videos: {videos.length}</p>}
                        </div>
                        <br />
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                    {showAlert ? (
                        <Alert variant="success" className="mt-3">Code entered correctly!</Alert>
                    ) : (
                        <Alert variant="danger" className="mt-3">The entered code does not match the generated code. Please try again</Alert>
                    )}
                </Card.Body>
                <Card.Footer className="text-muted">
                    Don't Share This Code With Unknown Users (Used For Educational Purposes Only)
                </Card.Footer>
            </Card>
        </>
    );
}

export default CreateClass;
