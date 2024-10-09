import React, { useState } from 'react';
import Mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';

const Imgtoword = () => {
  const [pdfData, setPdfData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    try {
      if (fileExtension === 'docx') {
        // Convert DOCX to PDF
        await convertDocxToPdf(file);
      } else if (fileExtension === 'pptx') {
        // Convert PPTX to PDF
        await convertPptxToPdf(file);
      } else if (fileExtension === 'pdf') {
        // Display PDF directly
        displayPdf(file);
      } else {
        setErrorMessage('Only DOCX, PPTX, and PDF files are supported.');
      }
    } catch (error) {
      setErrorMessage('Failed to process the file: ' + error.message);
    }
  };

  // DOCX to PDF Conversion
  const convertDocxToPdf = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await Mammoth.extractRawText({ arrayBuffer: reader.result });
        const doc = new jsPDF();
        
        // Split the text into lines to handle wrapping
        const lines = doc.splitTextToSize(result.value, 180); // 180mm width
        let y = 10; // Start at 10mm height

        // Add text line by line and create new pages if necessary
        for (let i = 0; i < lines.length; i++) {
          if (y > 280) { // Page height limit
            doc.addPage();
            y = 10; // Reset the vertical position
          }
          doc.text(lines[i], 10, y); // Add the line to PDF
          y += 10; // Increment y position for the next line
        }

        const pdfBlob = doc.output('blob');
        displayPdfBlob(pdfBlob);
      } catch (error) {
        setErrorMessage('Error converting DOCX: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // PPTX to PDF Conversion
  const convertPptxToPdf = async (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const pptx = new PptxGenJS();
      pptx.load(file).then(async (ppt) => {
        const doc = new jsPDF();

        // Iterate over each slide and convert it to an image
        for (let i = 0; i < ppt.slides.length; i++) {
          const slide = ppt.slides[i];
          const slideDataUrl = await slideToImage(slide); // Custom function to convert slide to image
          doc.addImage(slideDataUrl, 'PNG', 10, 10, 180, 100); // Add image to PDF
          if (i !== ppt.slides.length - 1) doc.addPage(); // Add new page for the next slide
        }

        const pdfBlob = doc.output('blob');
        displayPdfBlob(pdfBlob);
      }).catch(error => setErrorMessage('Error converting PPTX: ' + error.message));
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to convert a slide to an image (for pptx to pdf conversion)
  const slideToImage = async (slide) => {
    return new Promise((resolve) => {
      slide.exportAsDataURL((dataUrl) => {
        resolve(dataUrl);
      });
    });
  };

  // Display generated or uploaded PDF
  const displayPdfBlob = (pdfBlob) => {
    const url = URL.createObjectURL(pdfBlob);
    setPdfData(url);
  };

  // Display an existing PDF file
  const displayPdf = (file) => {
    const url = URL.createObjectURL(file);
    setPdfData(url);
  };

  return (
    <div>
      <h1>Upload DOCX, PPTX or PDF to Convert to PDF</h1>
      <input type="file" accept=".docx,.pptx,.pdf" onChange={handleFileUpload} />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {pdfData && (
        <div>
          <embed src={pdfData} type="application/pdf" width="100%" height="600px" />
          <a href={pdfData} download="converted.pdf">Download PDF</a>
        </div>
      )}
    </div>
  );
};

export default Imgtoword;
