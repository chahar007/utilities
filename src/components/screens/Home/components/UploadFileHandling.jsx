import React, { useState } from "react";
import styles from "./UploadFileHandling.module.scss";

const UploadFileHandling = ({ onFileUpload, acceptedFormats = ["image/*"] }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file) => {
    if (file) {
      onFileUpload(file); // Pass file data to parent
    }
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatAcceptString = () => {
    if (acceptedFormats.includes("*")) return "any file";
    return acceptedFormats.map(f => f.split('/')[0]).join(", ");
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          className={styles.uploadInput}
          accept={acceptedFormats.join(",")}
          onChange={(e) => handleFileUpload(e.target.files[0])}
          id="uploadFile"
        />
        <div className={styles.uploadContent}>
          <i className={`fas fa-cloud-upload-alt ${styles.uploadIcon}`}></i>
          <h3 className={styles.uploadText}>Drag & drop your file here</h3>
          <p className={styles.uploadSubtext}>or</p>
          <label className={styles.uploadLink} htmlFor="uploadFile">
            <i className="fas fa-file-alt fa-icon"></i> Browse files
          </label>
        </div>
      </div>
      <div className={styles.fileTypes}>
        {acceptedFormats.map((format, index) => (
          <span key={index} className={styles.fileType}>
            {format.split('/')[0].toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UploadFileHandling;