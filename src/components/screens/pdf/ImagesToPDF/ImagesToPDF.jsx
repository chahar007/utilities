import React, { useState } from "react";
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
import styles from "./ImagesToPDF.module.scss";

const ImagesToPDF = () => {
  const [images, setImages] = useState([]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const supportedFormats = [
    'image/png', 
    'image/jpeg', 
    'image/jpg', 
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml' // Added SVG support
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require slight movement before dragging starts
        delay: 250, // Add slight delay to distinguish from taps/clicks
        tolerance: 5, // Allow for slight movement before considering it a drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleImageUpload = (uploadedFiles) => {
    // Filter out unsupported formats
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
           (file.name.endsWith('.svg') ? 'svg' : 'unknown') // Handle SVG type
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    setPdfPreviewUrl(null); // Clear previous preview when new images are added
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item?.id === active?.id);
        const newIndex = items.findIndex((item) => item?.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const generatePDF = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const imageObj of images) {
        try {
          const imageBytes = await imageObj.file.arrayBuffer();
          let embeddedImage;
          
          // Handle different image formats
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
              // Convert unsupported formats to PNG via canvas
              embeddedImage = await convertViaCanvas(imageBytes, pdfDoc);
              break;
            case 'svg':
            case 'svg+xml':
              // Convert SVG to PNG via canvas
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
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert unsupported formats to PNG using canvas
  const convertViaCanvas = async (imageBytes, pdfDoc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(new Blob([imageBytes]));
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          try {
            const pngBytes = await blob.arrayBuffer();
            const embeddedImage = await pdfDoc.embedPng(pngBytes);
            URL.revokeObjectURL(url);
            resolve(embeddedImage);
          } catch (err) {
            reject(err);
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  };

  // Special handler for SVG files
  const convertSvgToPdf = async (svgBytes, pdfDoc) => {
    return new Promise((resolve, reject) => {
      const svgBlob = new Blob([svgBytes], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 800; // Default width if not specified
        canvas.height = img.height || 600; // Default height if not specified
        
        const ctx = canvas.getContext('2d');
        
        // For SVG, we need to ensure it's rendered properly
        const svgContent = new TextDecoder().decode(svgBytes);
        const svgWithDimensions = svgContent.includes('viewBox') ? 
          svgContent : 
          svgContent.replace('<svg', `<svg viewBox="0 0 ${canvas.width} ${canvas.height}"`);
        
        const svgBlob = new Blob([svgWithDimensions], { type: 'image/svg+xml' });
        const newUrl = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
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
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(newUrl);
          reject(new Error('Failed to load SVG'));
        };
        
        img.src = newUrl;
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      
      img.src = url;
    });
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
  };

  return (
    <div className={styles.container}>
      {/* Header */}
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
            <h3>PDF Preview</h3>
            {pdfPreviewUrl ? (
              <iframe 
                src={pdfPreviewUrl} 
                title="PDF Preview" 
                className={styles.pdfPreview}
              />
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
          disabled={images.length === 0 || isProcessing}
          className={styles.convertBtn}
        >
          {isProcessing ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Converting...
            </>
          ) : (
            <>
              <i className="fas fa-file-pdf"></i> Convert to PDF
            </>
          )}
        </button>
        
        {pdfPreviewUrl && (
          <button 
            onClick={handleDownloadPDF}
            className={styles.downloadBtn}
          >
            <i className="fas fa-download"></i> Download PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagesToPDF;