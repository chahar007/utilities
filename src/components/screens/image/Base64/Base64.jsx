import React, { useState, useEffect, useCallback } from 'react';
import styles from './Base64.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { Base64Helmet } from '../../seo/TabsHelment';

const Base64 = () => {
  // Use shared image processor hook
  const {
    originalSize,
    processedSize,
    imageDetails,
    previewUrl,
    error,
    successMessage,
    currentStep,
    isProcessing,
    isCalculating,
    handleFileUpload: baseHandleFileUpload,
    resetProcessor: baseResetProcessor,
    setError,
    setSuccessMessage,
    setIsProcessing,
    setOriginalSize,
    setImageDetails,
    setPreviewUrl,
    setCurrentStep
  } = useImageProcessor();
  
  // Base64-specific states
  const [base64String, setBase64String] = useState(null);
  const [outputFormat, setOutputFormat] = useState('dataURL'); // 'dataURL' or 'base64'

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
    setBase64String(null); // Reset Base64-specific state
  }, [baseHandleFileUpload]);

  // Custom reset processor for Base64 specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset Base64-specific states
    setBase64String(null);
    setOutputFormat('dataURL');
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

        // Generate Base64 string based on format preference
        const base64Data = outputFormat === 'dataURL' 
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/png').split(',')[1];
        
        setBase64String(base64Data);
        
        // Calculate Base64 size
        const base64Size = (base64Data.length * 0.75 / 1024).toFixed(2);
        setProcessedSize(base64Size);
        
        // Calculate percentage change
        const original = parseFloat(originalSize);
        const processed = parseFloat(base64Size);
        const reduction = ((original - processed) / original) * 100;
        setSizeReduction(reduction.toFixed(2));
        
        setIsCalculating(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      setIsCalculating(false);
      setError("Error processing image. Please try again.");
    }
  }, [previewUrl, originalSize, outputFormat]);

  const handleDownload = useCallback(() => {
    if (!base64String) {
      setError("No Base64 string to download.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    // Create downloadable text file with Base64 string
    const blob = new Blob([base64String], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${imageDetails.name.split('.')[0]}_base64.txt`;
    link.click();
    
    setSuccessMessage(`🎉 Base64 string saved successfully!`);
    setIsProcessing(false);
  }, [base64String, imageDetails.name]);

  const copyBase64 = useCallback(() => {
    if (!base64String) {
      setError("No Base64 string to copy.");
      return;
    }

    navigator.clipboard.writeText(base64String)
      .then(() => {
        setSuccessMessage("Base64 copied to clipboard!");
      })
      .catch(() => {
        setError("Failed to copy Base64.");
      });
  }, [base64String]);



  // Auto-trigger processing
  useEffect(() => {
    if (previewUrl && originalSize) {
      processImage();
    }
  }, [previewUrl, originalSize, outputFormat, processImage]);

  return (
    <div className={styles.base64}>
      <Base64Helmet />
      
      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-code"></i>
            Base64 Image Converter
          </h1>
          <p className={styles.pageDescription}>
            Convert images to Base64 strings • 100% Private • Fast & Secure
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
                {/* Output Format Selector */}
                <div className={styles.formatSelector}>
                  <label>Output Format:</label>
                  <div className={styles.formatButtons}>
                    <button 
                      className={`${styles.formatBtn} ${outputFormat === 'dataURL' ? styles.active : ''}`}
                      onClick={() => setOutputFormat('dataURL')}
                    >
                      <span className={styles.formatEmoji}>📄</span>
                      <div>
                        <div className={styles.formatName}>Data URL</div>
                        <div className={styles.formatDesc}>Ready to use in HTML/CSS</div>
                      </div>
                    </button>
                    <button 
                      className={`${styles.formatBtn} ${outputFormat === 'base64' ? styles.active : ''}`}
                      onClick={() => setOutputFormat('base64')}
                    >
                      <span className={styles.formatEmoji}>🔤</span>
                      <div>
                        <div className={styles.formatName}>Base64 Only</div>
                        <div className={styles.formatDesc}>String without data prefix</div>
                      </div>
                    </button>
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
                          <span>Base64: {processedSize} KB</span>
                          {sizeReduction && !isCalculating ? (
                            <span className={parseFloat(sizeReduction) > 0 ? styles.increase : styles.reduction}>
                              ({parseFloat(sizeReduction) > 0 ? '+' : ''}{sizeReduction}%)
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

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button 
                    onClick={copyBase64} 
                    className={styles.copyButton}
                    disabled={!base64String}
                  >
                    <i className="fas fa-copy"></i>
                    Copy to Clipboard
                  </button>
                  
                  <ProcessingButton
                    onClick={handleDownload}
                    isProcessing={isProcessing}
                    disabled={!base64String}
                    defaultText="Download as File"
                    processingText="Processing..."
                    icon="fas fa-download"
                    variant="download"
                    size="medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2.5 Base64 Output Display */}
          {base64String && (
            <div className={styles.outputSection}>
              <div className={styles.outputHeader}>
                <h3><i className="fas fa-code"></i> Base64 Output</h3>
                <span className={styles.outputSize}>{processedSize} KB</span>
              </div>
              <div className={styles.base64Container}>
                <textarea
                  className={styles.base64Output}
                  value={base64String}
                  readOnly
                  rows="8"
                  placeholder="Base64 string will appear here..."
                />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. USEFUL SECTION */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="base64-converter" />
          <QuickTips currentTool="base64-converter" />
        </div>
      </section>
    </div>
  );
};

export default Base64;
