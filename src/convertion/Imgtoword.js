import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";
import Tesseract from "tesseract.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function Imgtoword() {
  const [images, setImages] = useState([]);
  const [textResults, setTextResults] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  const [progress, setProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const validImages = [];
    const validTypes = ["image/jpeg", "image/png", "image/gif"];

    Array.from(files).forEach((file) => {
      if (validTypes.includes(file.type)) {
        validImages.push(file);
      } else {
        toast.error("Please upload only image files (jpeg, png, gif).");
      }
    });

    setImages([...images, ...validImages]);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newTextResults = { ...textResults };
    delete newTextResults[index];
    setTextResults(newTextResults);

    const newProgress = { ...progress };
    delete newProgress[index];
    setProgress(newProgress);
  };

  const convertImageToText = (image, index) => {
    Tesseract.recognize(image, selectedLanguage, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress((prevProgress) => ({
            ...prevProgress,
            [index]: m.progress,
          }));
        }
      },
    })
      .then(({ data: { text } }) => {
        setTextResults((prevResults) => ({
          ...prevResults,
          [index]: text,
        }));
        toast.success(`Text extracted from ${image.name}`);
      })
      .catch((err) => {
        toast.error(`Failed to extract text from ${image.name}: ${err.message}`);
      });
  };

  const downloadWordFile = (index) => {
    const text = textResults[index];
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({
            children: [
              new TextRun({
                text: text,
                break: 1
              })
            ]
          })],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${images[index].name.split('.').slice(0, -1).join('.')}.docx`);
    });
  };

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    };

    const handleGlobalDragOver = (e) => {
      e.preventDefault();
    };

    document.addEventListener("drop", handleGlobalDrop);
    document.addEventListener("dragover", handleGlobalDragOver);

    return () => {
      document.removeEventListener("drop", handleGlobalDrop);
      document.removeEventListener("dragover", handleGlobalDragOver);
    };
  }, []);

  return (
    <div style={{ width: "80%", margin: "0 auto", padding: "20px" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 style={{ textAlign: "center" }}>
        <b>Convert Image To Word</b>
      </h1>
      <p style={{ textAlign: "center", fontSize: "17px", color: "gray" }}>
        Converting an image to text using OCR involves extracting textual
        content from images.
      </p>
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
          accept="image/jpeg, image/png, image/gif"
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
          <b>Upload Image</b>
        </button>
        <br />
        <span>or drag and drop files here</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <FaTimes
              onClick={() => removeImage(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                cursor: "pointer",
                color: "red",
              }}
            />
            <p style={{ margin: "10px 0 0 0" }}>{image.name}</p>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ marginBottom: "10px" }}
            >
              <option value="eng">English</option>
              <option value="nep">Nepali</option>
              <option value="spa">Spanish</option>
              <option value="fra">French</option>
              <option value="deu">German</option>
              <option value="ita">Italian</option>
              {/* Add more languages as needed */}
            </select>
            <button
              className="btn btn-primary"
              style={{ marginTop: "10px" }}
              onClick={() => convertImageToText(image, index)}
            >
              Convert
            </button>
            {progress[index] && (
              <div
                style={{
                  marginTop: "10px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: `${progress[index] * 100}%`,
                    backgroundColor: "#76c7c0",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <span style={{ color: "white" }}>
                    {(progress[index] * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
            {textResults[index] && (
              <div style={{ marginTop: "10px", textAlign: "left" }}>
                <h5>Extracted Text:</h5>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {textResults[index]}
                </pre>
                <button
                  className="btn btn-secondary"
                  onClick={() => downloadWordFile(index)}
                >
                  Download Word
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="btn btn-secondary" onClick={openFileDialog}>
          Add More
        </button>
      </div>
    </div>
  );
}

export default Imgtoword;
