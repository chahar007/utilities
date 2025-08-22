import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './BackgroundTools.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { BackgroundToolsHelmet } from '../../seo/TabsHelment';

const BackgroundTools = () => {
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
    setIsCalculating,
    setOriginalImageUrl
  } = useImageProcessor();

  // Refs
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Background tools specific states
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [backgroundMode, setBackgroundMode] = useState('blur'); // 'blur', 'remove', 'replace'
  const [newBackgroundImage, setNewBackgroundImage] = useState(null);
  const [backgroundSettings, setBackgroundSettings] = useState({
    blurIntensity: 15,
    backgroundColor: '#ffffff',
    threshold: 128,
    feathering: 3
  });

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
  }, [baseHandleFileUpload]);

  const handleBackgroundImageUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file for background');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setNewBackgroundImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [setError]);

  const processBackground = useCallback(async () => {
    if (!previewUrl) {
      setError('Please upload an image first');
      return;
    }

    if (backgroundMode === 'replace' && !newBackgroundImage) {
      setError('Please upload a background image for replacement');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Wait for image to load
      await new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      if (backgroundMode === 'blur') {
        await applyBackgroundBlur(ctx, canvas.width, canvas.height);
      } else if (backgroundMode === 'remove') {
        await removeBackground(ctx, canvas.width, canvas.height);
      } else if (backgroundMode === 'replace') {
        await replaceBackground(ctx, canvas.width, canvas.height);
      }

      // Create processed image URL
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedImageUrl(processedDataUrl);
      setOriginalImageUrl(previewUrl);

      // Calculate processed size
      const byteString = atob(processedDataUrl.split(',')[1]);
      const sizeKB = (byteString.length / 1024).toFixed(2);
      updateProcessedSize(sizeKB);

      setIsCalculating(false);
      setSuccessMessage('Background processed successfully!');
    } catch (err) {
      setError('Failed to process background. Please try again.');
      setIsCalculating(false);
    }
  }, [previewUrl, backgroundMode, newBackgroundImage, backgroundSettings, setError, setIsCalculating, setSuccessMessage, updateProcessedSize, setOriginalImageUrl]);

  const applyBackgroundBlur = useCallback(async (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Simple edge detection to identify background areas
    const edges = detectEdges(data, width, height);
    
    // Create blur effect on background areas
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        if (!edges[y * width + x]) { // Background area
          // Apply blur by averaging neighboring pixels
          const blurRadius = Math.floor(backgroundSettings.blurIntensity / 2);
          let r = 0, g = 0, b = 0, count = 0;
          
          for (let dy = -blurRadius; dy <= blurRadius; dy++) {
            for (let dx = -blurRadius; dx <= blurRadius; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                const ni = (ny * width + nx) * 4;
                r += data[ni];
                g += data[ni + 1];
                b += data[ni + 2];
                count++;
              }
            }
          }
          
          if (count > 0) {
            data[index] = r / count;
            data[index + 1] = g / count;
            data[index + 2] = b / count;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [backgroundSettings]);

  const removeBackground = useCallback(async (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Simple background removal using edge detection and threshold
    const edges = detectEdges(data, width, height);
    
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = Math.floor(i / 4);
      
      if (!edges[pixelIndex]) { // Background area
        // Make background transparent
        data[i + 3] = 0; // Alpha channel
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const replaceBackground = useCallback(async (ctx, width, height) => {
    if (!newBackgroundImage) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Load background image
    const bgImg = new Image();
    await new Promise((resolve) => {
      bgImg.onload = resolve;
      bgImg.src = newBackgroundImage;
    });

    // Create background canvas
    const bgCanvas = document.createElement('canvas');
    const bgCtx = bgCanvas.getContext('2d');
    bgCanvas.width = width;
    bgCanvas.height = height;

    // Draw and scale background image
    bgCtx.drawImage(bgImg, 0, 0, width, height);
    const bgData = bgCtx.getImageData(0, 0, width, height).data;

    // Simple background detection and replacement
    const edges = detectEdges(data, width, height);
    
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = Math.floor(i / 4);
      
      if (!edges[pixelIndex]) { // Background area
        // Replace with background image pixels
        data[i] = bgData[i];         // R
        data[i + 1] = bgData[i + 1]; // G
        data[i + 2] = bgData[i + 2]; // B
        // Keep original alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [newBackgroundImage]);

  const detectEdges = useCallback((data, width, height) => {
    const edges = new Array(width * height).fill(false);
    const { threshold } = backgroundSettings;

    // Simple Sobel edge detection
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        // Calculate gradients
        const gx = (
          -1 * getGrayscale(data, x - 1, y - 1, width) +
          1 * getGrayscale(data, x + 1, y - 1, width) +
          -2 * getGrayscale(data, x - 1, y, width) +
          2 * getGrayscale(data, x + 1, y, width) +
          -1 * getGrayscale(data, x - 1, y + 1, width) +
          1 * getGrayscale(data, x + 1, y + 1, width)
        );
        
        const gy = (
          -1 * getGrayscale(data, x - 1, y - 1, width) +
          -2 * getGrayscale(data, x, y - 1, width) +
          -1 * getGrayscale(data, x + 1, y - 1, width) +
          1 * getGrayscale(data, x - 1, y + 1, width) +
          2 * getGrayscale(data, x, y + 1, width) +
          1 * getGrayscale(data, x + 1, y + 1, width)
        );
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        edges[idx] = magnitude > threshold;
      }
    }

    return edges;
  }, [backgroundSettings]);

  const getGrayscale = useCallback((data, x, y, width) => {
    const index = (y * width + x) * 4;
    return (data[index] + data[index + 1] + data[index + 2]) / 3;
  }, []);

  const handleDownload = useCallback(() => {
    if (!processedImageUrl) {
      setError('No processed image to download');
      return;
    }

    setIsProcessing(true);
    const link = createDownloadLink(processedImageUrl, `${imageDetails.name.split('.')[0]}_background_${backgroundMode}.png`);
    link.click();
    
    setSuccessMessage('Processed image downloaded successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsProcessing(false);
  }, [processedImageUrl, createDownloadLink, imageDetails.name, backgroundMode, setError, setIsProcessing, setSuccessMessage]);

  // Custom reset processor
  const resetProcessor = useCallback(() => {
    baseResetProcessor();
    
    // Reset background tools specific states
    setProcessedImageUrl(null);
    setBackgroundMode('blur');
    setNewBackgroundImage(null);
    setBackgroundSettings({
      blurIntensity: 15,
      backgroundColor: '#ffffff',
      threshold: 128,
      feathering: 3
    });
  }, [baseResetProcessor]);

  // Auto-process when settings change
  useEffect(() => {
    if (previewUrl && (backgroundMode !== 'replace' || newBackgroundImage)) {
      const timeoutId = setTimeout(() => {
        processBackground();
      }, 500); // Debounce for performance
      
      return () => clearTimeout(timeoutId);
    }
  }, [previewUrl, backgroundMode, newBackgroundImage, backgroundSettings, processBackground]);

  return (
    <div className={styles.backgroundTools}>
      <BackgroundToolsHelmet />

      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-image"></i>
            Background Tools
          </h1>
          <p className={styles.pageDescription}>
            Remove, blur, or replace image backgrounds • Advanced edge detection • 100% Private
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
              { number: 2, label: 'Process Background' },
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

          {/* Processing Workspace */}
          {currentStep >= 2 && previewUrl && (
            <div className={styles.backgroundWorkspace}>
              {/* Image Preview Panel */}
              <ImagePreviewPanel 
                previewUrl={processedImageUrl || previewUrl}
                originalImageUrl={originalImageUrl}
                imageDetails={imageDetails}
                originalSize={originalSize}
                onReset={resetProcessor}
                showComparison={!!processedImageUrl}
                comparisonTitle="Original vs Background Processed"
              />

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                {/* Background Tool Selection */}
                <div className={styles.toolSelector}>
                  <label>Background Tool:</label>
                  <div className={styles.toolButtons}>
                    <button
                      className={`${styles.toolBtn} ${backgroundMode === 'blur' ? styles.active : ''}`}
                      onClick={() => setBackgroundMode('blur')}
                    >
                      <span className={styles.toolIcon}>🎭</span>
                      <span className={styles.toolName}>Blur</span>
                      <span className={styles.toolDesc}>Blur background</span>
                    </button>
                    <button
                      className={`${styles.toolBtn} ${backgroundMode === 'remove' ? styles.active : ''}`}
                      onClick={() => setBackgroundMode('remove')}
                    >
                      <span className={styles.toolIcon}>✂️</span>
                      <span className={styles.toolName}>Remove</span>
                      <span className={styles.toolDesc}>Make transparent</span>
                    </button>
                    <button
                      className={`${styles.toolBtn} ${backgroundMode === 'replace' ? styles.active : ''}`}
                      onClick={() => setBackgroundMode('replace')}
                    >
                      <span className={styles.toolIcon}>🖼️</span>
                      <span className={styles.toolName}>Replace</span>
                      <span className={styles.toolDesc}>New background</span>
                    </button>
                  </div>
                </div>

                {/* Blur Settings */}
                {backgroundMode === 'blur' && (
                  <div className={styles.blurSettings}>
                    <h4 className={styles.groupTitle}>
                      <i className="fas fa-sliders-h"></i>
                      Blur Settings
                    </h4>
                    
                    <div className={styles.settingGroup}>
                      <label>Blur Intensity: {backgroundSettings.blurIntensity}px</label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={backgroundSettings.blurIntensity}
                        onChange={(e) => setBackgroundSettings(prev => ({
                          ...prev,
                          blurIntensity: parseInt(e.target.value)
                        }))}
                        className={styles.settingSlider}
                      />
                      <div className={styles.sliderLabels}>
                        <span>Light</span>
                        <span>Strong</span>
                      </div>
                    </div>

                    <div className={styles.settingGroup}>
                      <label>Edge Detection: {backgroundSettings.threshold}</label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={backgroundSettings.threshold}
                        onChange={(e) => setBackgroundSettings(prev => ({
                          ...prev,
                          threshold: parseInt(e.target.value)
                        }))}
                        className={styles.settingSlider}
                      />
                      <div className={styles.sliderLabels}>
                        <span>Sensitive</span>
                        <span>Precise</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove Settings */}
                {backgroundMode === 'remove' && (
                  <div className={styles.removeSettings}>
                    <h4 className={styles.groupTitle}>
                      <i className="fas fa-cut"></i>
                      Removal Settings
                    </h4>
                    
                    <div className={styles.settingGroup}>
                      <label>Edge Detection: {backgroundSettings.threshold}</label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={backgroundSettings.threshold}
                        onChange={(e) => setBackgroundSettings(prev => ({
                          ...prev,
                          threshold: parseInt(e.target.value)
                        }))}
                        className={styles.settingSlider}
                      />
                      <div className={styles.sliderLabels}>
                        <span>More Removal</span>
                        <span>Precise Edges</span>
                      </div>
                    </div>

                    <div className={styles.infoBox}>
                      <i className="fas fa-info-circle"></i>
                      <span>Background will be made transparent. Download as PNG to preserve transparency.</span>
                    </div>
                  </div>
                )}

                {/* Replace Settings */}
                {backgroundMode === 'replace' && (
                  <div className={styles.replaceSettings}>
                    <h4 className={styles.groupTitle}>
                      <i className="fas fa-image"></i>
                      Replacement Settings
                    </h4>
                    
                    <div className={styles.uploadRow}>
                      <label>New Background Image:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBackgroundImageUpload(e.target.files[0])}
                        className={styles.fileInput}
                      />
                    </div>

                    {newBackgroundImage && (
                      <div className={styles.backgroundPreview}>
                        <img src={newBackgroundImage} alt="New background" className={styles.previewImg} />
                      </div>
                    )}

                    <div className={styles.settingRow}>
                      <label>Background Color (if no image):</label>
                      <div className={styles.colorRow}>
                        <input
                          type="color"
                          value={backgroundSettings.backgroundColor}
                          onChange={(e) => setBackgroundSettings(prev => ({
                            ...prev,
                            backgroundColor: e.target.value
                          }))}
                          className={styles.colorInput}
                        />
                        <span className={styles.colorValue}>{backgroundSettings.backgroundColor}</span>
                      </div>
                    </div>

                    <div className={styles.settingGroup}>
                      <label>Edge Detection: {backgroundSettings.threshold}</label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={backgroundSettings.threshold}
                        onChange={(e) => setBackgroundSettings(prev => ({
                          ...prev,
                          threshold: parseInt(e.target.value)
                        }))}
                        className={styles.settingSlider}
                      />
                      <div className={styles.sliderLabels}>
                        <span>More Replacement</span>
                        <span>Precise Edges</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {isCalculating && (
                  <div className={styles.processingStatus}>
                    <div className={styles.spinner}></div>
                    <span>Processing background...</span>
                  </div>
                )}

                {/* Size Comparison */}
                <SizeComparison
                  originalSize={originalSize}
                  processedSize={processedSize}
                  sizeReduction={sizeReduction}
                  isCalculating={isCalculating}
                  customLabel="Processing Impact"
                  processedLabel="Processed"
                />

                {/* Download Button */}
                <ProcessingButton
                  onClick={handleDownload}
                  isProcessing={isProcessing}
                  disabled={!processedImageUrl}
                  defaultText={`Download ${backgroundMode === 'blur' ? 'Blurred' : backgroundMode === 'remove' ? 'Transparent' : 'Processed'} Image`}
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
          <UsefulLinks currentTool="background-tools" />
          <QuickTips currentTool="background-tools" />
        </div>
      </section>

      {/* Hidden elements for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img ref={imageRef} src={previewUrl} alt="" style={{ display: "none" }} onLoad={() => {}} />
    </div>
  );
};

export default BackgroundTools;
