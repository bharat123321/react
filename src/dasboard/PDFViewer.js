import React from 'react';
import { Document, Page } from 'react-pdf';

function PDFViewer({ pdfUrl }) {
  console.log(pdfUrl);
  return (
    <div>
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default PDFViewer;
