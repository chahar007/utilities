import React, { useState, useEffect } from "react";
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
import UploadFileHandling from "../../Home/components/UploadFileHandling";
import styles from "./ReorderPDF.module.scss";
import { ReorderPDFHelmet } from "../../seo/PdfHelmet";

const ReorderPDF = () => {
  const [pdfPages, setPdfPages] = useState([]);
  const [originalPdf, setOriginalPdf] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlePDFUpload = async (file) => {
    if (!file) return;

    setIsProcessing(true);
    setPdfLoadError(false);
    
    try {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      
      fileReader.onload = async () => {
        try {
          const pdfBytes = fileReader.result;
          const pdfDoc = await PDFDocument.load(pdfBytes);
          setOriginalPdf(pdfDoc);
          
          // Create object URL for preview
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          
          // Verify PDF loads in iframe
          await verifyPdfLoad(url);

          const pages = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => ({
            id: `page-${i+1}`,
            pageIndex: i,
            number: i + 1,
          }));
          setPdfPages(pages);
        } catch (error) {
          console.error("PDF processing error:", error);
          setPdfLoadError(true);
          alert("Error processing PDF. The file may be corrupted or encrypted.");
        }
      };
      
      fileReader.onerror = () => {
        setPdfLoadError(true);
        alert("Error reading PDF file.");
      };
    } catch (error) {
      console.error("Upload error:", error);
      setPdfLoadError(true);
      alert("Error loading PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Verify PDF loads in iframe
  const verifyPdfLoad = (url) => {
    return new Promise((resolve, reject) => {
      if (isMobile) {
        // On mobile, we'll use a different approach since iframes can be problematic
        resolve();
        return;
      }

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.display = 'none';
      
      iframe.onload = () => {
        document.body.removeChild(iframe);
        resolve();
      };
      
      iframe.onerror = () => {
        document.body.removeChild(iframe);
        reject(new Error('PDF failed to load in iframe'));
      };
      
      document.body.appendChild(iframe);
      
      // Timeout for slow loading
      setTimeout(() => {
        document.body.removeChild(iframe);
        reject(new Error('PDF loading timed out'));
      }, 5000);
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPdfPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const generateReorderedPDF = async () => {
    if (!originalPdf) return;

    setIsProcessing(true);
    try {
      const newPdf = await PDFDocument.create();
      for (const page of pdfPages) {
        const copiedPage = await newPdf.copyPages(originalPdf, [page.pageIndex]);
        newPdf.addPage(copiedPage[0]);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "reordered.pdf");
    } catch (error) {
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReupload = () => {
    setPdfPages([]);
    setOriginalPdf(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPdfLoadError(false);
  };

  const renderPdfPreview = () => {
    if (pdfLoadError) {
      return (
        <div className={styles.pdfError}>
          <i className="fas fa-exclamation-triangle"></i>
          <p>Could not display PDF preview</p>
          <p className={styles.errorDetail}>The file contents are still available for reordering</p>
        </div>
      );
    }

    if (isMobile) {
      return (
        <div className={styles.mobilePreview}>
          <i className="fas fa-file-pdf"></i>
          <a href={previewUrl} target="_blank">PDF loaded ({pdfPages.length} pages)</a>
        </div>
      );
    }

    return (
      <iframe
        src={previewUrl}
        title="PDF Preview"
        className={styles.pdfFrame}
      />
    );
  };

  return (
    <div className={styles.container}>
      <ReorderPDFHelmet />      
      <div className={styles.previewPanel}>
        <div className={styles.panelHeader}>
          <h2>PDF Preview</h2>
          {previewUrl && (
            <button onClick={handleReupload} className={styles.reuploadBtn}>
              <i className="fas fa-redo"></i> Re-upload
            </button>
          )}
        </div>

        {!previewUrl ? (
          <div className={styles.uploadArea}>
            <UploadFileHandling 
              onFileUpload={handlePDFUpload} 
              acceptedFormats={["application/pdf"]}
            />
            <p className={styles.uploadHint}>
              Drag & drop a PDF file or click to browse
            </p>
          </div>
        ) : (
          <div className={styles.pdfPreview}>
            {renderPdfPreview()}
          </div>
        )}
      </div>

      {/* Right Panel - Page Reordering */}
      <div className={styles.reorderPanel}>
        <div className={styles.panelHeader}>
          <h2>Page Reordering</h2>
          {pdfPages.length > 0 && (
            <button 
              onClick={generateReorderedPDF} 
              className={styles.downloadBtn}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i> Download Reordered PDF
                </>
              )}
            </button>
          )}
        </div>

        {pdfPages.length > 0 ? (
          <div className={styles.reorderContainer}>
            <div className={styles.pageListHeader}>
              <span>Current Order</span>
              <span>Original Page</span>
            </div>
            
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

            <div className={styles.instructions}>
              <i className="fas fa-info-circle"></i>
              <p>Drag and drop pages to reorder them</p>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <i className="fas fa-arrow-left"></i>
            <p>Upload a PDF to begin reordering pages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReorderPDF;