import React, { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import { extractMetadata, updateMetadata } from "./useEditMetadata";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import UsefulLinks from "../../../shared/UsefulLinks/UsefulLinks";
import QuickTips from "../../../shared/QuickTips/QuickTips";
import styles from "./EditMetadata.module.scss";
import { EditPDFMetadataHelmet } from "../../seo/PdfHelmet";

const EditMetadata = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [updatedSize, setUpdatedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // PDF handling
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDetails, setPdfDetails] = useState({
    name: "",
    size: "",
    pages: 0,
  });
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feature-specific metadata state
  const [metadata, setMetadata] = useState({ 
    title: "", 
    author: "", 
    subject: "",
    keywords: "",
    creator: "",
    producer: ""
  });
  
  // Helper function to detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  // File upload handler
  const handleFileUpload = useCallback(async (uploadedFiles) => {
    setError(null);
    setSuccessMessage(null);
    
    // Handle both single file and array cases
    const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    
    const validFiles = filesArray?.filter(file => 
      file && file.type === "application/pdf"
    );

    if (validFiles.length !== filesArray.length) {
      setError("Some files were not supported. Only PDF files are allowed.");
    }

    if (validFiles.length === 0) {
      setError("Please upload a valid PDF file.");
      return;
    }

    try {
      const file = validFiles[0]; // Take first file since this is single upload
      
      if (file.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please choose a smaller file.");
        return;
      }

      setIsProcessing(true);
      setPdfFile(file);
      
      const fileSizeKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeKB);
      setPdfDetails({
        name: file.name,
        size: file.size >= 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : fileSizeKB + ' KB',
        pages: 'N/A', // PDF metadata editing doesn't need page count
      });

      // Extract existing metadata
      try {
        const existingMetadata = await extractMetadata(file);
        setMetadata(existingMetadata);
        setCurrentStep(2);
      } catch (err) {
        console.error("Metadata extraction error:", err);
        setError("Could not extract metadata from PDF. You can still edit basic properties.");
        setCurrentStep(2);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process PDF file. Please ensure it's a valid PDF.");
      setPdfFile(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Metadata change handler
  const handleMetadataChange = useCallback((field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update and Download handler
  const handleUpdateAndDownload = useCallback(async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      const updatedPdfBlob = await updateMetadata(pdfFile, metadata);
      
      const updatedSizeKB = (updatedPdfBlob.size / 1024).toFixed(2);
      setUpdatedSize(updatedSizeKB);
      
      // Calculate size comparison
      if (originalSize) {
        const original = parseFloat(originalSize);
        const updated = parseFloat(updatedSizeKB);
        const difference = ((updated - original) / original) * 100;
        setSizeReduction(difference.toFixed(2));
      }
      
      // Auto-download
      saveAs(updatedPdfBlob, `metadata-updated-${pdfFile.name}`);
      setSuccessMessage(`🎉 Successfully updated PDF metadata and downloaded!`);
    } catch (error) {
      console.error("Metadata update error:", error);
      setError("Failed to update PDF metadata. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, metadata, originalSize]);

  // Reset function
  const resetProcessor = useCallback(() => {
    setPdfFile(null);
    setOriginalSize(null);
    setUpdatedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ name: "", size: "", pages: 0 });
    setIsProcessing(false);
    setMetadata({ 
      title: "", 
      author: "", 
      subject: "",
      keywords: "",
      creator: "",
      producer: ""
    });
  }, []);

  return (
    <div className={styles.editMetadata}>
      <EditPDFMetadataHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-tags"></i>
            PDF Metadata Editor
          </h1>
          <p className={styles.subtitle}>
            Edit and update metadata properties of your PDF documents • 100% Private • Fast & Secure
          </p>
        </div>
      </section>

      {/* Main Processing Section */}
      <section className={styles.main}>
        <div className={styles.container}>
          
          {/* Progress Steps */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressSteps}>
              <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 1 ? <i className="fas fa-check"></i> : '1'}
                </div>
                <span className={styles.stepLabel}>Upload PDF</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 1 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
                </div>
                <span className={styles.stepLabel}>Edit Metadata</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download PDF</span>
              </div>
            </div>
            
            {pdfFile && (
              <button onClick={resetProcessor} className={styles.resetButton}>
                <i className="fas fa-redo"></i>
                Start Over
              </button>
            )}
          </div>

          {/* Alert Messages */}
          {error && (
            <div className={styles.alertMessage}>
              <div className={styles.errorAlert}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button onClick={() => setError(null)} className={styles.alertClose}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {successMessage && (
            <div className={styles.alertMessage}>
              <div className={styles.successAlert}>
                <i className="fas fa-check-circle"></i>
                <span>{successMessage}</span>
                <button onClick={() => setSuccessMessage(null)} className={styles.alertClose}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Upload Step */}
          {currentStep === 1 && (
            <div className={styles.uploadStep}>
              <UploadFileHandling 
                onFileUpload={handleFileUpload}
                multiple={false}
                acceptedFormats={['application/pdf']}
              />
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>Supported: PDF files only</span>
                  <span>Max: 25MB per file</span>
                  <span>🔒 Private & Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {currentStep >= 2 && pdfFile && (
            <div className={styles.processingStep}>
              
              {/* Metadata Editor Section */}
              <div className={styles.metadataSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{pdfDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change File
                  </button>
                </div>
                
                <div className={styles.metadataForm}>
                  <div className={styles.formTitle}>
                    <i className="fas fa-edit"></i>
                    Edit Document Properties
                  </div>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label>
                        <i className="fas fa-heading"></i>
                        Title
                      </label>
                      <input
                        type="text"
                        value={metadata.title || ''}
                        onChange={(e) => handleMetadataChange("title", e.target.value)}
                        placeholder="Document title"
                        className={styles.metadataInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>
                        <i className="fas fa-user"></i>
                        Author
                      </label>
                      <input
                        type="text"
                        value={metadata.author || ''}
                        onChange={(e) => handleMetadataChange("author", e.target.value)}
                        placeholder="Author name"
                        className={styles.metadataInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>
                        <i className="fas fa-align-left"></i>
                        Subject
                      </label>
                      <input
                        type="text"
                        value={metadata.subject || ''}
                        onChange={(e) => handleMetadataChange("subject", e.target.value)}
                        placeholder="Document subject"
                        className={styles.metadataInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>
                        <i className="fas fa-tags"></i>
                        Keywords
                      </label>
                      <input
                        type="text"
                        value={metadata.keywords || ''}
                        onChange={(e) => handleMetadataChange("keywords", e.target.value)}
                        placeholder="Comma separated keywords"
                        className={styles.metadataInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>
                        <i className="fas fa-tools"></i>
                        Creator
                      </label>
                      <input
                        type="text"
                        value={metadata.creator || ''}
                        onChange={(e) => handleMetadataChange("creator", e.target.value)}
                        placeholder="Creator application"
                        className={styles.metadataInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>
                        <i className="fas fa-cogs"></i>
                        Producer
                      </label>
                      <input
                        type="text"
                        value={metadata.producer || ''}
                        onChange={(e) => handleMetadataChange("producer", e.target.value)}
                        placeholder="Producer application"
                        className={styles.metadataInput}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                
                {/* File Info */}
                <div className={styles.fileDetails}>
                  <div className={styles.detailItem}>
                    <span>File:</span>
                    <span>{pdfFile.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Size:</span>
                    <span>{pdfDetails.size}</span>
                  </div>
                </div>

                {/* Metadata Info */}
                <div className={styles.optionGroup}>
                  <label>Metadata Properties:</label>
                  <div className={styles.metadataInfo}>
                    <div className={styles.infoItem}>
                      <i className="fas fa-info-circle"></i>
                      <span>Metadata helps organize and identify your PDF documents</span>
                    </div>
                    <div className={styles.infoItem}>
                      <i className="fas fa-search"></i>
                      <span>Improves searchability and document management</span>
                    </div>
                  </div>
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {updatedSize ? (
                        <>
                          <span>Updated: {updatedSize} KB</span>
                          {sizeReduction && (
                            <span className={parseFloat(sizeReduction) < 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) < 0 ? '' : '+'}{sizeReduction}%)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Ready to update</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Update Button */}
                <button 
                  onClick={handleUpdateAndDownload} 
                  className={styles.updateButton}
                  disabled={isProcessing || !pdfFile}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Updating Metadata...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Update & Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Useful Links & Quick Tips */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="edit-metadata" />
          <QuickTips currentTool="edit-metadata" />
        </div>
      </section>
    </div>
  );
};

export default EditMetadata;