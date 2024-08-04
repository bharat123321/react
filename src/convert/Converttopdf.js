import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthUser from '../component/AuthUser'; // Ensure the path is correct

const ConvertToPdf = () => {
    const [pdfUrls, setPdfUrls] = useState([]); // Ensure it is initialized as an empty array
    const { id } = useParams();
    const { http } = AuthUser();

    const generatePdf = async () => {
        try {
            // Get the CSRF token from the meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Ensure axios request includes the CSRF token if necessary
            const response = await http.post(`/convertimgtopdf/${id}`, {}, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            console.log(response.data.pdf_url); // Ensure this matches the structure of your response

            // Check if response.data.pdf_urls is an array
            if (Array.isArray(response.data.pdf_urls)) {
                setPdfUrls(response.data.pdf_urls);
            } else {
                console.error('PDF URLs response is not an array:', response.data.pdf_urls);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div>
            <button onClick={generatePdf}>Generate PDF</button>
            
            {pdfUrls.map((url, index) => (
                <div key={index}>
                    <iframe title={`pdf-viewer-${index}`} src={url} width="100%" height="500px" />
                </div>
            ))}
        </div>
    );
};

export default ConvertToPdf;
