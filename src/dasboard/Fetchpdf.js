import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './Fetchpdf.css'; // Import the CSS file

function Fetchpdf({ url }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    console.log(url);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await axios.get(url, {
                    responseType: 'blob',
                });
                const file = new Blob([response.data], { type: 'application/pdf' });
                setFileData(file);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching PDF file:", error);
                setError("Error fetching PDF file. Please try again later.");
                setLoading(false);
            }
        };

        fetchPdf();
    }, [url]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function goToPrevPage() {
        setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    }

    function goToNextPage() {
        if (pageNumber >= 3) {
            setShowModal(true);
        } else {
            setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
        }
    }

    const handleClose = () => setShowModal(false);

    return (
        <div className="pdf-container">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <>
                    <div className="navigation">
                        <button onClick={goToPrevPage} disabled={pageNumber <= 1}>Previous</button>
                        <span>Page {pageNumber} of {numPages}</span>
                        <button onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</button>
                    </div>
                    <Document
                        file={fileData}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <div className={pageNumber > 3 ? 'blurred' : ''}>
                            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                        </div>
                    </Document>
                </>
            )}

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Fetchpdf;
