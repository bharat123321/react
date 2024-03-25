import React, { useState } from 'react';
import Auth from '../navbar_design/Auth';
import { Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthUser from '../component/AuthUser';

function JoinClass() {
    const navigate = useNavigate(); // Use useNavigate hook to get navigate function
    const [userCode, setUserCode] = useState(''); // State to store the user's entered code
    const [showAlert, setShowAlert] = useState(false); // State to control the display of the alert
    const [showdata, setShowdata] = useState(null);
    const { http } = AuthUser();

    // Function to handle user input change
    function handleUserCodeChange(event) {
        setUserCode(event.target.value);
    }

    // Function to handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const data = { userCode: userCode };

        http.post("/joincode", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': csrfToken
            },
        }).then((res) => {
              
           // Check if res.data exists and contains id
        if (res.data && res.data[1].id !== undefined) {
            console.log("Success: Valid response data");
            setShowdata(res.data);
            // Redirect to /checkcode route
        } else {
            console.error('Invalid response data:', res.data);
            // Handle the case where id is missing from the response data
        }
        }).catch(function (err) {
            console.error('Error fetching code data:', err.response);
            // You might want to set some state here to indicate the error to the user
        });
    }

    return (
        <>
            <Card style={{ margin: '0px 10% 0px' }}>
                <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/join" className="btn btn-outline-white mr-3" style={{ cursor: 'pointer' }}><h3>Join Class</h3></Link>
                        <Link to="/create" className="btn btn-outline-dark mr-3" style={{ cursor: 'pointer' }}>Create Class</Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Enter Code</InputGroup.Text>
                            <Form.Control
                                aria-label="Enter Code"
                                value={userCode}
                                onChange={handleUserCodeChange}
                                required
                            />
                        </InputGroup>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                    {showAlert && (
                        <Alert variant="success" className="mt-3">
                            Connection successful
                        </Alert>
                    )}
                    {showdata && (
                        <Alert variant="success" className="mt-3">
                            <div>
                                <p>ID: {showdata[1].id}</p>
                                <p>Class Code: {showdata[1].class_code}</p>
                            </div>
                        </Alert>
                    )}
                </Card.Body>
                <Card.Footer className="text-muted">
                    Don't Share This Code With Unknown Users (Used For Educational Purposes Only)
                </Card.Footer>
            </Card>
        </>
    );
}

export default JoinClass;
