import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set PDF.js worker script URL
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.js';

function ImagePreview({ file, removeFile }) {
  if (!file) return null; // Ensure file exists before rendering

  const isPdf = file.type === 'application/pdf';
  
  return (
    <div className="image-preview" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
      {isPdf ? (
        <Document file={URL.createObjectURL(file)} onLoadError={console.error}>
          <Page
            pageNumber={1}
            width={100} // Adjust width as needed
            renderMode="canvas" // Ensure it's rendered on canvas
            style={{ borderRadius: '4px' }}
          />
        </Document>
      ) : (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )}
      <FaTimes
        onClick={() => removeFile(file)}
        style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', color: 'red' }}
      />
    </div>
  );
}

export default ImagePreview;
