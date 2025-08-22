import React, { useState, useEffect, useCallback } from 'react';
import styles from './Compression.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { CompressionHelmet } from '../../seo/TabsHelment';

const Compression = () => {
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
    setIsCalculating,
    setOriginalSize,
    setImageDetails,
    setPreviewUrl,
    setCurrentStep
  } = useImageProcessor();
  
  // Compression-specific states
  const [quality, setQuality] = useState(80);
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
  }, [baseHandleFileUpload]);

  // Custom reset processor for Compression specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset compression-specific states
    setQuality(80);
    setCompressionLevel('medium');
  }, [baseResetProcessor]);

  const processImage = useCallback(async () => {
    if (!previewUrl || !originalSize) return;
    
    setIsCalculating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Apply compression based on quality setting
        const compressedImageData = canvas.toDataURL('image/jpeg', quality / 100);
        
        // Calculate new size
        const byteString = atob(compressedImageData.split(',')[1]);
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
  }, [previewUrl, originalSize, quality]);

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
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Apply compression with current quality setting
      const compressedImageData = canvas.toDataURL('image/jpeg', quality / 100);

      const link = document.createElement("a");
      link.href = compressedImageData;
      link.download = `${imageDetails.name.split('.')[0]}_compressed.jpg`;
      link.click();
      
      setSuccessMessage(`🎉 Successfully compressed your image!`);
      setIsProcessing(false);
    };
    
    img.onerror = () => {
      setError("Error processing image. Please try again.");
      setIsProcessing(false);
    };
  }, [previewUrl, imageDetails.name, quality]);



  const setQualityPreset = useCallback((preset) => {
    switch (preset) {
      case 'low':
        setQuality(50);
        setCompressionLevel('low');
        break;
      case 'medium':
        setQuality(80);
        setCompressionLevel('medium');
        break;
      case 'high':
        setQuality(95);
        setCompressionLevel('high');
        break;
      default:
        setCompressionLevel('custom');
    }
  }, []);

  // Auto-trigger processing
  useEffect(() => {
    if (previewUrl && originalSize) {
      processImage();
    }
  }, [previewUrl, originalSize, quality, processImage]);

  return (
    <div className={styles.compression}>
      <CompressionHelmet />
      
      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-compress-alt"></i>
            Image Compression Tool
          </h1>
          <p className={styles.pageDescription}>
            Compress images to reduce file size • 100% Private • Fast & Secure
          </p>
        </div>
      </section>

      {/* 2. MAIN PROCESSING SECTION */}
      <section className={styles.processingSection}>
        <div className={styles.container}>
          
          {/* Progress Indicator */}
          <ProgressIndicator 
            currentStep={currentStep}
            onReset={resetProcessor}
            steps={[
              { number: 1, label: 'Upload' },
              { number: 2, label: 'Compress' },
              { number: 3, label: 'Download' }
            ]}
          />

          {/* Alert Messages */}
          <AlertMessage 
            type="error"
            message={error}
            onClose={() => setError(null)}
            closeable={true}
          />
          
          <AlertMessage 
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
            closeable={true}
            autoClose={true}
          />

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
              <ImagePreviewPanel 
                previewUrl={previewUrl}
                imageDetails={imageDetails}
                originalSize={originalSize}
                onReset={resetProcessor}
                showComparison={false}
              />

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                {/* Quality Selector */}
                <div className={styles.qualitySelector}>
                  <label>Quality: <strong>{quality}%</strong></label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => {
                      setQuality(e.target.value);
                      setCompressionLevel('custom');
                    }}
                    className={styles.qualitySlider}
                  />
                  <div className={styles.qualityPresets}>
                    <button 
                      className={compressionLevel === 'low' ? styles.active : ''}
                      onClick={() => setQualityPreset('low')}
                    >
                      Low (50%)
                    </button>
                    <button 
                      className={compressionLevel === 'medium' ? styles.active : ''}
                      onClick={() => setQualityPreset('medium')}
                    >
                      Medium (80%)
                    </button>
                    <button 
                      className={compressionLevel === 'high' ? styles.active : ''}
                      onClick={() => setQualityPreset('high')}
                    >
                      High (95%)
                    </button>
                  </div>
                </div>

                {/* Size Comparison */}
                <SizeComparison
                  originalSize={originalSize}
                  processedSize={processedSize}
                  sizeReduction={sizeReduction}
                  isCalculating={isCalculating}
                  customLabel="Compression Impact"
                />

                {/* Action Button */}
                <ProcessingButton
                  onClick={handleDownload}
                  isProcessing={isProcessing}
                  disabled={!processedSize}
                  defaultText="Download Compressed Image"
                  processingText="Processing..."
                  icon="fas fa-download"
                  variant="download"
                  size="medium"
                  fullWidth={true}
                />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. USEFUL SECTION */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="compression" />
          <QuickTips currentTool="compression" />
        </div>
      </section>
    </div>
  );
};

export default Compression;