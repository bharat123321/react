import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import axios from 'axios';
 

function Pagepdf({ url }) {
    const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

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

    return (
        
        <div className="pdf-container">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <Document
                    file={fileData}
                    onLoadError={console.error}
                >
                    <Page 
                        pageNumber={1} 
                        width={150} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false} 
                        className="pdf-page"
                    />
                </Document>
            )}
        </div>
    );
}

export default Pagepdf;
