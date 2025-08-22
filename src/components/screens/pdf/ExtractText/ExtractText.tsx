import React, { useState, useCallback } from "react";
import styles from "./ExtractText.module.scss";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
// import { ExtractTextHelmet } from "../../seo/PdfHelmet";
import useExtractText from "./useExtractText";

const ExtractText = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [textLength, setTextLength] = useState(0);
  
  // PDF handling
  const [pdfDetails, setPdfDetails] = useState({
    name: "",
    pages: "",
    size: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // UI state management
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Feature-specific states
  const [extractionOptions, setExtractionOptions] = useState({
    preserveFormatting: true,
    extractImages: false,
    pageRange: "all"
  });

  const { extractTextFromPDF } = useExtractText();

  // File upload handler
  const handleFileUpload = useCallback(async (file) => {
    setError(null);
    setSuccessMessage(null);
    setExtractedText("");
    setTextLength(0);
    
    if (file) {
      // Validation
      if (file.type !== 'application/pdf') {
        setError("Please upload a valid PDF file.");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB.");
        return;
      }

      // Process file
      const fileSizeInKB = (file.size / 1024).toFixed(2);
      const fileUrl = URL.createObjectURL(file);
      
      try {
        // Get PDF page count (simplified for now)
        const pageCount = "Processing...";
        
        setPdfDetails({
          name: file.name,
          pages: pageCount,
          size: file.type.split('/')[1].toUpperCase(),
        });
        setCurrentStep(2);
        setOriginalSize(fileSizeInKB);
        setPreviewUrl(fileUrl);
        
        // Auto-trigger extraction
        await processText(file);
      } catch (error) {
        setError("Error loading PDF. Please try with a different file.");
      }
    }
  }, []);

  // Text extraction function
  const processText = useCallback(async (file) => {
    if (!file) return;
    
    setIsExtracting(true);
    setError(null);
    
    try {
      const text = await extractTextFromPDF(file, extractionOptions);
      setExtractedText(text);
      setTextLength(text.length);
      setCurrentStep(3);
      setSuccessMessage(`✅ Successfully extracted ${text.length} characters from your PDF!`);
    } catch (error) {
      setError("Error extracting text. Please try again with a different PDF.");
    } finally {
      setIsExtracting(false);
    }
  }, [extractTextFromPDF, extractionOptions]);

  // Copy to clipboard handler
  const handleCopyText = useCallback(() => {
    if (!extractedText) {
      setError("No text available to copy.");
      return;
    }

    navigator.clipboard.writeText(extractedText)
      .then(() => {
        setSuccessMessage("📋 Text copied to clipboard!");
      })
      .catch(() => {
        setError("Failed to copy text to clipboard.");
      });
  }, [extractedText]);

  // Download as text file
  const handleDownloadText = useCallback(() => {
    if (!extractedText) {
      setError("No text available to download.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pdfDetails.name.split('.')[0]}_extracted_text.txt`;
      link.click();
      
      URL.revokeObjectURL(url);
      setSuccessMessage(`💾 Text file downloaded successfully!`);
    } catch (error) {
      setError("Error downloading text file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [extractedText, pdfDetails.name]);

  // Reset function
  const resetProcessor = useCallback(() => {
    setPreviewUrl(null);
    setOriginalSize(null);
    setExtractedText("");
    setTextLength(0);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ name: "", pages: "", size: "" });
    setIsExtracting(false);
    setIsProcessing(false);
    setExtractionOptions({
      preserveFormatting: true,
      extractImages: false,
      pageRange: "all"
    });
  }, []);

  return (
    <div className={styles.extractText}>
      {/* <ExtractTextHelmet /> */}
      
      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-file-alt"></i>
            PDF Text Extractor
          </h1>
          <p className={styles.pageDescription}>
            Extract text content from PDF files • 100% Private • Fast & Secure
          </p>
        </div>
      </section>

      {/* 2. MAIN PROCESSING SECTION */}
      <section className={styles.processingSection}>
        <div className={styles.container}>
          
          {/* 2.1 Progress Indicator */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressSteps}>
              <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 1 ? <i className="fas fa-check"></i> : '1'}
                </div>
                <span className={styles.stepLabel}>Upload</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 1 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
                </div>
                <span className={styles.stepLabel}>Extract</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download</span>
              </div>
            </div>
            
            {previewUrl && (
              <button onClick={resetProcessor} className={styles.resetButton}>
                <i className="fas fa-redo"></i>
                Start Over
              </button>
            )}
          </div>

          {/* 2.2 Alert Messages */}
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

          {/* 2.3 Upload Step */}
          {currentStep === 1 && (
            <div className={styles.uploadStep}>
              <UploadFileHandling 
                onFileUpload={handleFileUpload}
                acceptedFormats={["application/pdf"]}
              />
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>Supported: PDF files</span>
                  <span>Max: 50MB</span>
                  <span>🔒 Private & Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* Text Output */}
          {extractedText && (
            <div className={styles.textOutput}>
              <div className={styles.outputHeader}>
                <h3>Extracted Text ({textLength.toLocaleString()} characters)</h3>
                <div className={styles.outputActions}>
                  <button onClick={handleCopyText} className={styles.copyBtn}>
                    <i className="fas fa-copy"></i> Copy
                  </button>
                  <button onClick={handleDownloadText} className={styles.downloadBtn}>
                    <i className="fas fa-download"></i> Download
                  </button>
                </div>
              </div>
              <div className={styles.textContainer}>
                <textarea
                  value={extractedText}
                  readOnly
                  className={styles.textArea}
                  placeholder="Extracted text will appear here..."
                />
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default ExtractText;