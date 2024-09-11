import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import { pdfjs } from 'react-pdf';

// Manually set the workerSrc to the specific version
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function Upload() {
  const [documents, setDocuments] = useState([]);
  const [docData, setDocData] = useState({});
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const validDocuments = [];
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/pdf",
    ];

    Array.from(files).forEach((file) => {
      if (validTypes.includes(file.type)) {
        validDocuments.push(file);
      } else {
        toast.error("Please upload only DOCX, PPTX, or PDF files.");
      }
    });

    setDocuments((prevDocs) => [...prevDocs, ...validDocuments]);

    for (let i = 0; i < validDocuments.length; i++) {
      try {
        const file = validDocuments[i];
        console.log(`Processing file: ${file.name}`);

        // Check file size before conversion
        if (file.size === 0) {
          toast.error(`The file ${file.name} is empty.`);
          continue;
        }

        let pdfBlob;
        if (file.type === "application/pdf") {
          pdfBlob = file;
        } else {
          pdfBlob = await convertToPDF(file); // Conversion logic here
        }

        console.log(`Converted PDF size for ${file.name}: ${pdfBlob.size}`);

        if (pdfBlob.size === 0) {
          toast.error(`The converted PDF for ${file.name} is empty.`);
          continue;
        }

        const pdfParts = await splitPDF(pdfBlob);
        const newDocData = createDocumentData(pdfParts);
        setDocData((prev) => ({ ...prev, ...newDocData }));
      } catch (error) {
        toast.error(`Failed to process ${validDocuments[i].name}`);
        console.error("Processing Error:", error);
      }
    }
  };

  const convertToPDF = async (file) => {
    // Implement actual conversion logic here
    toast.info(`Converting ${file.name} to PDF...`);
    const pdfBlob = new Blob(); // Placeholder - Replace with actual conversion logic
    return pdfBlob;
  };

  const splitPDF = async (pdfBlob) => {
    const pdfBytes = await pdfBlob.arrayBuffer();
    if (pdfBytes.byteLength === 0) {
      throw new Error("PDF file is empty.");
    }

    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;
      const pdfParts = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        canvas.toBlob((blob) => {
          if (blob) {
            pdfParts.push(blob);
          } else {
            toast.error(`Failed to render page ${i}.`);
          }
        });
      }

      return pdfParts;
    } catch (error) {
      console.error("Error loading PDF:", error);
      throw error;
    }
  };

  const createDocumentData = (pdfParts) => {
    const newDocData = {};
    pdfParts.forEach((_, index) => {
      newDocData[index] = { title: "", description: "", category: "" };
    });
    return newDocData;
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleFieldChange = (index, field, value) => {
    setDocData((prevData) => ({
      ...prevData,
      [index]: {
        ...prevData[index],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (index) => {
    const { title, description, category } = docData[index];
    if (title && description && category) {
      toast.success(`Document part ${index + 1} submitted.`);
      // Handle form submission here, like sending data to server
    } else {
      toast.error("Please fill out all fields before submitting.");
    }
  };

  const handleRemove = (index) => {
    // Trigger download before removal
    const doc = documents[index];
    const downloadLink = URL.createObjectURL(doc);
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Remove after download
    setDocuments((prevDocs) => prevDocs.filter((_, i) => i !== index));
    setDocData((prevData) => {
      const newDocData = { ...prevData };
      delete newDocData[index];
      return newDocData;
    });
  };

  return (
    <div style={{ width: "80%", margin: "110px", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div
        style={{
          border: "2px dashed #ccc",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="file"
          accept=".docx, .pptx, .pdf"
          multiple
          onChange={handleInputChange}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        <button
          className="btn btn-success"
          style={{ padding: "10px 40px", marginBottom: "10px" }}
          onClick={openFileDialog}
        >
          <b>Upload Document</b>
        </button>
        <br />
        <span>or drag and drop files here</span>
      </div>

      {documents.map((doc, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <button
            onClick={() => handleRemove(index)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          <h5>Document Part {index + 1}</h5>
          <embed src={URL.createObjectURL(doc)} width="100%" height="200px" />

          <div style={{ marginTop: "20px" }}>
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={docData[index]?.title || ""}
              onChange={(e) => handleFieldChange(index, "title", e.target.value)}
            />

            <label style={{ marginTop: "10px" }}>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={docData[index]?.description || ""}
              onChange={(e) => handleFieldChange(index, "description", e.target.value)}
            />

            <label style={{ marginTop: "10px" }}>Category</label>
            <input
              type="text"
              className="form-control"
              value={docData[index]?.category || ""}
              onChange={(e) => handleFieldChange(index, "category", e.target.value)}
            />

            <button
              className="btn btn-primary"
              style={{ marginTop: "10px" }}
              onClick={() => handleSubmit(index)}
            >
              Submit
            </button>
          </div>

          <hr style={{ marginTop: "30px" }} />
        </div>
      ))}

      {documents.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-secondary"
            style={{ marginTop: "20px" }}
            onClick={openFileDialog}
          >
            <b>Add More Documents</b>
          </button>
        </div>
      )}
    </div>
  );
}

export default Upload;
