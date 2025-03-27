import React, { useState } from "react";
import styles from "./EditMetadata.module.scss";
import { extractMetadata, updateMetadata } from "./useEditMetadata";
import UploadFileHandling from "../../Home/components/UploadFileHandling";
import { EditPDFMetadataHelmet } from "../../seo/PdfHelmet";

const EditMetadata = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({ title: "", author: "", keywords: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (event) => {
    const uploadedFile = event;
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsLoading(true);
    setIsSuccess(false);

    extractMetadata(uploadedFile)
      .then((data) => {
        setMetadata(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleMetadataChange = (field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateMetadata = async () => {
    if (!file) return;
  
    setIsLoading(true);
    setIsSuccess(false);
  
    try {
      const updatedPdfBlob = await updateMetadata(file, metadata);
      const updatedPdfUrl = URL.createObjectURL(updatedPdfBlob);
  
      const link = document.createElement("a");
      link.href = updatedPdfUrl;
      link.download = file.name.replace(".pdf", "_updated.pdf");
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(updatedPdfUrl);
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  
    setIsLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setMetadata({ title: "", author: "", keywords: "" });
    setIsSuccess(false);
  };

  return (
    <div className={styles.container}>
      <EditPDFMetadataHelmet />
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>PDF Metadata Editor</h1>
        <p className={styles.subTitle}>
          Edit and update metadata properties of your PDF documents. Upload your file,
          edit the metadata, and download the updated version.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.uploadSection}>
          <div className={styles.uploadContainer}>
            {!file ? (
              <>
                <i className="fas fa-file-pdf uploadIcon"></i>
                <UploadFileHandling 
                  onFileUpload={handleFileChange} 
                  acceptedFormats={["application/pdf"]}
                  customText="Drag & drop PDF file here or click to browse"
                />
                <p className={styles.fileRequirements}>
                  Supported format: PDF (Max size: 10MB)
                </p>
              </>
            ) : (
              <div className={styles.filePreview}>
                <i className="fas fa-file-pdf fileIcon"></i>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className={styles.resetButton}
                >
                  <i className="fas fa-redo"></i> Change File
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          {file ? (
            <>
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>
                    <i className="fas fa-file-alt inputIcon"></i> Title
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => handleMetadataChange("title", e.target.value)}
                    placeholder="Document title"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>
                    <i className="fas fa-user inputIcon"></i> Author
                  </label>
                  <input
                    type="text"
                    value={metadata.author}
                    onChange={(e) => handleMetadataChange("author", e.target.value)}
                    placeholder="Author name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>
                    <i className="fas fa-tags inputIcon"></i> Keywords
                  </label>
                  <input
                    type="text"
                    value={metadata.keywords}
                    onChange={(e) => handleMetadataChange("keywords", e.target.value)}
                    placeholder="Comma separated keywords"
                  />
                </div>

                <div className={styles.actionButtons}>
                  <button 
                    onClick={handleUpdateMetadata} 
                    className={styles.downloadButton} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className={styles.buttonContent}>
                        <i className="fas fa-spinner fa-spin buttonIcon"></i> Processing...
                      </span>
                    ) : (
                      <span className={styles.buttonContent}>
                        <i className="fas fa-download buttonIcon"></i> Save & Download
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleReset}
                    className={styles.resetFormButton}
                    disabled={isLoading}
                  >
                    <i className="fas fa-undo buttonIcon"></i> Reset All
                  </button>
                </div>
              </div>

              {isSuccess && (
                <div className={styles.successMessage}>
                  <i className="fas fa-check-circle"></i> 
                  Metadata updated successfully! Your download should start shortly.
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <i className="fas fa-file-upload emptyIcon"></i>
              <h3>No PDF File Selected</h3>
              <p>Upload a PDF file to edit its metadata</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMetadata;