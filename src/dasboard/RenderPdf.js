import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import axios from 'axios';

function RenderPdf({ url }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
    }

    return (
        <div style={{marginLeft:'-15px',overflow:'auto'}}>
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
                        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
                    </Document>
                </>
            )}
        </div>
    );
}

export default RenderPdf;
