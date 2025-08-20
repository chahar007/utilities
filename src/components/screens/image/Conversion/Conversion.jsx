import React, { useState, useEffect, useCallback } from "react";
import styles from "./Conversion.module.scss";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import { ConversionHelmet } from "../../seo/TabsHelment";

const Conversion = () => {
  const [selectedFormat, setSelectedFormat] = useState("jpg");
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  const [imageDetails, setImageDetails] = useState({
    name: "",
    dimensions: "",
    type: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateConvertedSizeWithValues = async (originalSizeValue, formatValue, qualityValue) => {
    if (previewUrl && formatValue && originalSizeValue) {
      setIsCalculating(true);
      console.log('Calculating converted size with direct values:', { formatValue, qualityValue, originalSizeValue });
      
      try {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = previewUrl;

        img.onload = () => {
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          let imageDataUrl;
          if (formatValue === "jpg" || formatValue === "jpeg") {
            imageDataUrl = canvas.toDataURL('image/jpeg', qualityValue / 100);
          } else if (formatValue === "png") {
            imageDataUrl = canvas.toDataURL('image/png');
          } else if (formatValue === "webp") {
            imageDataUrl = canvas.toDataURL('image/webp', qualityValue / 100);
          }

          const byteString = atob(imageDataUrl.split(',')[1]);
          const length = byteString.length;
          const sizeInKB = (length / 1024).toFixed(2);

          console.log('Converted size calculated:', sizeInKB, 'KB');
          setConvertedSize(sizeInKB);
          setIsCalculating(false);
          
          // Calculate size reduction after setting converted size
          setTimeout(() => {
            calculateSizeReductionWithValues(originalSizeValue, sizeInKB);
          }, 50);
        };

        img.onerror = () => {
          setError("Error loading image for size calculation.");
          setConvertedSize(null);
          setIsCalculating(false);
        };
      } catch (error) {
        console.error('Error in calculateConvertedSizeWithValues:', error);
        setConvertedSize(null);
        setError("Error calculating converted size.");
        setIsCalculating(false);
      }
    } else {
      console.log('Cannot calculate - missing data:', { 
        previewUrl: !!previewUrl, 
        formatValue, 
        originalSizeValue,
        previewUrlType: typeof previewUrl,
        formatValueType: typeof formatValue,
        originalSizeValueType: typeof originalSizeValue
      });
    }
  };

  const calculateSizeReductionWithValues = (originalSizeValue, convertedSizeValue) => {
    if (originalSizeValue && convertedSizeValue && originalSizeValue > 0 && convertedSizeValue > 0) {
      try {
        const original = parseFloat(originalSizeValue);
        const converted = parseFloat(convertedSizeValue);
        
        if (isNaN(original) || isNaN(converted) || original <= 0 || converted <= 0) {
          setSizeReduction(null);
          return;
        }
        
        const reduction = ((original - converted) / original) * 100;
        
        // Check if the result is valid
        if (isNaN(reduction) || !isFinite(reduction)) {
          setSizeReduction(null);
        } else {
          const reductionValue = reduction.toFixed(2);
          console.log('Size reduction calculated:', reductionValue + '%');
          setSizeReduction(reductionValue);
        }
      } catch (error) {
        console.warn('Error calculating size reduction with values:', error);
        setSizeReduction(null);
      }
    } else {
      setSizeReduction(null);
    }
  };

  const calculateConvertedSize = async () => {
    if (previewUrl && selectedFormat && originalSize) {
      setIsCalculating(true);
      console.log('Calculating converted size:', { selectedFormat, quality, originalSize });
      
      try {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = previewUrl;

        img.onload = () => {
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          let imageDataUrl;
          if (selectedFormat === "jpg" || selectedFormat === "jpeg") {
            imageDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          } else if (selectedFormat === "png") {
            imageDataUrl = canvas.toDataURL('image/png');
          } else if (selectedFormat === "webp") {
            imageDataUrl = canvas.toDataURL('image/webp', quality / 100);
          }

          const byteString = atob(imageDataUrl.split(',')[1]);
          const length = byteString.length;
          const sizeInKB = (length / 1024).toFixed(2);

          console.log('Converted size calculated:', sizeInKB, 'KB');
          setConvertedSize(sizeInKB);
          setIsCalculating(false);
          
          // Calculate size reduction after setting converted size
          setTimeout(() => {
            calculateSizeReduction();
          }, 50);
        };

        img.onerror = () => {
          setError("Error loading image for size calculation.");
          setConvertedSize(null);
          setIsCalculating(false);
        };
      } catch (error) {
        console.error('Error in calculateConvertedSize:', error);
        setConvertedSize(null);
        setError("Error calculating converted size.");
        setIsCalculating(false);
      }
    } else {
      console.log('Cannot calculate - missing data:', { previewUrl: !!previewUrl, selectedFormat, originalSize });
    }
  };

  const calculateSizeReduction = () => {
    if (originalSize && convertedSize && originalSize > 0 && convertedSize > 0) {
      try {
        const original = parseFloat(originalSize);
        const converted = parseFloat(convertedSize);
        
        if (isNaN(original) || isNaN(converted) || original <= 0 || converted <= 0) {
          setSizeReduction(null);
          return;
        }
        
        const reduction = ((original - converted) / original) * 100;
        
        // Check if the result is valid
        if (isNaN(reduction) || !isFinite(reduction)) {
          setSizeReduction(null);
        } else {
          setSizeReduction(reduction.toFixed(2));
        }
      } catch (error) {
        console.warn('Error calculating size reduction:', error);
        setSizeReduction(null);
      }
    } else {
      setSizeReduction(null);
    }
  };

  const handleFileUpload = useCallback((file) => {
    setError(null);
    setSuccessMessage(null);
    setConvertedSize(null);
    setSizeReduction(null);
    
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setError("Please upload a valid image file (JPG, PNG, WebP, GIF, BMP).");
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB.");
        return;
      }

      const fileSizeInKB = (file.size / 1024).toFixed(2);
      
      const img = new Image();
      img.onload = () => {
        setImageDetails({
          name: file.name,
          dimensions: `${img.width}x${img.height}px`,
          type: file.type.split('/')[1].toUpperCase(),
        });
        setCurrentStep(2);
        
        // Set original size first
        setOriginalSize(fileSizeInKB);
        console.log('File uploaded, original size set:', fileSizeInKB, 'KB, format:', selectedFormat);
        
        // Force immediate calculation with current selectedFormat (jpg by default)
        // Use a longer timeout to ensure state updates are complete
        setTimeout(() => {
          console.log('Triggering initial calculation...');
          console.log('Calling with values:', { fileSizeInKB, selectedFormat, quality, previewUrl: !!previewUrl });
          // Pass the values directly instead of relying on state
          calculateConvertedSizeWithValues(fileSizeInKB, selectedFormat, quality);
        }, 200);
      };
      img.onerror = () => {
        setError("Error loading image. Please try with a different file.");
      };
      img.src = URL.createObjectURL(file);

      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const resetConverter = useCallback(() => {
    setPreviewUrl(null);
    setOriginalSize(null);
    setConvertedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setImageDetails({ name: "", dimensions: "", type: "" });
    setSelectedFormat("jpg");
    setQuality(80);
    setIsCalculating(false);
  }, []);

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  const handleDownload = useCallback(() => {
    if (!previewUrl) {
      setError("No image selected for conversion.");
      return;
    }

    setIsConverting(true);
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
      setIsConverting(false);
    };
    img.onerror = () => {
      setError("Error converting image. Please try again.");
      setIsConverting(false);
    };
  }, [previewUrl, selectedFormat, quality, imageDetails.name]);

  useEffect(() => {
    // Only recalculate when quality or format changes, not on initial load
    if (originalSize !== null && previewUrl && convertedSize !== null) {
      calculateConvertedSize();
    }
  }, [quality, selectedFormat]);

  const formatOptions = [
    { 
      value: 'jpg', 
      label: 'JPG', 
      description: 'Best for photos',
      icon: '📷',
      features: ['Smaller files', 'Universal support']
    },
    { 
      value: 'png', 
      label: 'PNG', 
      description: 'Best for graphics',
      icon: '🎨',
      features: ['Transparency', 'Lossless quality']
    },
    { 
      value: 'webp', 
      label: 'WebP', 
      description: 'Modern format',
      icon: '🚀',
      features: ['Superior compression', 'Web optimized']
    }
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
                <span className={styles.stepLabel}>Convert</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download</span>
              </div>
            </div>
            
            {previewUrl && (
              <button onClick={resetConverter} className={styles.resetButton}>
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
              <div className={styles.imagePreview}>
                <div className={styles.previewHeader}>
                  <span className={styles.fileName}>{imageDetails.name}</span>
                  <button onClick={resetConverter} className={styles.changeBtn}>
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
                      onChange={handleQualityChange}
                      className={styles.qualitySlider}
                    />
                    <div className={styles.qualityPresets}>
                      <button onClick={() => setQuality(50)} className={quality === 50 ? styles.active : ''}>Web</button>
                      <button onClick={() => setQuality(80)} className={quality === 80 ? styles.active : ''}>Balanced</button>
                      <button onClick={() => setQuality(95)} className={quality === 95 ? styles.active : ''}>High</button>
                    </div>
                  </div>
                )}

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      <span>New: {convertedSize} KB</span>
                      {isCalculating ? (
                        <span className={styles.calculating}>Calculating...</span>
                      ) : sizeReduction && !isNaN(parseFloat(sizeReduction)) ? (
                        <span className={parseFloat(sizeReduction) > 0 ? styles.reduction : styles.increase}>
                          ({parseFloat(sizeReduction) > 0 ? '-' : '+'}{Math.abs(parseFloat(sizeReduction))}%)
                        </span>
                      ) : (
                        <span className={styles.calculating}>Ready</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <button 
                  onClick={handleDownload} 
                  className={styles.convertButton}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <>
                      <div className={styles.spinner}></div>
                      Converting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download"></i>
                      Convert & Download {selectedFormat.toUpperCase()}
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
        <div className={styles.container}>
          <div className={styles.usefulContent}>
            {/* Useful Links - First Row */}
            <div className={styles.usefulLinks}>
              <h3><i className="fas fa-tools"></i> More Image Tools</h3>
              <div className={styles.linksGrid}>
                <a href="/image/compression" className={styles.linkCard}>
                  <i className="fas fa-compress-alt"></i>
                  <div>
                    <span className={styles.linkTitle}>Compress Images</span>
                    <span className={styles.linkDesc}>Reduce file size</span>
                  </div>
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="/image/resizing" className={styles.linkCard}>
                  <i className="fas fa-expand-arrows-alt"></i>
                  <div>
                    <span className={styles.linkTitle}>Resize Images</span>
                    <span className={styles.linkDesc}>Change dimensions</span>
                  </div>
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="/image/crop-image" className={styles.linkCard}>
                  <i className="fas fa-crop-alt"></i>
                  <div>
                    <span className={styles.linkTitle}>Crop Images</span>
                    <span className={styles.linkDesc}>Remove unwanted areas</span>
                  </div>
                  <i className="fas fa-arrow-right"></i>
                </a>
                <a href="/image/rotate-image" className={styles.linkCard}>
                  <i className="fas fa-redo"></i>
                  <div>
                    <span className={styles.linkTitle}>Rotate Images</span>
                    <span className={styles.linkDesc}>Fix orientation</span>
                  </div>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>

            {/* Quick Tips - Second Row */}
            <div className={styles.quickTips}>
              <h3><i className="fas fa-lightbulb"></i> Pro Tips</h3>
              <div className={styles.tipsGrid}>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>📷</span>
                  <div>
                    <strong>JPG:</strong> Best for photos, smaller files, universal support
                  </div>
                </div>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>🎨</span>
                  <div>
                    <strong>PNG:</strong> Perfect for graphics, transparency, lossless quality
                  </div>
                </div>
                <div className={styles.tip}>
                  <span className={styles.tipIcon}>🚀</span>
                  <div>
                    <strong>WebP:</strong> Modern format, superior compression, web-optimized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Conversion;
