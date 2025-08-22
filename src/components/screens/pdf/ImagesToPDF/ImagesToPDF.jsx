import React, { useState, useEffect, useCallback, useRef } from "react";
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
import styles from "./ImagesToPDF.module.scss";
import { ImageToPDFHelmet } from "../../seo/PdfHelmet";
import useImagesToPDF from "./useImagesToPDF";

const ImagesToPDF = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [pdfSize, setPdfSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // Image handling
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState({
    count: 0,
    totalSize: "",
    formats: [],
  });
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Feature-specific states
  const [pdfOptions, setPdfOptions] = useState({
    quality: 80,
    pageSize: "auto",
    orientation: "auto",
    margin: 10
  });
  
  const [hasReordered, setHasReordered] = useState(false);
  const [lastGeneratedOrder, setLastGeneratedOrder] = useState([]);
  const previewWindowRef = useRef(null);

  const { 
    convertImagesToPDF, 
    supportedFormats,
    isMobile 
  } = useImagesToPDF();

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

  // Auto-calculate PDF size when options change
  useEffect(() => {
    if (images.length > 0 && currentStep >= 2) {
      calculatePdfSize();
    }
  }, [images, pdfOptions.quality, pdfOptions.pageSize]);

  // Calculate estimated PDF size
  const calculatePdfSize = useCallback(async () => {
    if (images.length === 0) return;
    
    setIsCalculating(true);
    
    try {
      // Estimate based on quality and number of images
      const totalImageSize = images.reduce((acc, img) => acc + parseFloat(img.size), 0);
      const qualityFactor = pdfOptions.quality / 100;
      const estimatedSize = (totalImageSize * qualityFactor * 0.8).toFixed(2); // PDF overhead factor
      
      setPdfSize(estimatedSize);
      
      // Calculate size comparison
      if (originalSize) {
        const original = parseFloat(originalSize);
        const processed = parseFloat(estimatedSize);
        const reduction = ((original - processed) / original) * 100;
        setSizeReduction(reduction.toFixed(2));
      }
      
      setIsCalculating(false);
    } catch (error) {
      setIsCalculating(false);
    }
  }, [images, pdfOptions.quality, originalSize]);

  // File upload handler
  const handleFileUpload = useCallback((uploadedFiles) => {
    setError(null);
    setSuccessMessage(null);
    setPdfPreviewUrl(null);
    
    const validFiles = uploadedFiles?.filter(file => 
      supportedFormats.includes(file.type.toLowerCase())
    );

    if (validFiles.length !== uploadedFiles.length) {
      setError(`Some files were not supported. Only ${supportedFormats.join(', ')} formats are supported.`);
    }

    if (validFiles.length === 0) {
      setError("Please upload valid image files (PNG, JPG, JPEG, WebP, GIF, BMP, TIFF, SVG).");
      return;
    }

    const newImages = validFiles?.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      type: file.type.split('/')[1]?.toLowerCase() || 
           (file.name.endsWith('.svg') ? 'svg' : 'unknown')
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    
    // Calculate total size and update details
    const totalSize = [...images, ...newImages].reduce((acc, img) => acc + parseFloat(img.size), 0);
    const formats = [...new Set([...images, ...newImages].map(img => img.type.toUpperCase()))];
    
    setOriginalSize(totalSize.toFixed(2));
    setImageDetails({
      count: images.length + newImages.length,
      totalSize: totalSize >= 1024 ? (totalSize / 1024).toFixed(2) + ' MB' : totalSize.toFixed(2) + ' KB',
      formats: formats.join(', '),
    });
    
    setCurrentStep(2);
    // Only set hasReordered if we already have a PDF generated
    if (pdfPreviewUrl) {
      setHasReordered(true);
    }
  }, [images, supportedFormats, pdfPreviewUrl]);

  // Drag and drop handler
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active?.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item?.id === active?.id);
        const newIndex = items.findIndex((item) => item?.id === over?.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        if (pdfPreviewUrl) {
          setHasReordered(true);
        }
        
        return newItems;
      });
    }
  }, [pdfPreviewUrl]);

  // Remove image handler
  const removeImage = useCallback((imageId) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      
      if (updated.length === 0) {
        setCurrentStep(1);
        setPdfPreviewUrl(null);
        setPdfSize(null);
        setOriginalSize(null);
        setImageDetails({ count: 0, totalSize: "", formats: [] });
        setHasReordered(false);
        setLastGeneratedOrder([]);
      } else {
        // Recalculate totals
        const totalSize = updated.reduce((acc, img) => acc + parseFloat(img.size), 0);
        const formats = [...new Set(updated.map(img => img.type.toUpperCase()))];
        
        setOriginalSize(totalSize.toFixed(2));
        setImageDetails({
          count: updated.length,
          totalSize: totalSize >= 1024 ? (totalSize / 1024).toFixed(2) + ' MB' : totalSize.toFixed(2) + ' KB',
          formats: formats.join(', '),
        });
        // Only set hasReordered if we already have a PDF generated
        if (pdfPreviewUrl) {
          setHasReordered(true);
        }
      }
      
      return updated;
    });
  }, [pdfPreviewUrl]);

  // Convert and Download handler
  const handleConvertAndDownload = useCallback(async () => {
    if (images.length === 0) {
      setError("Please upload images first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      const result = await convertImagesToPDF(images, pdfOptions);
      
      if (result.pdfUrl) {
        setPdfPreviewUrl(result.pdfUrl);
        setPdfSize(result.size);
        setHasReordered(false);
        setLastGeneratedOrder(images.map(img => img.id));
        
        // Auto-download
        saveAs(result.pdfUrl, "converted_images.pdf");
        setSuccessMessage(`🎉 Successfully converted ${images.length} images to PDF and downloaded!`);
      }
    } catch (error) {
      setError("Error converting images to PDF. Please try again.");
      console.error("PDF conversion error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [images, pdfOptions, convertImagesToPDF]);

  // Reset function
  const resetProcessor = useCallback(() => {
    // Clean up object URLs
    images.forEach(image => URL.revokeObjectURL(image.url));
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    
    setImages([]);
    setOriginalSize(null);
    setPdfPreviewUrl(null);
    setPdfSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setImageDetails({ count: 0, totalSize: "", formats: [] });
    setIsCalculating(false);
    setIsProcessing(false);
    setHasReordered(false);
    setLastGeneratedOrder([]);
    setPdfOptions({
      quality: 80,
      pageSize: "auto", 
      orientation: "auto",
      margin: 10
    });
  }, [images, pdfPreviewUrl]);

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

  return (
    <div className={styles.imagesToPDF}>
      <ImageToPDFHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-images"></i>
            Images to PDF Converter
          </h1>
          <p className={styles.subtitle}>
            Convert multiple images into a single PDF document • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Upload Images</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 1 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
                </div>
                <span className={styles.stepLabel}>Arrange & Configure</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download PDF</span>
              </div>
            </div>
            
            {images.length > 0 && (
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
                multiple={true}
                acceptedFormats={supportedFormats}
              />
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>Supported: PNG, JPG, JPEG, WebP, GIF, BMP, TIFF, SVG</span>
                  <span>Max: 10MB per image</span>
                  <span>🔒 Private & Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {currentStep >= 2 && images.length > 0 && (
            <div className={styles.processingStep}>
              
              {/* Image List */}
              <div className={styles.imageSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{imageDetails.count} images selected</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Add More
                  </button>
                </div>
                
                <div className={styles.imageContainer}>
                  {hasReordered && (
                    <div className={styles.reorderNotice}>
                      <i className="fas fa-info-circle"></i>
                      <span>Images have been reordered - convert again to update PDF</span>
                    </div>
                  )}
                  
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
                        {images.map((image, index) => (
                          <SortableItem 
                            key={image.id} 
                            id={image.id} 
                            imageUrl={image.url}
                            fileName={image.name}
                            fileType={image.type}
                            fileSize={image.size}
                            index={index + 1}
                            onRemove={() => removeImage(image.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  <div className={styles.imageDetails}>
                    <span>{imageDetails.totalSize}</span>
                    <span>{imageDetails.formats}</span>
                    <span>{imageDetails.count} images</span>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                
                {/* PDF Options */}
                <div className={styles.optionGroup}>
                  <label htmlFor="quality">PDF Quality:</label>
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      id="quality"
                      min="20"
                      max="100"
                      value={pdfOptions.quality}
                      onChange={(e) => setPdfOptions(prev => ({
                        ...prev,
                        quality: parseInt(e.target.value)
                      }))}
                      className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{pdfOptions.quality}%</span>
                  </div>
                </div>

                <div className={styles.optionGroup}>
                  <label htmlFor="pageSize">Page Size:</label>
                  <select
                    id="pageSize"
                    value={pdfOptions.pageSize}
                    onChange={(e) => setPdfOptions(prev => ({
                      ...prev,
                      pageSize: e.target.value
                    }))}
                    className={styles.formatSelector}
                  >
                    <option value="auto">Auto (fit image)</option>
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {pdfSize ? (
                        <>
                          <span>PDF: {pdfSize} KB</span>
                          {sizeReduction && !isCalculating ? (
                            <span className={parseFloat(sizeReduction) > 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) > 0 ? '-' : '+'}{Math.abs(parseFloat(sizeReduction)).toFixed(2)}%)
                            </span>
                          ) : (
                            <span className={styles.calculating}>Calculating...</span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Calculating...</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <button 
                  onClick={handleConvertAndDownload} 
                  className={styles.convertButton}
                  disabled={isProcessing || images.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-pdf"></i>
                      Convert & Download PDF
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
          <UsefulLinks currentTool="image-to-pdf" />
          <QuickTips currentTool="image-to-pdf" />
        </div>
      </section>
    </div>
  );
};

export default ImagesToPDF;