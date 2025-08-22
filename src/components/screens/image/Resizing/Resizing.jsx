import React, { useState, useEffect, useCallback } from 'react';
import styles from './Resizing.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { ResizingHelmet } from '../../seo/TabsHelment';

const Resizing = () => {
  // Use shared image processor hook
  const {
    originalSize,
    processedSize,
    sizeReduction,
    imageDetails,
    previewUrl,
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
  
  // Resizing-specific states
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState('dimensions'); // 'dimensions' or 'percentage'
  const [scalePercentage, setScalePercentage] = useState(50);

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
  }, [baseHandleFileUpload]);

  // Custom reset processor for Resizing specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset resizing-specific states
    setTargetWidth('');
    setTargetHeight('');
    setMaintainAspectRatio(true);
    setResizeMode('dimensions');
    setScalePercentage(50);
  }, [baseResetProcessor]);

  const processImage = useCallback(async () => {
    if (!previewUrl || !originalSize) return;
    
    setIsCalculating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let newWidth, newHeight;
        
        if (resizeMode === 'percentage') {
          newWidth = Math.round(img.width * (scalePercentage / 100));
          newHeight = Math.round(img.height * (scalePercentage / 100));
        } else {
          newWidth = parseInt(targetWidth) || img.width;
          newHeight = parseInt(targetHeight) || img.height;
          
          if (maintainAspectRatio && targetWidth && targetHeight) {
            const aspectRatio = img.width / img.height;
            if (newWidth / newHeight > aspectRatio) {
              newWidth = Math.round(newHeight * aspectRatio);
            } else {
              newHeight = Math.round(newWidth / aspectRatio);
            }
          }
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to data URL and calculate size
        const resizedImageData = canvas.toDataURL('image/jpeg', 0.9);
        const byteString = atob(resizedImageData.split(',')[1]);
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
  }, [previewUrl, originalSize, targetWidth, targetHeight, maintainAspectRatio, resizeMode, scalePercentage]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) {
      setError("No image selected for processing.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = previewUrl;
    img.onload = () => {
      // Calculate new dimensions (same logic as processImage)
      let newWidth, newHeight;
      
      if (resizeMode === 'percentage') {
        newWidth = Math.round(img.width * (scalePercentage / 100));
        newHeight = Math.round(img.height * (scalePercentage / 100));
      } else {
        newWidth = parseInt(targetWidth) || img.width;
        newHeight = parseInt(targetHeight) || img.height;
        
        if (maintainAspectRatio && targetWidth && targetHeight) {
          const aspectRatio = img.width / img.height;
          if (newWidth / newHeight > aspectRatio) {
            newWidth = Math.round(newHeight * aspectRatio);
          } else {
            newHeight = Math.round(newWidth / aspectRatio);
          }
        }
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const resizedImageData = canvas.toDataURL('image/jpeg', 0.9);

      const link = document.createElement("a");
      link.href = resizedImageData;
      link.download = `${imageDetails.name.split('.')[0]}_resized.jpg`;
      link.click();
      
      setSuccessMessage(`🎉 Successfully resized your image!`);
      setIsProcessing(false);
    };
    
    img.onerror = () => {
      setError("Error processing image. Please try again.");
      setIsProcessing(false);
    };
  }, [previewUrl, imageDetails.name, targetWidth, targetHeight, maintainAspectRatio, resizeMode, scalePercentage]);



  const handlePresetSize = useCallback((preset) => {
    if (!previewUrl) return;
    
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      
      switch (preset) {
        case 'social':
          setTargetWidth(1200);
          setTargetHeight(Math.round(1200 / aspectRatio));
          break;
        case 'web':
          setTargetWidth(800);
          setTargetHeight(Math.round(800 / aspectRatio));
          break;
        case 'thumbnail':
          setTargetWidth(300);
          setTargetHeight(Math.round(300 / aspectRatio));
          break;
        case 'half':
          setScalePercentage(50);
          setResizeMode('percentage');
          break;
        default:
          break;
      }
    };
    img.src = previewUrl;
  }, [previewUrl]);

  // Auto-trigger processing
  useEffect(() => {
    if (previewUrl && originalSize && (targetWidth || targetHeight || resizeMode === 'percentage')) {
      processImage();
    }
  }, [previewUrl, originalSize, targetWidth, targetHeight, maintainAspectRatio, resizeMode, scalePercentage, processImage]);

  return (
    <div className={styles.resizing}>
      <ResizingHelmet />

      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-expand-arrows-alt"></i>
            Image Resizing Tool
          </h1>
          <p className={styles.pageDescription}>
            Resize images to any dimension • 100% Private • Fast & Secure
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
                <span className={styles.stepLabel}>Resize</span>
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
                  <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                  <div className={styles.imageDetails}>
                    <span>{imageDetails.dimensions}</span>
                    <span>{originalSize >= 1024 ? (originalSize / 1024).toFixed(2) + ' MB' : originalSize + ' KB'}</span>
                    <span>{imageDetails.type}</span>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                {/* Resize Mode Selector */}
                <div className={styles.modeSelector}>
                  <label>Resize Method:</label>
                  <div className={styles.modeButtons}>
                    <button 
                      className={`${styles.modeBtn} ${resizeMode === 'dimensions' ? styles.active : ''}`}
                      onClick={() => setResizeMode('dimensions')}
                    >
                      <span className={styles.modeEmoji}>📐</span>
                      <div>
                        <div className={styles.modeName}>Dimensions</div>
                        <div className={styles.modeDesc}>Set width & height</div>
                      </div>
                    </button>
                    <button 
                      className={`${styles.modeBtn} ${resizeMode === 'percentage' ? styles.active : ''}`}
                      onClick={() => setResizeMode('percentage')}
                    >
                      <span className={styles.modeEmoji}>📊</span>
                      <div>
                        <div className={styles.modeName}>Percentage</div>
                        <div className={styles.modeDesc}>Scale by percentage</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Dimension Controls */}
                {resizeMode === 'dimensions' && (
                  <div className={styles.dimensionControls}>
                    <div className={styles.dimensionInputs}>
                      <div className={styles.inputGroup}>
                        <label>Width (px):</label>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(e.target.value)}
                          placeholder="Width"
                          className={styles.dimensionInput}
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Height (px):</label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(e.target.value)}
                          placeholder="Height"
                          className={styles.dimensionInput}
                        />
                      </div>
            </div>

                    <div className={styles.aspectRatioToggle}>
                      <label>
                        <input
                          type="checkbox"
                          checked={maintainAspectRatio}
                          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        />
                        <span>Maintain aspect ratio</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Percentage Controls */}
                {resizeMode === 'percentage' && (
                  <div className={styles.percentageControls}>
                    <label>Scale: <strong>{scalePercentage}%</strong></label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={scalePercentage}
                      onChange={(e) => setScalePercentage(e.target.value)}
                      className={styles.percentageSlider}
                    />
                  </div>
                )}

                {/* Quick Presets */}
                <div className={styles.presetsSection}>
                  <label>Quick Presets:</label>
                  <div className={styles.presetButtons}>
                    <button onClick={() => handlePresetSize('social')}>Social Media</button>
                    <button onClick={() => handlePresetSize('web')}>Web</button>
                    <button onClick={() => handlePresetSize('thumbnail')}>Thumbnail</button>
                    <button onClick={() => handlePresetSize('half')}>50%</button>
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
                          <span>Resized: {processedSize} KB</span>
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
                  className={styles.resizeButton}
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
                      Download Resized Image
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
          <UsefulLinks currentTool="resizing" />
          <QuickTips currentTool="resizing" />
        </div>
      </section>
    </div>
  );
};

export default Resizing;