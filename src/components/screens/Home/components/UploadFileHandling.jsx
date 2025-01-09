import React, { useState } from "react";
import styles from "./UploadFileHandling.module.scss";

const UploadFileHandling = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file) => {
    onFileUpload(file); // Pass file data to parent
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
      onDrop={handleFileDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        className={styles.uploadInput}
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        id="uploadImage"
      />
      <label className={styles.uploadLink} htmlFor="uploadImage">
        Drag and drop an image or <span>Browse</span>
      </label>
    </div>
  );
};

export default UploadFileHandling;
