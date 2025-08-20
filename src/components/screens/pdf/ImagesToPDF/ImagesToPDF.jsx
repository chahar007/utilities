import React, { useState, useEffect, useRef } from "react";
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
import styles from "./ImagesToPDF.module.scss";
import { ImageToPDFHelmet } from "../../seo/PdfHelmet";

// Enhanced mobile detection
const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
         window.innerWidth < 768;
};

const ImagesToPDF = () => {
  const [images, setImages] = useState([]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasReordered, setHasReordered] = useState(false);
  const [lastGeneratedOrder, setLastGeneratedOrder] = useState([]);
  const previewWindowRef = useRef(null);

  const supportedFormats = [
    'image/png', 
    'image/jpeg', 
    'image/jpg', 
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml'
  ];

  // Track if images have changed since last generation
  useEffect(() => {
    if (images.length === 0) {
      setHasReordered(false);
      return;
    }

    // Check if order has changed since last generation
    const currentOrder = images.map(img => img.id);
    const hasChanged = !arraysEqual(currentOrder, lastGeneratedOrder);
    setHasReordered(hasChanged);
  }, [images, lastGeneratedOrder]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.url));
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      if (previewWindowRef.current && !previewWindowRef.current.closed) {
        previewWindowRef.current.close();
      }
    };
  }, [images, pdfPreviewUrl]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: isMobile() ? 300 : 250, // Longer delay for mobile
        tolerance: 10, // More tolerance for touch devices
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleImageUpload = (uploadedFiles) => {
    const validFiles = uploadedFiles?.filter(file => 
      supportedFormats.includes(file.type.toLowerCase())
    );

    if (validFiles.length !== uploadedFiles.length) {
      alert(`Some files were not supported. Only ${supportedFormats.join(', ')} formats are supported.`);
    }

    const newImages = validFiles?.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type.split('/')[1]?.toLowerCase() || 
           (file.name.endsWith('.svg') ? 'svg' : 'unknown')
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    setPdfPreviewUrl(null);
    setHasReordered(true); // New uploads require generation
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item?.id === active?.id);
        const newIndex = items.findIndex((item) => item?.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Mark as reordered only if we already had a generated PDF
        if (pdfPreviewUrl) {
          setHasReordered(true);
        }
        
        return newItems;
      });
    }
  };

  const generatePDF = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    try {
      // Clean up previous PDF if exists
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(null);
      }

      const pdfDoc = await PDFDocument.create();
      
      for (const imageObj of images) {
        try {
          const imageBytes = await imageObj.file.arrayBuffer();
          let embeddedImage;
          
          switch(imageObj.type) {
            case 'png':
              embeddedImage = await pdfDoc.embedPng(imageBytes);
              break;
            case 'jpg':
            case 'jpeg':
              embeddedImage = await pdfDoc.embedJpg(imageBytes);
              break;
            case 'webp':
            case 'gif':
            case 'bmp':
            case 'tiff':
              embeddedImage = await convertViaCanvas(imageBytes, pdfDoc);
              break;
            case 'svg':
            case 'svg+xml':
              embeddedImage = await convertSvgToPdf(imageBytes, pdfDoc);
              break;
            default:
              console.warn(`Unsupported image format: ${imageObj.type}`);
              continue;
          }

          const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
          page.drawImage(embeddedImage, { 
            x: 0, 
            y: 0, 
            width: embeddedImage.width, 
            height: embeddedImage.height 
          });
        } catch (error) {
          console.error(`Error processing image ${imageObj.name}:`, error);
          continue;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setPdfPreviewUrl(pdfUrl);
      setHasReordered(false);
      setLastGeneratedOrder(images.map(img => img.id));
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const convertViaCanvas = async (imageBytes, pdfDoc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(new Blob([imageBytes]));
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to PNG blob
        canvas.toBlob(async (blob) => {
          try {
            const pngBytes = await blob.arrayBuffer();
            const embeddedImage = await pdfDoc.embedPng(pngBytes);
            URL.revokeObjectURL(url);
            resolve(embeddedImage);
          } catch (err) {
            reject(new Error(`Failed to convert image: ${err.message}`));
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for conversion'));
      };
      
      img.src = url;
    });
  };

  const convertSvgToPdf = async (svgBytes, pdfDoc) => {
    return new Promise((resolve, reject) => {
      const svgBlob = new Blob([svgBytes], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set reasonable default dimensions if not specified
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        
        const ctx = canvas.getContext('2d');
        
        // Ensure SVG has proper dimensions
        const svgContent = new TextDecoder().decode(svgBytes);
        const svgWithDimensions = svgContent.includes('viewBox') ? 
          svgContent : 
          svgContent.replace('<svg', `<svg viewBox="0 0 ${canvas.width} ${canvas.height}"`);
        
        const svgBlob = new Blob([svgWithDimensions], { type: 'image/svg+xml' });
        const newUrl = URL.createObjectURL(svgBlob);
        
        // Create new image with updated SVG
        const newImg = new Image();
        newImg.onload = () => {
          try {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob(async (blob) => {
              try {
                const pngBytes = await blob.arrayBuffer();
                const embeddedImage = await pdfDoc.embedPng(pngBytes);
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(newUrl);
                resolve(embeddedImage);
              } catch (err) {
                reject(err);
              }
            }, 'image/png');
          } catch (err) {
            reject(err);
          }
        };
        
        newImg.onerror = () => {
          URL.revokeObjectURL(newUrl);
          reject(new Error('Failed to load processed SVG'));
        };
        
        newImg.src = newUrl;
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      
      img.src = url;
    });
  };

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const handleViewPDF = () => {
    if (!pdfPreviewUrl) return;
    
    if (isMobile()) {
      // For mobile devices, open in new tab
      previewWindowRef.current = window.open(pdfPreviewUrl, '_blank');
      if (!previewWindowRef.current) {
        alert('Pop-up blocked. Please allow pop-ups for this site to view the PDF.');
      }
    } else {
      // For desktop, keep the iframe preview
      setPdfPreviewUrl(pdfPreviewUrl); // Refresh if needed
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfPreviewUrl) return;
    saveAs(pdfPreviewUrl, "converted_images.pdf");
  };

  const handleReupload = () => {
    // Clean up object URLs
    images.forEach(image => URL.revokeObjectURL(image.url));
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    
    setImages([]);
    setPdfPreviewUrl(null);
    setHasReordered(false);
    setLastGeneratedOrder([]);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <ImageToPDFHelmet />

      <div className={styles.header}>
        <h1>Images to PDF Converter</h1>
        <p>Upload, arrange, and convert your images to a single PDF file</p>
        <p className={styles.supportedFormats}>
          Supported formats: PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF, SVG
        </p>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Panel - Upload & Preview */}
        <div className={styles.leftPanel}>
          <div className={styles.uploadSection}>
            <UploadFileHandling 
              onFileUpload={handleImageUpload} 
              multiple={true}
            />
            {images.length > 0 && (
              <button onClick={handleReupload} className={styles.reuploadBtn}>
                <i className="fas fa-redo"></i> Clear All Images
              </button>
            )}
          </div>

          <div className={styles.previewSection}>
            <h3>PDF Preview {hasReordered && <span className={styles.unsavedChanges}>(Unsaved Changes)</span>}</h3>
            {pdfPreviewUrl ? (
              isMobile() ? (
                <div className={styles.mobilePreview}>
                  <p>PDF preview is not available on mobile. Please download or open in new tab.</p>
                  <button 
                    onClick={handleViewPDF}
                    className={styles.viewBtn}
                  >
                    <i className="fas fa-external-link-alt"></i> Open PDF
                  </button>
                </div>
              ) : (
                <iframe 
                  src={`${pdfPreviewUrl}#toolbar=1&navpanes=0`}
                  title="PDF Preview" 
                  className={styles.pdfPreview}
                  // type="application/pdf"
                />
              )
            ) : (
              <div className={styles.previewPlaceholder}>
                <i className="fas fa-file-pdf"></i>
                <p>Your PDF preview will appear here</p>
                {images.length > 0 && !pdfPreviewUrl && (
                  <p className={styles.convertHint}>
                    Click "Convert to PDF" to generate preview
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Image Sorting */}
        <div className={styles.rightPanel}>
          <div className={styles.sortingHeader}>
            <h3>Arrange Images ({images.length})</h3>
            <div className={styles.instructions}>
              <i className="fas fa-info-circle"></i>
              <p>Drag images to reorder them</p>
              {hasReordered && (
                <p className={styles.reorderWarning}>
                  <i className="fas fa-exclamation-triangle"></i> Order changed - regenerate PDF
                </p>
              )}
            </div>
          </div>

          {images.length > 0 ? (
            <div className={styles.imageListContainer}>
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={images} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className={styles.imageList}>
                    {images.map((image) => (
                      <SortableItem 
                        key={image.id} 
                        id={image.id} 
                        imageUrl={image.url}
                        fileName={image.name}
                        fileType={image.type}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <i className="fas fa-images"></i>
              <p>Upload images to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          onClick={generatePDF} 
          disabled={images.length === 0 || (isProcessing && !hasReordered)}
          className={styles.convertBtn}
        >
          {isProcessing ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> {hasReordered ? 'Regenerating...' : 'Converting...'}
            </>
          ) : hasReordered ? (
            <>
              <i className="fas fa-sync-alt"></i> Generate PDF
            </>
          ) : (
            <>
              <i className="fas fa-file-pdf"></i> Convert to PDF
            </>
          )}
        </button>
        
        {pdfPreviewUrl && (
          <>
            {!isMobile() && (
              <button 
                onClick={handleViewPDF}
                className={styles.viewBtn}
              >
                <i className="fas fa-eye"></i> View Fullscreen
              </button>
            )}
            <button 
              onClick={handleDownloadPDF}
              className={styles.downloadBtn}
            >
              <i className="fas fa-download"></i> Download PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesToPDF;