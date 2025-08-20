import React, { useState } from "react";
import styles from "./UploadFileHandling.module.scss";

const UploadFileHandling = ({ 
  onFileUpload, 
  acceptedFormats = ["image/*"], 
  multiple = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle File Upload
  const handleFileUpload = (files) => {
    if (!files.length) return;

    if (multiple) {
      onFileUpload(Array.from(files)); // Send array of files for multi-upload
    } else {
      onFileUpload(files[0]); // Send single file for single upload
    }
  };

  // Handle Drag & Drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
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
          onChange={(e) => handleFileUpload(e.target.files)}
          id="uploadFile"
          multiple={multiple}
        />
        <div className={styles.uploadContent}>
          <i className={`fas fa-cloud-upload-alt ${styles.uploadIcon}`}></i>
          <h3 className={styles.uploadText}>
            {isDragging ? "Drop your files here" : "Drag & drop your file(s) here"}
          </h3>
          <p className={styles.uploadSubtext}>or</p>
          <label className={styles.uploadLink} htmlFor="uploadFile">
            <i className="fas fa-folder-open fa-icon"></i> 
            Choose Files
          </label>
        </div>
      </div>
      <div className={styles.fileTypes}>
        {acceptedFormats.map((format, index) => (
          <span key={index} className={styles.fileType}>
            {format.split("/")[0].toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UploadFileHandling;
