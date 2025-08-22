import React, { useState, useEffect, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import UsefulLinks from "../../../shared/UsefulLinks/UsefulLinks";
import QuickTips from "../../../shared/QuickTips/QuickTips";
import styles from "./ReorderPDF.module.scss";
import { ReorderPDFHelmet } from "../../seo/PdfHelmet";

const ReorderPDF = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [reorderedSize, setReorderedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // PDF handling
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDetails, setPdfDetails] = useState({
    name: "",
    size: "",
    pages: 0,
  });
  const [pdfPages, setPdfPages] = useState([]);
  const [originalPdf, setOriginalPdf] = useState(null);
  const [hasReordered, setHasReordered] = useState(false);
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Helper function to detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: isMobile() ? 300 : 250,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // File upload handler
  const handleFileUpload = useCallback(async (uploadedFiles) => {
    setError(null);
    setSuccessMessage(null);
    setPdfPages([]);
    setHasReordered(false);
    
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
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      setPdfFile(file);
      setOriginalPdf(pdfDoc);
      
      const fileSizeKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeKB);
      setPdfDetails({
        name: file.name,
        size: file.size >= 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : fileSizeKB + ' KB',
        pages: pageCount,
      });

      const pages = Array.from({ length: pageCount }, (_, i) => ({
        id: `page-${i+1}`,
        pageIndex: i,
        number: i + 1,
      }));
      setPdfPages(pages);
      
      setCurrentStep(2);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process PDF file. Please ensure it's a valid PDF.");
      setPdfFile(null);
      setOriginalPdf(null);
      setPdfPages([]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Drag and drop handler
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setPdfPages((items) => {
        const oldIndex = items.findIndex((item) => item?.id === active?.id);
        const newIndex = items.findIndex((item) => item?.id === over?.id);
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        setHasReordered(true);
        return reorderedItems;
      });
    }
  }, []);

  // Reorder and Download handler
  const handleReorderAndDownload = useCallback(async () => {
    if (!originalPdf || pdfPages.length === 0) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      const newPdf = await PDFDocument.create();
      for (const page of pdfPages) {
        const copiedPage = await newPdf.copyPages(originalPdf, [page.pageIndex]);
        newPdf.addPage(copiedPage[0]);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      
      const reorderedSizeKB = (blob.size / 1024).toFixed(2);
      setReorderedSize(reorderedSizeKB);
      setHasReordered(false);
      
      // Calculate size comparison
      if (originalSize) {
        const original = parseFloat(originalSize);
        const reordered = parseFloat(reorderedSizeKB);
        const difference = ((reordered - original) / original) * 100;
        setSizeReduction(difference.toFixed(2));
      }
      
      // Auto-download
      saveAs(blob, "reordered-document.pdf");
      setSuccessMessage(`🎉 Successfully reordered ${pdfPages.length} pages and downloaded!`);
    } catch (error) {
      console.error("PDF generation error:", error);
      setError("Failed to generate reordered PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [originalPdf, pdfPages, originalSize]);

  // Reset function
  const resetProcessor = useCallback(() => {
    setPdfFile(null);
    setPdfPages([]);
    setOriginalPdf(null);
    setOriginalSize(null);
    setReorderedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ name: "", size: "", pages: 0 });
    setIsProcessing(false);
    setHasReordered(false);
  }, []);

  return (
    <div className={styles.reorderPDF}>
      <ReorderPDFHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-sort"></i>
            PDF Page Reorder
          </h1>
          <p className={styles.subtitle}>
            Rearrange PDF pages in any order you want • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Reorder Pages</span>
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
              
              {/* Page List Section */}
              <div className={styles.pagesSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{pdfDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change File
                  </button>
                </div>
                
                <div className={styles.pagesContainer}>
                  {hasReordered && (
                    <div className={styles.reorderNotice}>
                      <i className="fas fa-info-circle"></i>
                      <span>Pages have been reordered - download to save changes</span>
                    </div>
                  )}
                  
                  <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={pdfPages} 
                      strategy={verticalListSortingStrategy}
                    >
                      <div className={styles.pageList}>
                        <div className={styles.pageListHeader}>
                          <span>Current Order</span>
                          <span>Original Page</span>
                          <span>Actions</span>
                        </div>
                        {pdfPages.map((page, index) => (
                          <SortableItem 
                            key={page.id} 
                            id={page.id} 
                            number={page.number} 
                            currentPosition={index + 1}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  <div className={styles.pageDetails}>
                    <span>{pdfDetails.pages} pages total</span>
                    <span>Drag pages to reorder</span>
                  </div>
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

                {/* Reorder Info */}
                <div className={styles.optionGroup}>
                  <label>Reorder Method:</label>
                  <div className={styles.methodInfo}>
                    <div className={styles.infoItem}>
                      <i className="fas fa-grip-vertical"></i>
                      <span>Drag and drop pages to rearrange them in your desired order</span>
                    </div>
                  </div>
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {reorderedSize ? (
                        <>
                          <span>Reordered: {reorderedSize} KB</span>
                          {sizeReduction && (
                            <span className={parseFloat(sizeReduction) < 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) < 0 ? '' : '+'}{sizeReduction}%)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Ready to reorder</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Reorder Button */}
                <button 
                  onClick={handleReorderAndDownload} 
                  className={styles.reorderButton}
                  disabled={isProcessing || pdfPages.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sort"></i>
                      Reorder & Download PDF
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
          <UsefulLinks currentTool="reorder-pdf" />
          <QuickTips currentTool="reorder-pdf" />
        </div>
      </section>
    </div>
  );
};

export default ReorderPDF;