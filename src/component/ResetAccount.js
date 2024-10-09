import React, { useState } from 'react';
import { Button, Form, Alert, Spinner, Card, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Correct import
import AuthUser from './AuthUser';
import './ResetAccount.css';

function ResetAccount() {
    const navigate = useNavigate(); // Correctly initialize navigate
    const { http } = AuthUser();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('');

    const handleFindAccount = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setShowToast(false);

        try {
            const response = await http.post('/find-account', { email });
            if (response.data.status === 200) {
                setToastMessage('Successfully found the account');
                setToastVariant('success');
                setShowToast(true);
                navigate(`/resetpassword/${email}`);  
                setEmail('');  
            }
            if (response.data.status === 404) {
                setToastMessage(response.data.message);
                setToastVariant('danger');
                setShowToast(true);
            }
        } catch (error) {
            if (error.response) {
                setToastMessage(error.response.data.error || 'An error occurred');
                setToastVariant('danger');
                setShowToast(true);
            } else {
                setToastMessage('Network error, please try again');
                setToastVariant('danger');
                setShowToast(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Card className="mt-4 custom-card w-100">
                        <Card.Header className="text-center">
                            <h4 className="heading">Find Your Account</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleFindAccount}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                {error && <Alert variant="danger">{error}</Alert>}

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" />
                                            <span className="ms-2">Processing...</span>
                                        </>
                                    ) : (
                                        'Find Account'
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Toast Notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body style={{ color: "white" }}>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default ResetAccount;
