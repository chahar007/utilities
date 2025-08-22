import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './RotateImage.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { RotateImageHelmet } from '../../seo/TabsHelment';

const RotateImage = () => {
  // Use shared image processor hook
  const {
    originalSize,
    processedSize,
    sizeReduction,
    imageDetails,
    previewUrl,
    originalImageUrl,
    error,
    successMessage,
    currentStep,
    isProcessing,
    isCalculating,
    handleFileUpload: baseHandleFileUpload,
    updateProcessedSize,
    createDownloadLink,
    resetProcessor: baseResetProcessor,
    setError,
    setSuccessMessage,
    setIsProcessing,
    setIsCalculating
  } = useImageProcessor();
  
  // Rotation-specific states
    const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  // Refs
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
    // Reset rotation-specific states
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  }, [baseHandleFileUpload]);

  // Custom reset processor for Rotation specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset rotation-specific states
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  }, [baseResetProcessor]);

  const processImage = useCallback(async () => {
    if (!previewUrl || !originalSize) return;
    
    setIsCalculating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        
        // Calculate canvas dimensions based on rotation
        if (rotation % 180 !== 0) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Apply transformations
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Apply flips
        const scaleX = flipHorizontal ? -1 : 1;
        const scaleY = flipVertical ? -1 : 1;
        ctx.scale(scaleX, scaleY);
        
        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);
        
        // Draw image
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

        // Convert to data URL and calculate size
        const rotatedImageData = canvas.toDataURL('image/png');
        const byteString = atob(rotatedImageData.split(',')[1]);
        const newSizeKB = (byteString.length / 1024).toFixed(2);
        
        setProcessedSize(newSizeKB);
        
        // Calculate percentage change
        const original = parseFloat(originalSize);
        const processed = parseFloat(newSizeKB);
        const reduction = ((original - processed) / original) * 100;
        setSizeReduction(reduction.toFixed(2));
        
        setIsCalculating(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      setIsCalculating(false);
      setError("Error processing image. Please try again.");
    }
  }, [previewUrl, originalSize, rotation, flipHorizontal, flipVertical]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) {
      setError("No image selected for processing.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    const canvas = canvasRef.current || document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = previewUrl;
    img.onload = () => {
      // Calculate canvas dimensions based on rotation
      if (rotation % 180 !== 0) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      
      // Apply transformations (same as processImage)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Apply flips
      const scaleX = flipHorizontal ? -1 : 1;
      const scaleY = flipVertical ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      
      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);
      
      // Draw image
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

      const rotatedImageData = canvas.toDataURL('image/png');

        const link = document.createElement("a");
      link.href = rotatedImageData;
      link.download = `${imageDetails.name.split('.')[0]}_rotated.png`;
        link.click();
      
      setSuccessMessage(`🎉 Successfully rotated your image!`);
      setIsProcessing(false);
    };
    
    img.onerror = () => {
      setError("Error processing image. Please try again.");
      setIsProcessing(false);
    };
  }, [previewUrl, imageDetails.name, rotation, flipHorizontal, flipVertical]);



  // Rotation functions
  const rotateImage = useCallback((angle) => {
    setRotation(prev => (prev + angle) % 360);
  }, []);

  const setRotationToDegree = useCallback((degree) => {
    setRotation(degree);
  }, []);

  // Auto-trigger processing
  useEffect(() => {
    if (previewUrl && originalSize) {
      processImage();
    }
  }, [previewUrl, originalSize, rotation, flipHorizontal, flipVertical, processImage]);

    return (
    <div className={styles.rotateImage}>
      <RotateImageHelmet />
      
      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-redo"></i>
            Image Rotation Tool
          </h1>
          <p className={styles.pageDescription}>
            Rotate and flip images instantly • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Rotate</span>
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
                acceptedFormats={["image/*"]}
              />
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>Supported: JPG, PNG, WebP, GIF, BMP</span>
                  <span>Max: 10MB</span>
                  <span>🔒 Private & Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* 2.4 Processing Workspace */}
          {currentStep >= 2 && previewUrl && (
            <div className={styles.processingWorkspace}>
              {/* Image Preview Panel */}
              <div className={styles.imagePreview}>
                <div className={styles.previewHeader}>
                  <span className={styles.fileName}>{imageDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change
                  </button>
                </div>
                <div className={styles.imageContainer}>
                        <img
                            ref={imageRef}
                    src={previewUrl} 
                    alt="Preview" 
                    className={styles.previewImage}
                    style={{ 
                      transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div className={styles.imageDetails}>
                    <span>{imageDetails.dimensions}</span>
                    <span>{originalSize >= 1024 ? (originalSize / 1024).toFixed(2) + ' MB' : originalSize + ' KB'}</span>
                    <span>{imageDetails.type}</span>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                {/* Quick Rotation Controls */}
                <div className={styles.quickRotation}>
                  <label>Quick Rotation:</label>
                  <div className={styles.rotationButtons}>
                    <button onClick={() => rotateImage(-90)} className={styles.rotateBtn}>
                      <i className="fas fa-undo"></i>
                      <span>90° Left</span>
                    </button>
                    <button onClick={() => rotateImage(90)} className={styles.rotateBtn}>
                      <i className="fas fa-redo"></i>
                      <span>90° Right</span>
                    </button>
                  </div>
                </div>

                {/* Flip Controls */}
                <div className={styles.flipControls}>
                  <label>Flip Image:</label>
                  <div className={styles.flipButtons}>
                    <button 
                      onClick={() => setFlipHorizontal(!flipHorizontal)}
                      className={`${styles.flipBtn} ${flipHorizontal ? styles.active : ''}`}
                    >
                      <i className="fas fa-arrows-alt-h"></i>
                      <span>Horizontal</span>
                    </button>
                    <button 
                      onClick={() => setFlipVertical(!flipVertical)}
                      className={`${styles.flipBtn} ${flipVertical ? styles.active : ''}`}
                    >
                      <i className="fas fa-arrows-alt-v"></i>
                      <span>Vertical</span>
                    </button>
                  </div>
                </div>

                {/* Precise Rotation */}
                <div className={styles.preciseRotation}>
                  <label>Precise Angle: <strong>{rotation}°</strong></label>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className={styles.rotationSlider}
                  />
                  <div className={styles.anglePresets}>
                    <button onClick={() => setRotationToDegree(0)} className={rotation === 0 ? styles.active : ''}>0°</button>
                    <button onClick={() => setRotationToDegree(90)} className={rotation === 90 ? styles.active : ''}>90°</button>
                    <button onClick={() => setRotationToDegree(180)} className={rotation === 180 ? styles.active : ''}>180°</button>
                    <button onClick={() => setRotationToDegree(270)} className={rotation === 270 ? styles.active : ''}>270°</button>
                  </div>
                </div>

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {processedSize ? (
                        <>
                          <span>Rotated: {processedSize} KB</span>
                          {sizeReduction && !isCalculating ? (
                            <span className={parseFloat(sizeReduction) > 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) > 0 ? '-' : '+'}{Math.abs(parseFloat(sizeReduction)).toFixed(2)}%)
                            </span>
                          ) : (
                            <span className={styles.calculating}>Calculating...</span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Processing...</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button 
                  onClick={handleDownload} 
                  className={styles.rotateButton}
                  disabled={isProcessing || !processedSize}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download"></i>
                      Download Rotated Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

            {/* 3. USEFUL SECTION */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="rotate-image" />
          <QuickTips currentTool="rotate-image" />
        </div>
      </section>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default RotateImage;