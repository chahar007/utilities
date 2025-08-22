import React, { useState, useEffect, useCallback } from "react";
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
import usePdfMerger from "./usePDFMerger";
import styles from './MergePDF.module.scss';
import { MergePDFHelmet } from "../../seo/PdfHelmet";

const MergePdf = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [mergedSize, setMergedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // PDF handling
  const [files, setFiles] = useState([]);
  const [pdfDetails, setPdfDetails] = useState({
    count: 0,
    totalSize: "",
    totalPages: 0,
  });
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasReordered, setHasReordered] = useState(false);
  
  const { mergePDFs, isMobile } = usePdfMerger();

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
  const handleFileUpload = useCallback((uploadedFiles) => {
    setError(null);
    setSuccessMessage(null);
    setMergedPdfUrl(null);
    
    const validFiles = uploadedFiles?.filter(file => 
      file.type === "application/pdf"
    );

    if (validFiles.length !== uploadedFiles.length) {
      setError("Some files were not supported. Only PDF files are allowed.");
    }

    if (validFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }

    const newFiles = validFiles?.map((file, index) => ({
      id: `pdf-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      pages: null // Will be calculated later if needed
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    
    // Calculate total size and update details
    const totalSize = [...files, ...newFiles].reduce((acc, file) => acc + parseFloat(file.size), 0);
    
    setOriginalSize(totalSize.toFixed(2));
    setPdfDetails({
      count: files.length + newFiles.length,
      totalSize: totalSize >= 1024 ? (totalSize / 1024).toFixed(2) + ' MB' : totalSize.toFixed(2) + ' KB',
      totalPages: 0, // Will be calculated if needed
    });
    
    setCurrentStep(2);
    // Reset reordered flag when new files are uploaded
    setHasReordered(false);
  }, [files]);

  // Drag and drop handler
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((item) => item?.id === active?.id);
        const newIndex = items.findIndex((item) => item?.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Show reorder message when PDFs are rearranged
        setHasReordered(true);
        
        return newItems;
      });
    }
  }, []);

  // Remove file handler
  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId);
      
      if (updated.length === 0) {
        setCurrentStep(1);
        setMergedPdfUrl(null);
        setMergedSize(null);
        setOriginalSize(null);
        setPdfDetails({ count: 0, totalSize: "", totalPages: 0 });
        setHasReordered(false);
      } else {
        // Recalculate totals
        const totalSize = updated.reduce((acc, file) => acc + parseFloat(file.size), 0);
        
        setOriginalSize(totalSize.toFixed(2));
        setPdfDetails({
          count: updated.length,
          totalSize: totalSize >= 1024 ? (totalSize / 1024).toFixed(2) + ' MB' : totalSize.toFixed(2) + ' KB',
          totalPages: 0,
        });
      }
      
      return updated;
    });
  }, []);

  // Reset function
  const resetProcessor = useCallback(() => {
    // Clean up object URLs
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    
    setFiles([]);
    setOriginalSize(null);
    setMergedPdfUrl(null);
    setMergedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ count: 0, totalSize: "", totalPages: 0 });
    setIsProcessing(false);
    setHasReordered(false);
  }, [mergedPdfUrl]);

  // Merge and Download handler
  const handleMergeAndDownload = useCallback(async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      const mergedPdfBytes = await mergePDFs(files.map(f => f.file));
      
      if (mergedPdfBytes) {
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setMergedPdfUrl(url);
        
        const mergedSizeKB = (blob.size / 1024).toFixed(2);
        setMergedSize(mergedSizeKB);
        setHasReordered(false);
        
        // Calculate size comparison
        if (originalSize) {
          const original = parseFloat(originalSize);
          const merged = parseFloat(mergedSizeKB);
          const reduction = ((original - merged) / original) * 100;
          setSizeReduction(reduction.toFixed(2));
        }
        
        // Auto-download
        saveAs(url, "merged-document.pdf");
        setSuccessMessage(`🎉 Successfully merged ${files.length} PDFs and downloaded!`);
      }
    } catch (err) {
      setError("Failed to merge PDFs. Please try again.");
      console.error("Merge error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [files, mergePDFs, originalSize]);

  return (
    <div className={styles.mergePDF}>
      <MergePDFHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-object-group"></i>
            PDF Merger
          </h1>
          <p className={styles.subtitle}>
            Combine multiple PDF files into one document • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Upload PDFs</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 1 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
                </div>
                <span className={styles.stepLabel}>Arrange & Merge</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download PDF</span>
              </div>
            </div>
            
            {files.length > 0 && (
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

          {hasReordered && (
            <div className={styles.alertMessage}>
              <div className={styles.infoAlert}>
                <i className="fas fa-info-circle"></i>
                <span>PDFs have been reordered - merge to apply the new order</span>
                <button onClick={() => setHasReordered(false)} className={styles.alertClose}>
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
                multiple={true}
                acceptedFormats={['application/pdf']}
              />
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>Supported: PDF files only</span>
                  <span>Max: 10MB per file</span>
                  <span>🔒 Private & Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {currentStep >= 2 && files.length > 0 && (
            <div className={styles.processingStep}>
              
              {/* PDF List */}
              <div className={styles.pdfSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{pdfDetails.count} PDFs selected</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Add More
                  </button>
                </div>
                
                <div className={styles.pdfContainer}>
                  <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={files} 
                      strategy={verticalListSortingStrategy}
                    >
                      <div className={styles.pdfList}>
                        {files.map((file, index) => (
                          <SortableItem 
                            key={file.id} 
                            id={file.id} 
                            name={file.name}
                            size={file.size}
                            index={index + 1}
                            onRemove={() => removeFile(file.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  <div className={styles.pdfDetails}>
                    <span>{pdfDetails.totalSize}</span>
                    <span>{pdfDetails.count} files</span>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                
                {/* Merge Options */}
                <div className={styles.optionGroup}>
                  <label>Merge Order:</label>
                  <div className={styles.orderInfo}>
                    <i className="fas fa-info-circle"></i>
                    <span>Drag files above to change order</span>
                  </div>
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {mergedSize ? (
                        <>
                          <span>Merged: {mergedSize} KB</span>
                          {sizeReduction && (
                            <span className={parseFloat(sizeReduction) > 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) > 0 ? '-' : '+'}{Math.abs(parseFloat(sizeReduction)).toFixed(2)}%)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Ready to merge</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Merge Button */}
                <button 
                  onClick={handleMergeAndDownload} 
                  className={styles.mergeButton}
                  disabled={isProcessing || files.length < 2}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Merging...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-object-group"></i>
                      Merge & Download PDF
                    </>
                  )}
                </button>
                
                {files.length < 2 && (
                  <div className={styles.mergeHint}>
                    <i className="fas fa-info-circle"></i>
                    <span>Add at least 2 PDFs to merge</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Useful Links & Quick Tips */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="merge-pdf" />
          <QuickTips currentTool="merge-pdf" />
        </div>
      </section>
    </div>
  );
};

export default MergePdf;