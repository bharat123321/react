import React, { useState } from 'react';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import AuthUser from './AuthUser';
import './ResetPassword.css'; // Add custom styling as needed

const ResetPassword = () => {
    const { email } = useParams();
    const navigate = useNavigate(); // Use navigate hook for redirection
    const { http } = AuthUser();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [method, setMethod] = useState('email'); // State for selecting reset method

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // Handle the logic based on selected method
        if (method === 'email') {
             try {
        const response = await http.post('/sendcode', { email });
        if (response.data.status === 200) {
                       navigate(`/security-code/${email}`); 
        } else {
            setError('Failed to send code. Please try again.');
        }
    } catch (error) {
        setError('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    }
        } else if (method === 'password') {
            // Redirect to login page
            navigate('/login');
        }
    };

// Call this function when the user selects "Send code via email"


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Card className="mt-4">
                        <Card.Header className="text-center">
                            <h4>Reset Your Password</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <Form.Check
                                        type="radio"
                                        label={`Send code via email (${email})`}
                                        name="resetMethod"
                                        id="sendCode"
                                        checked={'email'}
                                        onChange={() => setMethod('email')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Enter password to log in"
                                        name="resetMethod"
                                        id="enterPassword"
                                        checked={method === 'password'}
                                        onChange={() => setMethod('password')}
                                    />
                                </div>
 

                                {error && <Alert variant="danger">{error}</Alert>}
                                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Processing...' : 'Continue'}
                                </Button>
                            </Form>
 
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
