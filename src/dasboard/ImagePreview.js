import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set PDF.js worker script URL with matching version
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

function ImagePreview({ file, removeFile }) {
  // Ensure file exists before executing effect
  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!file) return null; // Early return if no file

  const isPdf = file.type === 'application/pdf';

  return (
    <div className="image-preview" style={{ position: 'relative', display: 'inline-block', margin: '10px' }}>
      {isPdf ? (
        <Document
          file={URL.createObjectURL(file)}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
        >
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
