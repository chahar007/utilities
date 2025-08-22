import React, { useState, useEffect, useCallback } from "react";
import styles from "./Conversion.module.scss";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import UsefulLinks from "../../../shared/UsefulLinks/UsefulLinks";
import QuickTips from "../../../shared/QuickTips/QuickTips";
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { ConversionHelmet } from "../../seo/TabsHelment";

const Conversion = () => {
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

  // Conversion-specific states
  const [selectedFormat, setSelectedFormat] = useState("jpg");
  const [quality, setQuality] = useState(80);

  // Simple function to calculate converted size
  const calculateConvertedSize = useCallback(async () => {
    if (!previewUrl || !selectedFormat || !originalSize) return;
    
    setIsCalculating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let imageDataUrl;
        if (selectedFormat === "jpg") {
          imageDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        } else if (selectedFormat === "png") {
          imageDataUrl = canvas.toDataURL('image/png');
        } else if (selectedFormat === "webp") {
          imageDataUrl = canvas.toDataURL('image/webp', quality / 100);
        }

        const byteString = atob(imageDataUrl.split(',')[1]);
        const newSizeKB = (byteString.length / 1024).toFixed(2);
        
        updateProcessedSize(newSizeKB);
        
        setIsCalculating(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      setIsCalculating(false);
    }
  }, [previewUrl, selectedFormat, quality, originalSize]);

  // Trigger calculation when dependencies change
  useEffect(() => {
    if (previewUrl && selectedFormat && originalSize) {
      calculateConvertedSize();
    }
  }, [previewUrl, selectedFormat, quality, originalSize, calculateConvertedSize]);

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
  }, [baseHandleFileUpload]);

  // Custom reset processor for Conversion specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset conversion-specific states
    setSelectedFormat("jpg");
    setQuality(80);
  }, [baseResetProcessor]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) {
      setError("No image selected for conversion.");
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

      let imageDataUrl;
      if (selectedFormat === "jpg") {
        imageDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      } else if (selectedFormat === "png") {
        imageDataUrl = canvas.toDataURL("image/png");
      } else if (selectedFormat === "webp") {
        imageDataUrl = canvas.toDataURL("image/webp", quality / 100);
      }

      const link = document.createElement("a");
      link.href = imageDataUrl;
      link.download = `${imageDetails.name.split('.')[0]}_converted.${selectedFormat}`;
      link.click();
      
      setSuccessMessage(`🎉 Successfully converted to ${selectedFormat.toUpperCase()} format!`);
      setIsProcessing(false);
    };
    
    img.onerror = () => {
      setError("Error converting image. Please try again.");
      setIsProcessing(false);
    };
  }, [previewUrl, selectedFormat, quality, imageDetails.name]);

  const formatOptions = [
    { value: 'jpg', label: 'JPG', description: 'Best for photos', icon: '📷' },
    { value: 'png', label: 'PNG', description: 'Best for graphics', icon: '🎨' },
    { value: 'webp', label: 'WebP', description: 'Modern format', icon: '🚀' }
  ];

  return (
    <div className={styles.conversion}>
      <ConversionHelmet />
      
      {/* Compact Header */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-exchange-alt"></i>
            Image Format Converter
          </h1>
          <p className={styles.pageDescription}>
            Convert JPG, PNG, WebP formats instantly • 100% Private • Fast & Secure
          </p>
        </div>
      </section>

      <section className={styles.converterSection}>
        <div className={styles.container}>
          
          {/* Progress Indicator */}
          <ProgressIndicator 
            currentStep={currentStep}
            onReset={resetProcessor}
            steps={[
              { number: 1, label: 'Upload' },
              { number: 2, label: 'Convert' },
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

          {/* Upload Step */}
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

          {currentStep >= 2 && previewUrl && (
            <div className={styles.conversionWorkspace}>
              {/* Image Preview */}
              <ImagePreviewPanel 
                previewUrl={previewUrl}
                imageDetails={imageDetails}
                originalSize={originalSize}
                onReset={resetProcessor}
                showComparison={false}
              />

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                {/* Format Selection */}
                <div className={styles.formatSelector}>
                  <label>Convert to:</label>
                  <div className={styles.formatButtons}>
                    {formatOptions.map((format) => (
                      <button
                        key={format.value}
                        className={`${styles.formatBtn} ${selectedFormat === format.value ? styles.active : ''}`}
                        onClick={() => setSelectedFormat(format.value)}
                      >
                        <span className={styles.formatEmoji}>{format.icon}</span>
                        <span className={styles.formatName}>{format.label}</span>
                        <span className={styles.formatDesc}>{format.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Control */}
                {(selectedFormat === "jpg" || selectedFormat === "webp") && (
                  <div className={styles.qualitySelector}>
                    <label>Quality: <strong>{quality}%</strong></label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className={styles.qualitySlider}
                    />
                    <div className={styles.qualityPresets}>
                      <button onClick={() => setQuality(50)} className={quality == 50 ? styles.active : ''}>Web</button>
                      <button onClick={() => setQuality(80)} className={quality == 80 ? styles.active : ''}>Balanced</button>
                      <button onClick={() => setQuality(95)} className={quality == 95 ? styles.active : ''}>High</button>
                    </div>
                  </div>
                )}

                {/* Size Comparison */}
                <SizeComparison
                  originalSize={originalSize}
                  processedSize={processedSize}
                  sizeReduction={sizeReduction}
                  isCalculating={isCalculating}
                  customLabel="Conversion Impact"
                  processedLabel="Converted"
                />

                {/* Convert Button */}
                <ProcessingButton
                  onClick={handleDownload}
                  isProcessing={isProcessing}
                  disabled={!processedSize}
                  defaultText={`Convert & Download ${selectedFormat.toUpperCase()}`}
                  processingText="Converting..."
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

      {/* Useful Links & Quick Tips */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="conversion" />
          <QuickTips currentTool="conversion" />
        </div>
      </section>
    </div>
  );
};

export default Conversion;