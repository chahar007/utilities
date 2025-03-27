import React, { useState } from "react";
import usePdfMerger from "./usePDFMerger";
import UploadFileHandling from "../../Home/components/UploadFileHandling";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import classes from './MergePDF.module.scss';
import { MergePDFHelmet } from "../../seo/PdfHelmet";

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState(null);
  const { mergePDFs } = usePdfMerger();

  const handleFileUpload = (uploadedFiles) => {
    setError(null);
    const validFiles = uploadedFiles.filter(file => 
      file.type === "application/pdf"
    );
    
    if (validFiles.length !== uploadedFiles.length) {
      setError("Only PDF files are allowed");
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = files.findIndex((file) => file.name === active.id);
      const newIndex = files.findIndex((file) => file.name === over.id);
      setFiles(arrayMove(files, oldIndex, newIndex));
    }
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const clearAll = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    setError(null);
  };

  const handleMerge = async () => {
    try {
      setIsMerging(true);
      setError(null);
      
      const mergedPdfBytes = await mergePDFs(files);
      if (mergedPdfBytes) {
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setMergedPdfUrl(url);
      }
    } catch (err) {
      setError("Failed to merge PDFs. Please try again.");
      console.error("Merge error:", err);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className={classes.container}>
      <MergePDFHelmet />
      <h2 className={classes.mainTitle}><i className="fas fa-file-pdf"></i> Merge PDF Files</h2>
      <p className={classes.subtitle}>Combine multiple PDFs into one document</p>

      <div className={classes.twoColumnLayout}>
        {/* Left Column - File Upload */}
        <div className={classes.leftColumn}>
          <div className={classes.uploadCard}>
            <h3 className={classes.sectionTitle}>Upload PDFs</h3>
            <div className={classes.uploadArea}>
              <UploadFileHandling 
                multiple={true} 
                onFileUpload={handleFileUpload} 
                acceptedFormats={['application/pdf']}
              >
                <div className={classes.uploadContent}>
                  <i className={`fas fa-upload ${classes.uploadIcon}`}></i>
                  <p>Drag & drop PDFs here</p>
                  <span className={classes.fileTypes}>or click to browse files</span>
                  <span className={classes.supportedFormats}>Supports: PDF files</span>
                </div>
              </UploadFileHandling>
            </div>

            {error && (
              <div className={classes.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <div className={classes.uploadActions}>
              <button 
                className={classes.resetButton}
                onClick={clearAll}
                disabled={files.length === 0 || isMerging}
              >
                <i className="fas fa-redo"></i> Reset Files
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - File List and Actions */}
        <div className={classes.rightColumn}>
          <div className={classes.actionCard}>
            <h3 className={classes.sectionTitle}>Arrange & Merge</h3>
            
            {files.length > 0 ? (
              <>
                <div className={classes.fileListHeader}>
                  <span>PDFs to merge ({files.length})</span>
                  <button 
                    className={classes.clearButton}
                    onClick={clearAll}
                    disabled={isMerging}
                  >
                    <i className="fas fa-trash"></i> Clear All
                  </button>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={files.map((file) => file.name)} strategy={verticalListSortingStrategy}>
                    <ul className={classes.pdfList}>
                      {files.map((file) => (
                        <SortableItem 
                          key={file.name} 
                          id={file.name} 
                          name={file.name} 
                          onRemove={() => removeFile(file.name)}
                          disabled={isMerging}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>

                <div className={classes.mergeActions}>
                  <button 
                    onClick={handleMerge} 
                    disabled={files.length < 2 || isMerging}
                    className={`${classes.mergeButton} ${isMerging ? classes.merging : ''}`}
                  >
                    {isMerging ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fas fa-object-group"></i> Merge PDFs
                      </>
                    )}
                  </button>
                  
                  {files.length < 2 && (
                    <p className={classes.hint}>Upload at least 2 PDFs to merge</p>
                  )}
                </div>
              </>
            ) : (
              <div className={classes.emptyState}>
                <i className="fas fa-file-import"></i>
                <p>Upload PDFs to begin merging</p>
              </div>
            )}

            {mergedPdfUrl && (
              <div className={classes.downloadSection}>
                <h4><i className="fas fa-check-circle"></i> Merge Complete!</h4>
                <a 
                  href={mergedPdfUrl} 
                  download="merged-document.pdf" 
                  className={classes.downloadButton}
                >
                  <i className="fas fa-download"></i> Download Merged PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergePdf;