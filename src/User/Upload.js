import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import Mammoth from "mammoth";
import { read, utils } from "xlsx";
import PptxGenJS from "pptxgenjs";
import jsPDF from "jspdf";
import { Document, Page, pdfjs } from "react-pdf";

// Setting the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function Upload() {
  const [documents, setDocuments] = useState([]);
  const [docData, setDocData] = useState({});
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    const validDocuments = [];
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "application/pdf", // PDF
    ];

    Array.from(files).forEach((file) => {
      if (validTypes.includes(file.type)) {
        validDocuments.push(file);
      } else {
        toast.error("Please upload only DOCX, PPTX, XLSX, or PDF files.");
      }
    });

    setDocuments((prevDocs) => [...prevDocs, ...validDocuments]);

    for (let i = 0; i < validDocuments.length; i++) {
      try {
        const file = validDocuments[i];
        console.log(`Processing file: ${file.name}`);

        if (file.size === 0) {
          toast.error(`The file ${file.name} is empty.`);
          continue;
        }

        let pdfBlob;
        if (file.type === "application/pdf") {
          pdfBlob = file; // Already a PDF
        } else {
          pdfBlob = await convertToPDF(file); // Convert other files to PDF
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
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "docx") {
      return await convertDocxToPDF(file);
    }

    if (fileExtension === "xlsx") {
      return convertXlsxToPDF(file);
    }

    if (fileExtension === "pptx") {
      return convertPptxToPDF(file);
    }

    return null;
  };

  const convertDocxToPDF = async (file) => {
    toast.info(`Converting ${file.name} to PDF...`);
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const result = await Mammoth.extractRawText({ arrayBuffer });
        const pdfDoc = new jsPDF();
        pdfDoc.text(result.value, 10, 10);
        pdfDoc.save(`${file.name.split(".")[0]}.pdf`);
        resolve(pdfDoc.output("blob"));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const convertXlsxToPDF = (file) => {
    toast.info(`Converting ${file.name} to PDF...`);
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csvData = utils.sheet_to_csv(worksheet);

        const pdfDoc = new jsPDF();
        pdfDoc.text(csvData, 10, 10);
        resolve(pdfDoc.output("blob"));
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  };

  const convertPptxToPDF = (file) => {
    toast.info(`Converting ${file.name} to PDF...`);
    return new Promise((resolve, reject) => {
      const ppt = new PptxGenJS();
      const pdfDoc = new jsPDF();
      ppt.load(file, function (data) {
        pdfDoc.text(data.slides, 10, 10);
        resolve(pdfDoc.output("blob"));
      });
    });
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
      const previews = [];

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
            const pdfPartUrl = URL.createObjectURL(blob);
            previews.push(pdfPartUrl);
            pdfParts.push(blob);
          } else {
            toast.error(`Failed to render page ${i}.`);
          }
        });
      }

      setPdfPreviews((prevPreviews) => [...prevPreviews, ...previews]);

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
    const doc = documents[index];
    const downloadLink = URL.createObjectURL(doc);
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
          accept=".docx, .pptx, .xlsx, .pdf"
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
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <h5>{doc.name}</h5>
          <div className="form-group">
            <label htmlFor={`title-${index}`}>Title</label>
            <input
              type="text"
              className="form-control"
              id={`title-${index}`}
              value={docData[index]?.title || ""}
              onChange={(e) => handleFieldChange(index, "title", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`description-${index}`}>Description</label>
            <textarea
              className="form-control"
              id={`description-${index}`}
              rows="3"
              value={docData[index]?.description || ""}
              onChange={(e) =>
                handleFieldChange(index, "description", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor={`category-${index}`}>Category</label>
            <input
              type="text"
              className="form-control"
              id={`category-${index}`}
              value={docData[index]?.category || ""}
              onChange={(e) =>
                handleFieldChange(index, "category", e.target.value)
              }
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => handleSubmit(index)}
            style={{ marginRight: "10px" }}
          >
            Submit Part {index + 1}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleRemove(index)}
          >
            Remove Part {index + 1}
          </button>

          {pdfPreviews[index] && (
            <div style={{ marginTop: "20px" }}>
              <Document file={pdfPreviews[index]}>
                <Page pageNumber={1} />
              </Document>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Upload;
