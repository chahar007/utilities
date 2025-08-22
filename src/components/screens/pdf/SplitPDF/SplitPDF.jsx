import React, { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import UsefulLinks from "../../../shared/UsefulLinks/UsefulLinks";
import QuickTips from "../../../shared/QuickTips/QuickTips";
import useSplitPDF from "./useSplitPDF";
import styles from "./SplitPDF.module.scss";
import { SplitPDFHelmet } from "../../seo/PdfHelmet";

const SplitPDFComponent = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [splitSize, setSplitSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // PDF handling
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDetails, setPdfDetails] = useState({
    name: "",
    size: "",
    pages: 0,
  });
  const [splitFiles, setSplitFiles] = useState([]);
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feature-specific states
  const [splitMethod, setSplitMethod] = useState("range");
  const [pageRanges, setPageRanges] = useState("");
  const [customNames, setCustomNames] = useState([]);
  const [numParts, setNumParts] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  
  const { splitPDF, isMobile } = useSplitPDF();

  // File upload handler
  const handleFileUpload = useCallback(async (uploadedFiles) => {
    setError(null);
    setSuccessMessage(null);
    setSplitFiles([]);
    
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

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      setPdfFile(file);
      setTotalPages(pageCount);
      
      const fileSizeKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeKB);
      setPdfDetails({
        name: file.name,
        size: file.size >= 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : fileSizeKB + ' KB',
        pages: pageCount,
      });
      
      setCurrentStep(2);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process PDF file. Please ensure it's a valid PDF.");
      setPdfFile(null);
      setTotalPages(0);
    }
  }, []);

  // Custom split management
  const addCustomSplit = useCallback(() => {
    setCustomNames([...customNames, { name: `Part ${customNames.length + 1}`, range: "" }]);
  }, [customNames]);

  const updateCustomSplit = useCallback((index, field, value) => {
    setCustomNames(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const removeCustomSplit = useCallback((index) => {
    setCustomNames(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Split and Download handler
  const handleSplitAndDownload = useCallback(async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      let splitOptions = {};
      const validationErrors = [];

      // Validate based on split method
      switch (splitMethod) {
        case "range":
          if (!pageRanges.trim()) validationErrors.push("Please enter page ranges");
          splitOptions = { type: "range", ranges: pageRanges.split(",").map(r => r.trim()).filter(r => r) };
          break;
        case "custom":
          if (customNames.length === 0) validationErrors.push("Please add at least one custom split");
          if (customNames.some(item => !item.range.trim())) validationErrors.push("All custom splits need page ranges");
          splitOptions = { 
            type: "custom", 
            ranges: customNames.map(item => item.range), 
            names: customNames.map(item => item.name || `Part ${Math.random().toString(36).substr(2, 4)}`)
          };
          break;
        case "equal":
          if (numParts < 2 || numParts > totalPages) {
            validationErrors.push(`Number of parts must be between 2 and ${totalPages}`);
          }
          splitOptions = { type: "equal", parts: numParts };
          break;
        case "evenOdd":
          splitOptions = { type: "evenOdd" };
          break;
        default:
          validationErrors.push("Invalid split method");
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      const result = await splitPDF(pdfFile, splitOptions);
      
      if (result && result.length > 0) {
        setSplitFiles(result);
        
        // Calculate total split size
        const totalSplitSize = result.reduce((acc, file) => acc + file.bytes.length, 0);
        const totalSplitSizeKB = (totalSplitSize / 1024).toFixed(2);
        setSplitSize(totalSplitSizeKB);
        
        // Calculate size comparison
        if (originalSize) {
          const original = parseFloat(originalSize);
          const split = parseFloat(totalSplitSizeKB);
          const difference = ((split - original) / original) * 100;
          setSizeReduction(difference.toFixed(2));
        }
        
        // Auto-download all files
        result.forEach(file => {
          const blob = new Blob([file.bytes], { type: "application/pdf" });
          saveAs(blob, file.name);
        });
        
        setSuccessMessage(`🎉 Successfully split PDF into ${result.length} files and downloaded!`);
      }
    } catch (err) {
      console.error("Split error:", err);
      setError(err.message || "Failed to split PDF. Please check your settings and try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, splitMethod, pageRanges, customNames, numParts, totalPages, splitPDF, originalSize]);

  // Reset function
  const resetProcessor = useCallback(() => {
    setPdfFile(null);
    setSplitFiles([]);
    setOriginalSize(null);
    setSplitSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ name: "", size: "", pages: 0 });
    setIsProcessing(false);
    setTotalPages(0);
    setPageRanges("");
    setCustomNames([]);
    setNumParts(2);
    setSplitMethod("range");
  }, []);

  // Download individual file
  const downloadFile = useCallback((file) => {
    const blob = new Blob([file.bytes], { type: "application/pdf" });
    saveAs(blob, file.name);
  }, []);

  // Download all files
  const downloadAllFiles = useCallback(() => {
    if (splitFiles.length === 0) {
      setError("No files available to download");
      return;
    }
    splitFiles.forEach(file => {
      downloadFile(file);
    });
  }, [splitFiles, downloadFile]);

  return (
    <div className={styles.splitPDF}>
      <SplitPDFHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-cut"></i>
            PDF Splitter
          </h1>
          <p className={styles.subtitle}>
            Split PDF files into separate documents by pages or ranges • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Configure Split</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download Files</span>
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
              
              {/* Split Results */}
              <div className={styles.resultsSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{pdfDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change File
                  </button>
                </div>
                
                <div className={styles.resultsContainer}>
                  {splitFiles.length > 0 ? (
                    <>
                      <div className={styles.resultsHeader}>
                        <span>Split Results ({splitFiles.length} files)</span>
                        <button onClick={downloadAllFiles} className={styles.downloadAllBtn}>
                          <i className="fas fa-download"></i> Download All
                        </button>
                      </div>
                      <div className={styles.resultsList}>
                        {splitFiles.map((file, index) => (
                          <div key={index} className={styles.resultItem}>
                            <div className={styles.resultInfo}>
                              <div className={styles.pdfIcon}>
                                <i className="fas fa-file-pdf"></i>
                              </div>
                              <div className={styles.fileInfo}>
                                <span className={styles.fileName}>{file.name}</span>
                                <div className={styles.fileMeta}>
                                  <span className={styles.fileSize}>{(file.bytes.length / 1024).toFixed(1)} KB</span>
                                  <span className={styles.pages}>{file.pages || 'N/A'} pages</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => downloadFile(file)}
                              className={styles.downloadBtn}
                            >
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={styles.emptyResults}>
                      <i className="fas fa-file-export"></i>
                      <p>Configure split settings and click "Split & Download" to see results here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                
                {/* File Info */}
                <div className={styles.fileDetails}>
                  <div className={styles.detailItem}>
                    <span>Pages:</span>
                    <span>{pdfDetails.pages}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Size:</span>
                    <span>{pdfDetails.size}</span>
                  </div>
                </div>

                {/* Split Method */}
                <div className={styles.optionGroup}>
                  <label>Split Method:</label>
                  <div className={styles.methodSelector}>
                    {[
                      { value: "range", label: "By Range", icon: "fas fa-list-ol" },
                      { value: "evenOdd", label: "Even/Odd", icon: "fas fa-divide" },
                      { value: "equal", label: "Equal Parts", icon: "fas fa-equals" },
                      { value: "custom", label: "Custom", icon: "fas fa-cog" }
                    ].map(method => (
                      <label key={method.value} className={`${styles.methodOption} ${splitMethod === method.value ? styles.active : ''}`}>
                        <input
                          type="radio"
                          name="splitMethod"
                          value={method.value}
                          checked={splitMethod === method.value}
                          onChange={() => setSplitMethod(method.value)}
                        />
                        <i className={method.icon}></i>
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Method-specific options */}
                <div className={styles.methodOptions}>
                  {splitMethod === "range" && (
                    <div className={styles.inputGroup}>
                      <label htmlFor="pageRanges">Page Ranges:</label>
                      <input
                        id="pageRanges"
                        type="text"
                        placeholder="e.g. 1,3,5-8"
                        value={pageRanges}
                        onChange={(e) => setPageRanges(e.target.value)}
                        className={styles.textInput}
                      />
                      <div className={styles.inputHint}>
                        <i className="fas fa-info-circle"></i>
                        Separate with commas (1,3,5-8)
                      </div>
                    </div>
                  )}

                  {splitMethod === "custom" && (
                    <div className={styles.customSplits}>
                      <button onClick={addCustomSplit} className={styles.addSplitBtn}>
                        <i className="fas fa-plus"></i> Add Custom Split
                      </button>
                      {customNames.map((item, index) => (
                        <div key={index} className={styles.customSplitItem}>
                          <input
                            type="text"
                            placeholder="Name this split"
                            value={item.name}
                            onChange={(e) => updateCustomSplit(index, "name", e.target.value)}
                            className={styles.textInput}
                          />
                          <input
                            type="text"
                            placeholder="Page range"
                            value={item.range}
                            onChange={(e) => updateCustomSplit(index, "range", e.target.value)}
                            className={styles.textInput}
                          />
                          <button 
                            onClick={() => removeCustomSplit(index)}
                            className={styles.removeBtn}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {splitMethod === "equal" && (
                    <div className={styles.inputGroup}>
                      <label htmlFor="numParts">Number of Parts:</label>
                      <div className={styles.numberControl}>
                        <button 
                          onClick={() => setNumParts(p => Math.max(2, p - 1))}
                          disabled={numParts <= 2}
                          className={styles.controlBtn}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input
                          id="numParts"
                          type="number"
                          min="2"
                          max={totalPages}
                          value={numParts}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              setNumParts(Math.min(totalPages, Math.max(2, value)));
                            }
                          }}
                          className={styles.numberInput}
                        />
                        <button 
                          onClick={() => setNumParts(p => Math.min(totalPages, p + 1))}
                          disabled={numParts >= totalPages}
                          className={styles.controlBtn}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className={styles.inputHint}>
                        <i className="fas fa-info-circle"></i>
                        Max: {totalPages} parts
                      </div>
                    </div>
                  )}

                  {splitMethod === "evenOdd" && (
                    <div className={styles.infoGroup}>
                      <div className={styles.methodInfo}>
                        <i className="fas fa-info-circle"></i>
                        <span>This will create two files: one with even pages and one with odd pages.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {splitSize ? (
                        <>
                          <span>Split: {splitSize} KB</span>
                          {sizeReduction && (
                            <span className={parseFloat(sizeReduction) < 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) < 0 ? '' : '+'}{sizeReduction}%)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Ready to split</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Split Button */}
                <button 
                  onClick={handleSplitAndDownload} 
                  className={styles.splitButton}
                  disabled={isProcessing || !pdfFile}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Splitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cut"></i>
                      Split & Download PDF
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
          <UsefulLinks currentTool="split-pdf" />
          <QuickTips currentTool="split-pdf" />
        </div>
      </section>
    </div>
  );
};

export default SplitPDFComponent;