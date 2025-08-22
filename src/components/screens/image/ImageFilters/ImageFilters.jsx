import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ImageFilters.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { ImageFiltersHelmet } from '../../seo/TabsHelment';

const ImageFilters = () => {
  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);

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
    startProcessing,
    stopProcessing,
    startCalculating,
    stopCalculating,
    showError,
    showSuccess,
    setError,
    setSuccessMessage,
    setIsProcessing,
    setIsCalculating,
    setOriginalSize,
    setImageDetails,
    setPreviewUrl,
    setCurrentStep,
    setOriginalImageUrl,
    setProcessedSize,
    setSizeReduction
  } = useImageProcessor();

  // Filter-specific states
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    opacity: 100
  });
  const [selectedPreset, setSelectedPreset] = useState('none');

  // Filter presets
  const filterPresets = {
    none: { brightness: 100, contrast: 100, saturation: 100, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, opacity: 100 },
    vintage: { brightness: 110, contrast: 95, saturation: 80, blur: 0, sepia: 30, grayscale: 0, hueRotate: 15, opacity: 100 },
    blackwhite: { brightness: 100, contrast: 110, saturation: 0, blur: 0, sepia: 0, grayscale: 100, hueRotate: 0, opacity: 100 },
    sepia: { brightness: 110, contrast: 90, saturation: 80, blur: 0, sepia: 100, grayscale: 0, hueRotate: 0, opacity: 100 },
    vibrant: { brightness: 105, contrast: 120, saturation: 140, blur: 0, sepia: 0, grayscale: 0, hueRotate: 0, opacity: 100 },
    soft: { brightness: 115, contrast: 85, saturation: 90, blur: 1, sepia: 10, grayscale: 0, hueRotate: 0, opacity: 95 },
    cool: { brightness: 95, contrast: 105, saturation: 110, blur: 0, sepia: 0, grayscale: 0, hueRotate: 180, opacity: 100 },
    warm: { brightness: 110, contrast: 95, saturation: 105, blur: 0, sepia: 20, grayscale: 0, hueRotate: 30, opacity: 100 }
  };

  const handleFileUpload = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please select an image under 10MB');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Store original image data
        originalImageRef.current = img;
        
        // Set image details
        setImageDetails({
          name: file.name,
          dimensions: `${img.width} × ${img.height}`,
          type: file.type.split('/')[1].toUpperCase(),
        });

        // Calculate original size
        const sizeInKB = Math.round(file.size / 1024);
        setOriginalSize(sizeInKB);

        // Create preview URL
        setPreviewUrl(e.target.result);
        setOriginalImageUrl(e.target.result);
        
        // Move to step 2
        setCurrentStep(2);
        setIsProcessing(false);
        
        // Apply initial filters after a short delay
        setTimeout(() => {
          applyFilters();
        }, 100);
      };
      
      img.onerror = () => {
        setError('Failed to load image. Please try a different file.');
        setIsProcessing(false);
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setIsProcessing(false);
    };
    
    reader.readAsDataURL(file);
  }, []);

  const applyFilters = useCallback(() => {
    if (!originalImageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = originalImageRef.current;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply CSS filters to the canvas context
    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
      hue-rotate(${filters.hueRotate}deg)
      opacity(${filters.opacity}%)
    `;

    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0);

    // Create filtered image URL for preview
    canvas.toBlob((blob) => {
      if (blob) {
        const filteredUrl = URL.createObjectURL(blob);
        setPreviewUrl(filteredUrl);
        
        // Calculate processed size
        const sizeInKB = Math.round(blob.size / 1024);
        setProcessedSize(sizeInKB);
        
        if (originalSize) {
          const reduction = ((originalSize - sizeInKB) / originalSize * 100).toFixed(1);
          setSizeReduction(reduction);
        }
        
        setCurrentStep(3);
      }
    }, imageDetails.type === 'PNG' ? 'image/png' : 'image/jpeg', 0.9);
  }, [filters, originalSize, imageDetails.type]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setSelectedPreset('none'); // Reset preset when manually adjusting
  }, []);

  const applyPreset = useCallback((presetName) => {
    setSelectedPreset(presetName);
    setFilters(filterPresets[presetName]);
  }, [filterPresets]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      const fileName = imageDetails.name.replace(/\.[^/.]+$/, '') + '_filtered.' + (imageDetails.type === 'PNG' ? 'png' : 'jpg');
      
      link.download = fileName;
      link.href = canvas.toDataURL(imageDetails.type === 'PNG' ? 'image/png' : 'image/jpeg', 0.9);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMessage('Image downloaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to download image. Please try again.');
    }
    
    setIsProcessing(false);
  }, [imageDetails]);

  // Custom reset processor for ImageFilters specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset filter-specific states
    setFilters(filterPresets.none);
    setSelectedPreset('none');
    
    // Clear refs
    originalImageRef.current = null;
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [baseResetProcessor, filterPresets]);

  // Auto-apply filters when they change
  useEffect(() => {
    if (originalImageRef.current && currentStep >= 2) {
      const timeoutId = setTimeout(() => {
        applyFilters();
      }, 150); // Debounce for performance
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters, applyFilters, currentStep]);

  return (
    <div className={styles.imageFilters}>
      <ImageFiltersHelmet />

      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-magic"></i>
            Image Filters & Effects
          </h1>
          <p className={styles.pageDescription}>
            Apply stunning filters and effects • Real-time preview • 100% Private
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
              { number: 2, label: 'Apply Filters' },
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
            <div className={styles.processingWorkspace}>
              {/* Image Preview Panel */}
              <ImagePreviewPanel 
                previewUrl={previewUrl}
                originalImageUrl={originalImageUrl}
                imageDetails={imageDetails}
                originalSize={originalSize}
                onReset={resetProcessor}
                showComparison={true}
                comparisonTitle="Original vs Filtered"
              />

              {/* Filter Controls Panel */}
              <div className={styles.filtersPanel}>
                {/* Filter Presets */}
                <div className={styles.presetsSection}>
                  <label>Filter Presets:</label>
                  <div className={styles.presetButtons}>
                    {Object.entries(filterPresets).map(([presetName, presetValues]) => (
                      <button
                        key={presetName}
                        className={`${styles.presetBtn} ${selectedPreset === presetName ? styles.active : ''}`}
                        onClick={() => applyPreset(presetName)}
                      >
                        {presetName === 'none' ? 'Original' : 
                         presetName === 'blackwhite' ? 'B&W' :
                         presetName.charAt(0).toUpperCase() + presetName.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Controls - Compact Grid Layout */}
                <div className={styles.controlsSection}>
                  {/* Basic Controls Row */}
                  <div className={styles.controlsGroup}>
                    <h4 className={styles.groupTitle}>
                      <i className="fas fa-sliders-h"></i>
                      Basic Adjustments
                    </h4>
                    <div className={styles.controlsRow}>
                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-sun"></i>
                          Brightness
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={filters.brightness}
                          onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.brightness}%</span>
                      </div>

                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-adjust"></i>
                          Contrast
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={filters.contrast}
                          onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.contrast}%</span>
                      </div>
                    </div>

                    <div className={styles.controlsRow}>
                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-tint"></i>
                          Saturation
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={filters.saturation}
                          onChange={(e) => handleFilterChange('saturation', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.saturation}%</span>
                      </div>

                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-eye-slash"></i>
                          Blur
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={filters.blur}
                          onChange={(e) => handleFilterChange('blur', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.blur}px</span>
                      </div>
                    </div>
                  </div>

                  {/* Effects Controls Row */}
                  <div className={styles.controlsGroup}>
                    <h4 className={styles.groupTitle}>
                      <i className="fas fa-magic"></i>
                      Creative Effects
                    </h4>
                    <div className={styles.controlsRow}>
                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-camera-retro"></i>
                          Sepia
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.sepia}
                          onChange={(e) => handleFilterChange('sepia', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.sepia}%</span>
                      </div>

                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-palette"></i>
                          Grayscale
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.grayscale}
                          onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.grayscale}%</span>
                      </div>
                    </div>

                    <div className={styles.controlsRow}>
                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-sync-alt"></i>
                          Hue Rotate
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={filters.hueRotate}
                          onChange={(e) => handleFilterChange('hueRotate', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.hueRotate}°</span>
                      </div>

                      <div className={styles.filterControl}>
                        <label>
                          <i className="fas fa-eye"></i>
                          Opacity
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.opacity}
                          onChange={(e) => handleFilterChange('opacity', parseInt(e.target.value))}
                          className={styles.filterSlider}
                        />
                        <span className={styles.valueDisplay}>{filters.opacity}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Comparison */}
                {originalSize && processedSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize >= 1024 ? (originalSize / 1024).toFixed(2) + ' MB' : originalSize + ' KB'}</span>
                      <span>→</span>
                      <span>Filtered: {processedSize >= 1024 ? (processedSize / 1024).toFixed(2) + ' MB' : processedSize + ' KB'}</span>
                      {sizeReduction && (
                        <span className={parseFloat(sizeReduction) > 0 ? styles.increase : styles.reduction}>
                          ({parseFloat(sizeReduction) > 0 ? '+' : ''}{sizeReduction}%)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Size Comparison */}
                <SizeComparison
                  originalSize={originalSize}
                  processedSize={processedSize}
                  sizeReduction={sizeReduction}
                  isCalculating={isCalculating}
                  customLabel="Filter Impact"
                />

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => applyPreset('none')}
                    className={styles.resetFiltersButton}
                    disabled={selectedPreset === 'none'}
                  >
                    <i className="fas fa-undo"></i>
                    Reset Filters
                  </button>

                  <ProcessingButton
                    onClick={handleDownload}
                    isProcessing={isProcessing}
                    defaultText="Download Filtered Image"
                    processingText="Processing..."
                    icon="fas fa-download"
                    variant="download"
                    size="medium"
                    fullWidth={false}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. USEFUL SECTION */}
      <section className={styles.usefulSection}>
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="filters" />
          <QuickTips currentTool="filters" />
        </div>
      </section>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImageFilters;
