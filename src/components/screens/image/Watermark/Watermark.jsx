import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Watermark.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { WatermarkHelmet } from '../../seo/TabsHelment';

const Watermark = () => {
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
    setPreviewUrl,
    setOriginalImageUrl
  } = useImageProcessor();

  // Refs
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const watermarkImageRef = useRef(null);

  // Processed image state
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  // Watermark-specific states
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
  const [watermarkText, setWatermarkText] = useState('Sample Watermark');
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [watermarkSettings, setWatermarkSettings] = useState({
    position: 'bottom-right',
    opacity: 70,
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'Arial',
    padding: 30,
    scale: 100
  });

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
  }, [baseHandleFileUpload]);

  const handleWatermarkImageUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file for watermark');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setWatermarkImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [setError]);

  const applyWatermark = useCallback(async () => {
    if (!previewUrl) {
      setError('Please upload an image first');
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      setError('Please enter watermark text');
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      setError('Please upload a watermark image');
      return;
    }

    setIsCalculating(true);

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

      // Set canvas dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Calculate position
      const { x, y } = calculateWatermarkPosition(canvas.width, canvas.height);

      // Set opacity
      ctx.globalAlpha = watermarkSettings.opacity / 100;

      if (watermarkType === 'text') {
        // Apply text watermark
        ctx.font = `${watermarkSettings.fontSize}px ${watermarkSettings.fontFamily}`;
        ctx.fillStyle = watermarkSettings.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(watermarkText, x, y);
      } else if (watermarkType === 'image' && watermarkImage) {
        // Apply image watermark
        const watermarkImg = new Image();
        await new Promise((resolve) => {
          watermarkImg.onload = resolve;
          watermarkImg.src = watermarkImage;
        });

        const scale = watermarkSettings.scale / 100;
        const watermarkWidth = watermarkImg.width * scale;
        const watermarkHeight = watermarkImg.height * scale;

        ctx.drawImage(
          watermarkImg,
          x - watermarkWidth / 2,
          y - watermarkHeight / 2,
          watermarkWidth,
          watermarkHeight
        );
      }

      // Reset opacity
      ctx.globalAlpha = 1;

      // Create processed image URL
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedImageUrl(processedDataUrl);
      setOriginalImageUrl(previewUrl);

      // Calculate processed size
      const byteString = atob(processedDataUrl.split(',')[1]);
      const sizeKB = (byteString.length / 1024).toFixed(2);
      updateProcessedSize(sizeKB);

      setIsCalculating(false);
      setSuccessMessage('Watermark applied successfully!');
    } catch (err) {
      setError('Failed to apply watermark. Please try again.');
      setIsCalculating(false);
    }
  }, [previewUrl, watermarkType, watermarkText, watermarkImage, watermarkSettings, setError, setIsCalculating, setSuccessMessage, updateProcessedSize, setOriginalImageUrl]);

  const calculateWatermarkPosition = useCallback((canvasWidth, canvasHeight) => {
    const { position, padding } = watermarkSettings;
    
    switch (position) {
      case 'top-left':
        return { x: padding, y: padding };
      case 'top-center':
        return { x: canvasWidth / 2, y: padding };
      case 'top-right':
        return { x: canvasWidth - padding, y: padding };
      case 'center-left':
        return { x: padding, y: canvasHeight / 2 };
      case 'center':
        return { x: canvasWidth / 2, y: canvasHeight / 2 };
      case 'center-right':
        return { x: canvasWidth - padding, y: canvasHeight / 2 };
      case 'bottom-left':
        return { x: padding, y: canvasHeight - padding };
      case 'bottom-center':
        return { x: canvasWidth / 2, y: canvasHeight - padding };
      case 'bottom-right':
      default:
        return { x: canvasWidth - padding, y: canvasHeight - padding };
    }
  }, [watermarkSettings]);

  const handleDownload = useCallback(() => {
    if (!processedImageUrl) {
      setError('No watermarked image to download');
      return;
    }

    setIsProcessing(true);
    const link = createDownloadLink(processedImageUrl, `${imageDetails.name.split('.')[0]}_watermarked.png`);
    link.click();
    
    setSuccessMessage('Watermarked image downloaded successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsProcessing(false);
  }, [processedImageUrl, createDownloadLink, imageDetails.name, setError, setIsProcessing, setSuccessMessage]);

  // Custom reset processor for Watermark specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset watermark-specific states
    setProcessedImageUrl(null);
    setWatermarkType('text');
    setWatermarkText('Sample Watermark');
    setWatermarkImage(null);
    setWatermarkSettings({
      position: 'bottom-right',
      opacity: 70,
      fontSize: 32,
      color: '#ffffff',
      fontFamily: 'Arial',
      padding: 30,
      scale: 100
    });
  }, [baseResetProcessor]);

  // Auto-apply watermark when settings change
  useEffect(() => {
    if (previewUrl && (watermarkText.trim() || watermarkImage)) {
      const timeoutId = setTimeout(() => {
        applyWatermark();
      }, 500); // Debounce for performance
      
      return () => clearTimeout(timeoutId);
    }
  }, [previewUrl, watermarkText, watermarkImage, watermarkSettings, applyWatermark]);

  return (
    <div className={styles.watermark}>
      <WatermarkHelmet />

      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-shield-alt"></i>
            Image Watermarking Tool
          </h1>
          <p className={styles.pageDescription}>
            Protect your images with custom watermarks • Text & Logo support • 100% Private
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
              { number: 2, label: 'Add Watermark' },
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
            <div className={styles.watermarkWorkspace}>
              {/* Image Preview Panel */}
              <ImagePreviewPanel 
                previewUrl={processedImageUrl || previewUrl}
                originalImageUrl={originalImageUrl}
                imageDetails={imageDetails}
                originalSize={originalSize}
                onReset={resetProcessor}
                showComparison={!!processedImageUrl}
                comparisonTitle="Original vs Watermarked"
              />

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                {/* Watermark Type Selection */}
                <div className={styles.watermarkSelector}>
                  <label>Watermark Type:</label>
                  <div className={styles.typeButtons}>
                    <button
                      className={`${styles.typeBtn} ${watermarkType === 'text' ? styles.active : ''}`}
                      onClick={() => setWatermarkType('text')}
                    >
                      <span className={styles.typeIcon}>🔤</span>
                      <span className={styles.typeName}>Text</span>
                      <span className={styles.typeDesc}>Add custom text</span>
                    </button>
                    <button
                      className={`${styles.typeBtn} ${watermarkType === 'image' ? styles.active : ''}`}
                      onClick={() => setWatermarkType('image')}
                    >
                      <span className={styles.typeIcon}>🖼️</span>
                      <span className={styles.typeName}>Logo</span>
                      <span className={styles.typeDesc}>Upload image/logo</span>
                    </button>
                  </div>
                </div>

                {/* Text Settings */}
                {watermarkType === 'text' && (
                  <>
                    <div className={styles.textInput}>
                      <label>Watermark Text:</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Enter your watermark text"
                        className={styles.textField}
                      />
                    </div>

                    <div className={styles.settingsGrid}>
                      <div className={styles.settingGroup}>
                        <label>Font Size: <strong>{watermarkSettings.fontSize}px</strong></label>
                        <input
                          type="range"
                          min="12"
                          max="100"
                          value={watermarkSettings.fontSize}
                          onChange={(e) => setWatermarkSettings(prev => ({
                            ...prev,
                            fontSize: parseInt(e.target.value)
                          }))}
                          className={styles.fontSlider}
                        />
                        <div className={styles.sliderPresets}>
                          <button onClick={() => setWatermarkSettings(prev => ({...prev, fontSize: 16}))} className={watermarkSettings.fontSize === 16 ? styles.active : ''}>Small</button>
                          <button onClick={() => setWatermarkSettings(prev => ({...prev, fontSize: 32}))} className={watermarkSettings.fontSize === 32 ? styles.active : ''}>Medium</button>
                          <button onClick={() => setWatermarkSettings(prev => ({...prev, fontSize: 48}))} className={watermarkSettings.fontSize === 48 ? styles.active : ''}>Large</button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.settingRow}>
                      <label>Font & Color:</label>
                      <div className={styles.fontRow}>
                        <select 
                          value={watermarkSettings.fontFamily} 
                          onChange={(e) => setWatermarkSettings(prev => ({
                            ...prev,
                            fontFamily: e.target.value
                          }))}
                          className={styles.fontSelect}
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Impact">Impact</option>
                        </select>
                        <input
                          type="color"
                          value={watermarkSettings.color}
                          onChange={(e) => setWatermarkSettings(prev => ({
                            ...prev,
                            color: e.target.value
                          }))}
                          className={styles.colorInput}
                        />
                        <span className={styles.colorValue}>{watermarkSettings.color}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Logo/Image Settings */}
                {watermarkType === 'image' && (
                  <>
                    <div className={styles.uploadSection}>
                      <label>Upload Logo/Image:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleWatermarkImageUpload(e.target.files[0])}
                        className={styles.fileInput}
                      />
                      {watermarkImage && (
                        <div className={styles.watermarkPreview}>
                          <img src={watermarkImage} alt="Watermark" className={styles.previewImg} />
                        </div>
                      )}
                    </div>

                    <div className={styles.settingGroup}>
                      <label>Logo Size: <strong>{watermarkSettings.scale}%</strong></label>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={watermarkSettings.scale}
                        onChange={(e) => setWatermarkSettings(prev => ({
                          ...prev,
                          scale: parseInt(e.target.value)
                        }))}
                        className={styles.sizeSlider}
                      />
                      <div className={styles.sliderPresets}>
                        <button onClick={() => setWatermarkSettings(prev => ({...prev, scale: 50}))} className={watermarkSettings.scale === 50 ? styles.active : ''}>Small</button>
                        <button onClick={() => setWatermarkSettings(prev => ({...prev, scale: 100}))} className={watermarkSettings.scale === 100 ? styles.active : ''}>Normal</button>
                        <button onClick={() => setWatermarkSettings(prev => ({...prev, scale: 150}))} className={watermarkSettings.scale === 150 ? styles.active : ''}>Large</button>
                      </div>
                    </div>
                  </>
                )}

                {/* Position & Appearance */}
                <div className={styles.positionSelector}>
                  <label>Position:</label>
                  <div className={styles.positionGrid}>
                    {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((position) => (
                      <button
                        key={position}
                        className={`${styles.positionBtn} ${watermarkSettings.position === position ? styles.active : ''}`}
                        onClick={() => setWatermarkSettings(prev => ({
                          ...prev,
                          position: position
                        }))}
                        title={position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      >
                        <div className={`${styles.positionDot} ${styles[position.replace('-', '')]}`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.settingsGrid}>
                  <div className={styles.settingGroup}>
                    <label>Opacity: <strong>{watermarkSettings.opacity}%</strong></label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={watermarkSettings.opacity}
                      onChange={(e) => setWatermarkSettings(prev => ({
                        ...prev,
                        opacity: parseInt(e.target.value)
                      }))}
                      className={styles.opacitySlider}
                    />
                    <div className={styles.sliderPresets}>
                      <button onClick={() => setWatermarkSettings(prev => ({...prev, opacity: 30}))} className={watermarkSettings.opacity === 30 ? styles.active : ''}>Subtle</button>
                      <button onClick={() => setWatermarkSettings(prev => ({...prev, opacity: 70}))} className={watermarkSettings.opacity === 70 ? styles.active : ''}>Balanced</button>
                      <button onClick={() => setWatermarkSettings(prev => ({...prev, opacity: 100}))} className={watermarkSettings.opacity === 100 ? styles.active : ''}>Bold</button>
                    </div>
                  </div>
                </div>

                {/* Size Comparison */}
                <SizeComparison
                  originalSize={originalSize}
                  processedSize={processedSize}
                  sizeReduction={sizeReduction}
                  isCalculating={isCalculating}
                  customLabel="Watermark Impact"
                  processedLabel="Watermarked"
                />

                {/* Apply & Download Button */}
                <ProcessingButton
                  onClick={handleDownload}
                  isProcessing={isProcessing}
                  disabled={!processedImageUrl}
                  defaultText={`Download Watermarked Image`}
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
          <UsefulLinks currentTool="watermark" />
          <QuickTips currentTool="watermark" />
        </div>
      </section>

      {/* Hidden elements for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img ref={imageRef} src={previewUrl} alt="" style={{ display: "none" }} onLoad={() => {}} />
    </div>
  );
};

export default Watermark;
