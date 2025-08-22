import React, { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import { _rotatePDF } from "./useRotatePDF";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import UsefulLinks from "../../../shared/UsefulLinks/UsefulLinks";
import QuickTips from "../../../shared/QuickTips/QuickTips";
import styles from './RotatePDF.module.scss';
import { RotatePDFHelmet } from "../../seo/PdfHelmet";

const RotatePDF = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [rotatedSize, setRotatedSize] = useState(null);
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
  
  // Feature-specific states
  const [rotation, setRotation] = useState(90);
  
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

      setPdfFile(file);
      
      const fileSizeKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeKB);
      setPdfDetails({
        name: file.name,
        size: file.size >= 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : fileSizeKB + ' KB',
        pages: 'N/A', // PDF rotation doesn't need page count
      });
      
      setCurrentStep(2);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process PDF file. Please ensure it's a valid PDF.");
      setPdfFile(null);
    }
  }, []);

  // Rotation handler
  const handleRotationChange = useCallback((degrees) => {
    setRotation(degrees);
  }, []);

  // Rotate and Download handler
  const handleRotateAndDownload = useCallback(async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      const rotatedBlob = await _rotatePDF(pdfFile, rotation);
      
      const rotatedSizeKB = (rotatedBlob.size / 1024).toFixed(2);
      setRotatedSize(rotatedSizeKB);
      
      // Calculate size comparison
      if (originalSize) {
        const original = parseFloat(originalSize);
        const rotated = parseFloat(rotatedSizeKB);
        const difference = ((rotated - original) / original) * 100;
        setSizeReduction(difference.toFixed(2));
      }
      
      // Auto-download
      saveAs(rotatedBlob, `rotated-${rotation}deg-${pdfFile.name}`);
      setSuccessMessage(`🎉 Successfully rotated PDF by ${rotation}° and downloaded!`);
    } catch (error) {
      console.error("Rotation error:", error);
      setError("Failed to rotate PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, rotation, originalSize, _rotatePDF]);

  // Reset function
  const resetProcessor = useCallback(() => {
    setPdfFile(null);
    setOriginalSize(null);
    setRotatedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ name: "", size: "", pages: 0 });
    setIsProcessing(false);
    setRotation(90);
  }, []);

  return (
    <div className={styles.rotatePDF}>
      <RotatePDFHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-redo"></i>
            PDF Rotation Tool
          </h1>
          <p className={styles.subtitle}>
            Rotate PDF pages to correct orientation • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Set Rotation</span>
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
              
              {/* Rotation Preview Section */}
              <div className={styles.previewSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{pdfDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change File
                  </button>
                </div>
                
                <div className={styles.previewContainer}>
                  <div className={styles.rotationPreview}>
                    <div className={styles.previewItem}>
                      <div className={styles.pdfIcon}>
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className={styles.previewInfo}>
                        <span className={styles.previewTitle}>Original PDF</span>
                        <span className={styles.previewMeta}>Ready to rotate</span>
                      </div>
                    </div>
                    
                    <div className={styles.rotationArrow}>
                      <i className="fas fa-arrow-right"></i>
                      <span>{rotation}°</span>
                    </div>
                    
                    <div className={styles.previewItem}>
                      <div className={`${styles.pdfIcon} ${styles.rotated}`} style={{transform: `rotate(${rotation}deg)`}}>
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className={styles.previewInfo}>
                        <span className={styles.previewTitle}>Rotated PDF</span>
                        <span className={styles.previewMeta}>Rotated {rotation}° clockwise</span>
                      </div>
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

                {/* Rotation Options */}
                <div className={styles.optionGroup}>
                  <label>Rotation Angle:</label>
                  <div className={styles.rotationSelector}>
                    {[90, 180, 270].map(deg => (
                      <button
                        key={deg}
                        className={`${styles.rotationOption} ${rotation === deg ? styles.active : ''}`}
                        onClick={() => handleRotationChange(deg)}
                      >
                        <i className="fas fa-redo"></i>
                        <span>{deg}°</span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.rotationInfo}>
                    <i className="fas fa-info-circle"></i>
                    <span>All pages will be rotated by the selected angle</span>
                  </div>
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {rotatedSize ? (
                        <>
                          <span>Rotated: {rotatedSize} KB</span>
                          {sizeReduction && (
                            <span className={parseFloat(sizeReduction) < 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) < 0 ? '' : '+'}{sizeReduction}%)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Ready to rotate</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Rotate Button */}
                <button 
                  onClick={handleRotateAndDownload} 
                  className={styles.rotateButton}
                  disabled={isProcessing || !pdfFile}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Rotating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-redo"></i>
                      Rotate & Download PDF
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
          <UsefulLinks currentTool="rotate-pdf" />
          <QuickTips currentTool="rotate-pdf" />
        </div>
      </section>
    </div>
  );
};

export default RotatePDF;