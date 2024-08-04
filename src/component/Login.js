import React, { useState,useEffect } from 'react';
import AuthUser from './AuthUser';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button, Modal, Spinner, Alert } from "react-bootstrap";
import LoadingBar from 'react-top-loading-bar';

function CustomModal({ show, onHide }) {
    const joinclass = () => {
        window.location.href = "/join";
    }
    const createclass = () => {
        window.location.href = "/create";
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
                    <Button variant="secondary" onClick={onHide}> Close</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

function Login() {
    const { http, setToken } = AuthUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inputErrorList, setInputErrorList] = useState('');
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleClose = () => {
        setShow(false);
        window.location.href = "/home";
    }

    const submitForm = (event) => {
        event.preventDefault();
        setLoading(true);
    
        const data = { email, password };
        http.post('/login', data).then((res) => {
            setProgress(50);
            console.log('Login successful:', res.data);
            setToken(res.data.user, res.data.access_token);
    
            setLoading(false);
    
            if (res.data.first_time_login === 1) {
                setShow(true);
            } else {
                window.location.href = '/home';
            }
            setProgress(100);
        }).catch((error) => {
            setLoading(false);
            setProgress(0);
            console.error('Login error:', error.response ? error.response.data : error);
            if (error.response) {
                if (error.response.status === 401) {
                    setInputErrorList(error.response.data.error);
                }
                if (error.response.status === 200) {
                    setInputErrorList(error.response.data.success);
                }
            }
        });
    }
    
    const responseGoogle = (response) => {
        console.log('Google OAuth response:', response);
        http.post('http://localhost:8000/api/auth/google/callback', {
            token: response.credential
        }).then((res) => {
            console.log('Google login successful:', res.data);
            setToken(res.data.user, res.data.access_token);
            window.location.href = '/home';
        }).catch((error) => {
            console.error('Google login error:', error);
        });
    };
    

    return (
        <>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Login</div>
                            <div className="card-body">
                                <form onSubmit={submitForm}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email address:</label>
                                        <input type="email" className="form-control" onChange={e => setEmail(e.target.value)} placeholder="Email" id="email" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="pwd">Password:</label>
                                        <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} placeholder="Password" id="pwd" required />
                                    </div>
                                    <div className="checkbox">
                                        <label> <input type="checkbox" className="incenter" /> Remember me</label>
                                    </div>
                                    {inputErrorList && <Alert variant="danger">{inputErrorList}</Alert>}
                                    <button className="btn btn-success" disabled={loading}>Submit</button>
                                    {loading && <Spinner animation="border" role="status" className="ml-2"><span className="sr-only"></span></Spinner>}
                                </form>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                
                            </div>  
                        </div>
                        <GoogleOAuthProvider clientId="1079841177125-ktlvgmunagi4du6sd0alcn6to9ouf877.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                            />
                        </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
            <CustomModal show={show} onHide={handleClose} />
        </>
    );
}

export default Login;
