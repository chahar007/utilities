import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import useSplitPDF from "./useSplitPDF";
import styles from "./SplitPDF.module.scss";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import { SplitPDFHelmet } from "../../seo/PdfHelmet";

const SplitPDFComponent = () => {
  // State management
  const [pdfFile, setPdfFile] = useState(null);
  const [splitMethod, setSplitMethod] = useState("range");
  const [pageRanges, setPageRanges] = useState("");
  const [customNames, setCustomNames] = useState([]);
  const [numParts, setNumParts] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [activeTab, setActiveTab] = useState("original");
  const { splitPdfFiles, splitPDF, isProcessing, error, reset } = useSplitPDF();

  // Mobile detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);


  // File upload handler
  const handlePDFUpload = useCallback(async (uploadedFiles) => {
    try {
      const file = uploadedFiles;
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File size exceeds 25MB limit");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setPdfFile(file);
      setTotalPages(pdfDoc.getPageCount());
      setActiveTab("original");
      setPreviewPdf(null);
      reset();
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Failed to process PDF");
      setPdfFile(null);
      setTotalPages(0);
    }
  }, [reset]);

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

  // PDF splitting handler
  const handleSplit = useCallback(async () => {
    if (!pdfFile) {
      alert("Please upload a PDF first");
      return;
    }

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
      await splitPDF(pdfFile, splitOptions);
      setActiveTab("split");
      
      console.log("split options", splitPdfFiles);
      // Auto-select the first split file for preview
      if (splitPdfFiles.length > 0) {
        setPreviewPdf(splitPdfFiles[0]);
      }
    } catch (err) {
      console.error("Split error:", err);
      alert(err.message || "Failed to split PDF");
    }

    console.log("split options", splitPdfFiles);

    
  }, [pdfFile, splitMethod, pageRanges, customNames, numParts, totalPages, splitPDF, splitPdfFiles]);

  // PDF handling utilities
  const createBlobUrl = useCallback((pdfBytes) => {
    if (!pdfBytes) return null;
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }, []);

  const downloadPDF = useCallback(async (pdfData, fileName) => {
    try {
      let pdfBytes;
      if (pdfData instanceof Blob) {
        pdfBytes = await pdfData.arrayBuffer();
      } else {
        pdfBytes = pdfData;
      }

      if (!pdfBytes) throw new Error("No PDF data available");
      
      const url = createBlobUrl(pdfBytes);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `split-document-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  }, [createBlobUrl]);

  const downloadAll = useCallback(() => {
    if (!splitPdfFiles || splitPdfFiles.length === 0) {
      alert("No files available to download");
      return;
    }
    splitPdfFiles.forEach(pdf => {
      downloadPDF(pdf.bytes, pdf.name);
    });
  }, [splitPdfFiles, downloadPDF]);

  const openInNewTab = useCallback(async (pdfData) => {
    try {
      let url;
      if (pdfData instanceof Blob) {
        url = URL.createObjectURL(pdfData);
      } else {
        url = createBlobUrl(pdfData);
      }
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        alert("Please allow pop-ups for this site to view PDFs");
      }
    } catch (err) {
      console.error("Preview error:", err);
      alert("Failed to open PDF");
    }
  }, [createBlobUrl]);

  // Reset everything
  const resetAll = useCallback(() => {
    setPdfFile(null);
    setTotalPages(0);
    setPageRanges("");
    setCustomNames([]);
    setActiveTab("original");
    setPreviewPdf(null);
    reset();
  }, [reset]);

  // Auto-select first split when files change
  useEffect(() => {
    if (activeTab === "split" && splitPdfFiles?.length > 0 && !previewPdf) {
      setPreviewPdf(splitPdfFiles[0]);
    }
  }, [splitPdfFiles, activeTab, previewPdf]);

  return (
    <div className={styles.container}>

      <SplitPDFHelmet />
      
      <div className={styles.header}>
        <h1>Split PDF Files</h1>
        <p>Upload a PDF file and split it by pages or ranges</p>
      </div>

      <div className={styles.content}>
        {/* Left Panel - Controls */}
        <div className={styles.leftPanel}>
          <div className={styles.uploadSection}>
            {!pdfFile ? (
              <UploadFileHandling 
                onFileUpload={handlePDFUpload} 
                acceptedFormats={["application/pdf"]}
                multiple={false}
                darkMode={true}
              />
            ) : (
              <>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{pdfFile.name}</span>
                  <span className={styles.fileDetails}>
                    {totalPages} pages • {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <button onClick={resetAll} className={styles.reuploadBtn}>
                  <i className="fas fa-redo"></i> Reupload
                </button>
              </>
            )}
          </div>

          {/* Split Options */}
          {pdfFile && (
            <div className={styles.splitOptions}>
              <div className={styles.methodSelector}>
                {["range", "evenOdd", "custom", "equal"].map(method => (
                  <label key={method} className={styles.methodOption}>
                    <input
                      type="radio"
                      name="splitMethod"
                      value={method}
                      checked={splitMethod === method}
                      onChange={() => setSplitMethod(method)}
                    />
                    <span>
                      {method === "range" && "By Range"}
                      {method === "evenOdd" && "Even/Odd"}
                      {method === "custom" && "Custom"}
                      {method === "equal" && "Equal Parts"}
                    </span>
                  </label>
                ))}
              </div>

              {/* Method-specific options */}
              <div className={styles.methodOptions}>
                {splitMethod === "range" && (
                  <div className={styles.inputGroup}>
                    <label>Page Ranges</label>
                    <input
                      type="text"
                      placeholder="e.g. 1,3,5-8"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                    />
                    <div className={styles.supportedFormats}>
                      <i className="fas fa-info-circle"></i> Separate with commas (1,3,5-8)
                    </div>
                  </div>
                )}

                {splitMethod === "custom" && (
                  <>
                    <button onClick={addCustomSplit} className={styles.addButton}>
                      <i className="fas fa-plus"></i> Add Custom Split
                    </button>
                    {customNames.map((item, index) => (
                      <div key={index} className={styles.customSplitItem}>
                        <input
                          type="text"
                          placeholder="Name this split"
                          value={item.name}
                          onChange={(e) => updateCustomSplit(index, "name", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Page range"
                          value={item.range}
                          onChange={(e) => updateCustomSplit(index, "range", e.target.value)}
                        />
                        <button 
                          onClick={() => removeCustomSplit(index)}
                          className={styles.removeSmallButton}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </>
                )}

                {splitMethod === "equal" && (
                  <div className={styles.inputGroup}>
                    <label>Number of Parts</label>
                    <div className={styles.equalPartsControl}>
                      <button 
                        onClick={() => setNumParts(p => Math.max(2, p - 1))}
                        disabled={numParts <= 2}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <input
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
                      />
                      <button 
                        onClick={() => setNumParts(p => Math.min(totalPages, p + 1))}
                        disabled={numParts >= totalPages}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className={styles.supportedFormats}>
                      <i className="fas fa-info-circle"></i> Max: {totalPages} pages
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actionButtons}>
                <button 
                  onClick={handleSplit} 
                  disabled={isProcessing || !pdfFile}
                  className={styles.convertBtn}
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cut"></i> Split PDF
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className={styles.error}>
                  <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className={styles.rightPanel}>
          <div className={styles.previewSection}>
            {pdfFile ? (
              <>
                <div className={styles.sortingHeader}>
                  <h3>
                    {activeTab === "original" ? "Original PDF" : "Split Results"}
                    {activeTab === "split" && splitPdfFiles?.length > 0 && (
                      <span> ({splitPdfFiles.length} files)</span>
                    )}
                  </h3>
                  {activeTab === "split" && splitPdfFiles?.length > 0 && (
                    <button 
                      onClick={downloadAll}
                      className={styles.downloadBtn}
                    >
                      <i className="fas fa-download"></i> Download All
                    </button>
                  )}
                </div>

                {activeTab === "original" ? (
                  <div className={styles.pdfPreview}>
                    {isMobile ? (
                      <div className={styles.mobilePreview}>
                        <i className="fas fa-file-pdf"></i>
                        <p>PDF preview not available on mobile</p>
                        <div className={styles.mobileActions}>
                          <button 
                            onClick={() => openInNewTab(pdfFile)}
                            className={styles.viewBtn}
                          >
                            <i className="fas fa-external-link-alt"></i> Open
                          </button>
                          <button 
                            onClick={() => downloadPDF(pdfFile, pdfFile.name.replace('.pdf', '') + '-original.pdf')}
                            className={styles.downloadBtn}
                          >
                            <i className="fas fa-download"></i> Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <iframe
                          src={URL.createObjectURL(pdfFile)}
                          title="Original PDF Preview"
                          className={styles.pdfIframe}
                        />
                        <div className={styles.previewActions}>
                          <button 
                            onClick={() => downloadPDF(pdfFile, pdfFile.name.replace('.pdf', '') + '-original.pdf')}
                            className={styles.downloadBtn}
                          >
                            <i className="fas fa-download"></i> Download Original
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className={styles.splitResultsContainer}>
                      {splitPdfFiles?.length > 0 ? (
                        <div className={styles.splitResultsList}>
                          {splitPdfFiles.map((pdf, index) => (
                            <div
                              key={index}
                              className={`${styles.splitResultItem} ${previewPdf?.name === pdf.name ? styles.active : ''}`}
                              onClick={() => setPreviewPdf(pdf)}
                            >
                              <div className={styles.splitResultInfo}>
                                <i className="fas fa-file-pdf"></i>
                                <div>
                                  <div className={styles.splitResultName}>{pdf.name}</div>
                                  <div className={styles.splitResultMeta}>
                                    {pdf.pages} pages • {(pdf.bytes.length / 1024).toFixed(1)} KB
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadPDF(pdf.bytes, pdf.name);
                                }}
                                className={styles.downloadBtnSmall}
                              >
                                <i className="fas fa-download"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <i className="fas fa-file-export"></i>
                          <p>No split files yet</p>
                          <p className={styles.convertHint}>Split your PDF to see results here</p>
                        </div>
                      )}
                    </div>

                    {previewPdf && (
                      <div className={styles.pdfPreview}>
                        {isMobile ? (
                          <div className={styles.mobilePreview}>
                            <i className="fas fa-file-pdf"></i>
                            <p>Preview not available on mobile</p>
                            <div className={styles.mobileActions}>
                              <button 
                                onClick={() => openInNewTab(previewPdf.bytes)}
                                className={styles.viewBtn}
                              >
                                <i className="fas fa-external-link-alt"></i> Open
                              </button>
                              <button 
                                onClick={() => downloadPDF(previewPdf.bytes, previewPdf.name)}
                                className={styles.downloadBtn}
                              >
                                <i className="fas fa-download"></i> Download
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <iframe
                              src={createBlobUrl(previewPdf.bytes)}
                              title="PDF Preview"
                              className={styles.pdfIframe}
                            />
                            <div className={styles.previewActions}>
                              <button 
                                onClick={() => downloadPDF(previewPdf.bytes, previewPdf.name)}
                                className={styles.downloadBtn}
                              >
                                <i className="fas fa-download"></i> Download This File
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className={styles.previewPlaceholder}>
                <i className="fas fa-file-upload"></i>
                <p>Upload a PDF to preview</p>
                <p className={styles.convertHint}>Supported format: .pdf</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPDFComponent;