import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './ColorPalette.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { ColorPaletteHelmet } from '../../seo/TabsHelment';

const ColorPalette = () => {
  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);

  // Use shared image processor hook
  const {
    originalSize,
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
    setIsCalculating,
    setOriginalSize,
    setImageDetails,
    setPreviewUrl,
    setCurrentStep
  } = useImageProcessor();

  // Color palette specific states
  const [extractedColors, setExtractedColors] = useState([]);
  const [paletteSize, setPaletteSize] = useState(8); // Number of colors to extract
  const [colorFormat, setColorFormat] = useState('hex'); // 'hex', 'rgb', 'hsl'
  const [sortBy, setSortBy] = useState('dominance'); // 'dominance', 'brightness', 'hue'

  // Color extraction utility functions
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getColorBrightness = (r, g, b) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const getColorDistance = (c1, c2) => {
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
    );
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
        
        // Move to step 2
        setCurrentStep(2);
        setIsProcessing(false);
        
        // Extract colors after a short delay
        setTimeout(() => {
          extractColors();
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

  const extractColors = useCallback(() => {
    if (!originalImageRef.current || !canvasRef.current) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = originalImageRef.current;

        // Resize image for faster processing
        const maxSize = 100;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample every 4th pixel for better performance
        const colorCounts = {};
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Round colors to reduce similar colors
          const roundedR = Math.round(r / 8) * 8;
          const roundedG = Math.round(g / 8) * 8;
          const roundedB = Math.round(b / 8) * 8;
          
          const key = `${roundedR},${roundedG},${roundedB}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Convert to array and sort by count
        let colors = Object.entries(colorCounts).map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          return { r, g, b, count };
        });

        // Remove very similar colors
        colors = colors.filter((color, index, arr) => {
          return !arr.slice(0, index).some(prevColor => 
            getColorDistance(color, prevColor) < 30
          );
        });

        // Sort based on user preference
        if (sortBy === 'dominance') {
          colors.sort((a, b) => b.count - a.count);
        } else if (sortBy === 'brightness') {
          colors.sort((a, b) => getColorBrightness(b.r, b.g, b.b) - getColorBrightness(a.r, a.g, a.b));
        } else if (sortBy === 'hue') {
          colors.sort((a, b) => {
            const hslA = rgbToHsl(a.r, a.g, a.b);
            const hslB = rgbToHsl(b.r, b.g, b.b);
            return hslA.h - hslB.h;
          });
        }

        // Take only the requested number of colors
        colors = colors.slice(0, paletteSize);

        // Format colors based on user preference
        const formattedColors = colors.map((color, index) => {
          const { r, g, b } = color;
          const hex = rgbToHex(r, g, b);
          const hsl = rgbToHsl(r, g, b);
          
          return {
            id: index,
            r, g, b,
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
            count: color.count,
            brightness: getColorBrightness(r, g, b)
          };
        });

        setExtractedColors(formattedColors);
        setCurrentStep(3);
        setIsCalculating(false);
        
      } catch (err) {
        setError('Failed to extract colors. Please try again.');
        setIsCalculating(false);
      }
    }, 300); // Small delay for UI feedback
  }, [paletteSize, sortBy]);

  const copyColor = useCallback((color) => {
    const colorValue = colorFormat === 'hex' ? color.hex : 
                     colorFormat === 'rgb' ? color.rgb : color.hsl;
    
    navigator.clipboard.writeText(colorValue).then(() => {
      setSuccessMessage(`Copied ${colorValue} to clipboard!`);
      setTimeout(() => setSuccessMessage(null), 2000);
    }).catch(() => {
      setError('Failed to copy color to clipboard');
    });
  }, [colorFormat]);

  const exportPalette = useCallback((format) => {
    if (extractedColors.length === 0) return;

    setIsProcessing(true);
    
    try {
      let content = '';
      const fileName = imageDetails.name.replace(/\.[^/.]+$/, '') + '_palette';
      
      if (format === 'css') {
        content = ':root {\n';
        extractedColors.forEach((color, index) => {
          content += `  --color-${index + 1}: ${color.hex};\n`;
        });
        content += '}';
        
        const blob = new Blob([content], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.css';
        link.click();
        URL.revokeObjectURL(url);
        
      } else if (format === 'json') {
        const paletteData = {
          source: imageDetails.name,
          extractedAt: new Date().toISOString(),
          colors: extractedColors.map(color => ({
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl
          }))
        };
        
        content = JSON.stringify(paletteData, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.json';
        link.click();
        URL.revokeObjectURL(url);
        
      } else if (format === 'txt') {
        content = `Color Palette extracted from: ${imageDetails.name}\n`;
        content += `Extracted on: ${new Date().toLocaleDateString()}\n`;
        content += `Number of colors: ${extractedColors.length}\n\n`;
        
        extractedColors.forEach((color, index) => {
          content += `Color ${index + 1}:\n`;
          content += `  HEX: ${color.hex}\n`;
          content += `  RGB: ${color.rgb}\n`;
          content += `  HSL: ${color.hsl}\n\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.txt';
        link.click();
        URL.revokeObjectURL(url);
      }
      
      setSuccessMessage('Palette exported successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to export palette. Please try again.');
    }
    
    setIsProcessing(false);
  }, [extractedColors, imageDetails]);

  // Custom reset processor for ColorPalette specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset component-specific states
    setExtractedColors([]);
    setPaletteSize(8);
    setColorFormat('hex');
    setSortBy('dominance');
    
    // Clear refs
    originalImageRef.current = null;
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [baseResetProcessor]);

  // Auto-extract colors when settings change
  useEffect(() => {
    if (originalImageRef.current && currentStep >= 2) {
      const timeoutId = setTimeout(() => {
        extractColors();
      }, 500); // Debounce for performance
      
      return () => clearTimeout(timeoutId);
    }
  }, [paletteSize, sortBy, extractColors, currentStep]);

  return (
    <div className={styles.colorPalette}>
      <ColorPaletteHelmet />

      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-palette"></i>
            Color Palette Extractor
          </h1>
          <p className={styles.pageDescription}>
            Extract beautiful color palettes from images • Multiple formats • Export ready
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
              { number: 2, label: 'Extract Colors' },
              { number: 3, label: 'Export' }
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
                imageDetails={imageDetails}
                originalSize={originalSize}
                onReset={resetProcessor}
                showComparison={false}
              />

              {/* Color Controls Panel */}
              <div className={styles.controlsPanel}>
                {/* Extraction Settings - Compact */}
                <div className={styles.settingsSection}>
                  <h4 className={styles.groupTitle}>
                    <i className="fas fa-cog"></i>
                    Extraction Settings
                  </h4>
                  
                  <div className={styles.settingRow}>
                    <label>
                      <i className="fas fa-hashtag"></i>
                      Colors: {paletteSize}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="16"
                      value={paletteSize}
                      onChange={(e) => setPaletteSize(parseInt(e.target.value))}
                      className={styles.settingSlider}
                    />
                    <div className={styles.sliderLabels}>
                      <span>4</span>
                      <span>16</span>
                    </div>
                  </div>

                  <div className={styles.settingsGrid}>
                    <div className={styles.settingGroup}>
                      <label>
                        <i className="fas fa-sort"></i>
                        Sort By
                      </label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.settingSelect}
                      >
                        <option value="dominance">Dominance</option>
                        <option value="brightness">Brightness</option>
                        <option value="hue">Hue</option>
                      </select>
                    </div>

                    <div className={styles.settingGroup}>
                      <label>
                        <i className="fas fa-palette"></i>
                        Format
                      </label>
                      <select 
                        value={colorFormat} 
                        onChange={(e) => setColorFormat(e.target.value)}
                        className={styles.settingSelect}
                      >
                        <option value="hex">HEX</option>
                        <option value="rgb">RGB</option>
                        <option value="hsl">HSL</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Processing Status */}
                {isCalculating && (
                  <div className={styles.processingStatus}>
                    <div className={styles.spinner}></div>
                    <span>Extracting colors...</span>
                  </div>
                )}

                {/* Export Options */}
                {extractedColors.length > 0 && (
                  <div className={styles.exportSection}>
                    <label>Export Palette:</label>
                    <div className={styles.exportButtons}>
                      <button 
                        onClick={() => exportPalette('css')}
                        className={styles.exportBtn}
                        disabled={isProcessing}
                      >
                        <i className="fab fa-css3-alt"></i>
                        CSS
                      </button>
                      <button 
                        onClick={() => exportPalette('json')}
                        className={styles.exportBtn}
                        disabled={isProcessing}
                      >
                        <i className="fas fa-code"></i>
                        JSON
                      </button>
                      <button 
                        onClick={() => exportPalette('txt')}
                        className={styles.exportBtn}
                        disabled={isProcessing}
                      >
                        <i className="fas fa-file-alt"></i>
                        TXT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Color Palette Display */}
          {extractedColors.length > 0 && (
            <div className={styles.paletteSection}>
              <div className={styles.paletteHeader}>
                <h3>
                  <i className="fas fa-palette"></i>
                  Extracted Color Palette
                </h3>
                <span className={styles.colorCount}>{extractedColors.length} colors</span>
              </div>
              
              <div className={styles.colorGrid}>
                {extractedColors.map((color) => (
                  <div key={color.id} className={styles.colorCard}>
                    <div 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColor(color)}
                      title="Click to copy"
                    >
                      <div className={styles.colorOverlay}>
                        <i className="fas fa-copy"></i>
                      </div>
                    </div>
                    
                    <div className={styles.colorInfo}>
                      <div className={styles.colorValue}>
                        {colorFormat === 'hex' ? color.hex : 
                         colorFormat === 'rgb' ? color.rgb : color.hsl}
                      </div>
                      <div className={styles.colorMeta}>
                        {sortBy === 'dominance' && `${((color.count / Math.max(...extractedColors.map(c => c.count))) * 100).toFixed(0)}%`}
                        {sortBy === 'brightness' && `${Math.round(color.brightness)} brightness`}
                        {sortBy === 'hue' && `${Math.round(color.brightness)} hue`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Palette Actions */}
              <div className={styles.paletteActions}>
                <button
                  onClick={() => {
                    const allColors = extractedColors.map(color => 
                      colorFormat === 'hex' ? color.hex : 
                      colorFormat === 'rgb' ? color.rgb : color.hsl
                    ).join(', ');
                    navigator.clipboard.writeText(allColors).then(() => {
                      setSuccessMessage('All colors copied to clipboard!');
                      setTimeout(() => setSuccessMessage(null), 2000);
                    });
                  }}
                  className={styles.copyAllBtn}
                >
                  <i className="fas fa-copy"></i>
                  Copy All Colors
                </button>
                
                <button
                  onClick={() => extractColors()}
                  className={styles.refreshBtn}
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <div className={styles.spinner}></div>
                      Extracting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-redo"></i>
                      Re-extract
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
          <UsefulLinks currentTool="color-palette" />
          <QuickTips currentTool="color-palette" />
        </div>
      </section>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ColorPalette;
