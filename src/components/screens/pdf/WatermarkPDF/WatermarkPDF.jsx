import React, { useState, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import UsefulLinks from "../../../shared/UsefulLinks/UsefulLinks";
import QuickTips from "../../../shared/QuickTips/QuickTips";
import useWatermark from './useWatermarkPDF';
import styles from './WatermarkPDF.module.scss';
import { WatermarkPDFHelmet } from "../../seo/PdfHelmet";

const WatermarkPDF = () => {
  // Core processing states
  const [originalSize, setOriginalSize] = useState(null);
  const [watermarkedSize, setWatermarkedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  
  // PDF handling
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDetails, setPdfDetails] = useState({
    name: "",
    size: "",
    pages: 0,
  });
  
  // UI state management
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Feature-specific watermark state
  const [watermarkOptions, setWatermarkOptions] = useState({
    watermarkType: 'text',
    watermarkText: 'CONFIDENTIAL',
    watermarkImage: null,
    opacity: 50,
    rotation: 45,
    position: 'center',
    size: 'medium',
    color: '#ff0000',
    fontSize: 48
  });
  
  // Watermark hook
  const {
    applyWatermark,
    modifiedPdfUrl,
    isApplying,
    applyError
  } = useWatermark();
  
  // Helper function to detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  // File upload handler
  const handleFileUpload = useCallback(async (uploadedFiles) => {
    setError(null);
    setSuccessMessage(null);
    
    // Handle both single file and array cases
    const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    
    const validFiles = filesArray?.filter(file => 
      file && file.type === "application/pdf"
    );

    if (validFiles.length !== filesArray.length) {
      setError("Some files were not supported. Only PDF files are allowed.");
    }

    if (validFiles.length === 0) {
      setError("Please upload a valid PDF file.");
      return;
    }

    try {
      const file = validFiles[0]; // Take first file since this is single upload
      
      if (file.size > 25 * 1024 * 1024) {
        setError("File size exceeds 25MB limit. Please choose a smaller file.");
        return;
      }

      setPdfFile(file);
      
      const fileSizeKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeKB);
      setPdfDetails({
        name: file.name,
        size: file.size >= 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : fileSizeKB + ' KB',
        pages: 'N/A', // PDF watermarking doesn't need page count
      });
      
      setCurrentStep(2);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process PDF file. Please ensure it's a valid PDF.");
      setPdfFile(null);
    }
  }, []);

  // Handle image upload for watermark
  const handleImageUpload = useCallback((file) => {
    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }
    setWatermarkOptions(prev => ({
      ...prev,
      watermarkImage: file
    }));
  }, []);

  // Watermark and Download handler
  const handleWatermarkAndDownload = useCallback(async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    if (watermarkOptions.watermarkType === 'image' && !watermarkOptions.watermarkImage) {
      setError('Please upload a watermark image');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    try {
      const blob = await applyWatermark(pdfFile, watermarkOptions);
      if (blob) {
        const watermarkedSizeKB = (blob.size / 1024).toFixed(2);
        setWatermarkedSize(watermarkedSizeKB);
        
        // Calculate size comparison
        if (originalSize) {
          const original = parseFloat(originalSize);
          const watermarked = parseFloat(watermarkedSizeKB);
          const difference = ((watermarked - original) / original) * 100;
          setSizeReduction(difference.toFixed(2));
        }
        
        // Auto-download
        saveAs(blob, `watermarked-${pdfFile.name}`);
        setSuccessMessage(`🎉 Successfully added watermark and downloaded PDF!`);
      }
    } catch (error) {
      console.error("Watermark error:", error);
      setError("Failed to add watermark to PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [pdfFile, watermarkOptions, originalSize, applyWatermark]);

  // Reset function
  const resetProcessor = useCallback(() => {
    setPdfFile(null);
    setOriginalSize(null);
    setWatermarkedSize(null);
    setSizeReduction(null);
    setError(null);
    setSuccessMessage(null);
    setCurrentStep(1);
    setPdfDetails({ name: "", size: "", pages: 0 });
    setIsProcessing(false);
    setWatermarkOptions({
      watermarkType: 'text',
      watermarkText: 'CONFIDENTIAL',
      watermarkImage: null,
      opacity: 50,
      rotation: 45,
      position: 'center',
      size: 'medium',
      color: '#ff0000',
      fontSize: 48
    });
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (watermarkOptions.watermarkImage) {
        URL.revokeObjectURL(URL.createObjectURL(watermarkOptions.watermarkImage));
      }
    };
  }, [watermarkOptions.watermarkImage]);


  return (
    <div className={styles.watermarkPDF}>
      <WatermarkPDFHelmet />
      
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <i className="fas fa-shield-alt"></i>
            PDF Watermark Tool
          </h1>
          <p className={styles.subtitle}>
            Add text or image watermarks to protect your PDFs • 100% Private • Fast & Secure
          </p>
        </div>
      </section>

      {/* Main Processing Section */}
      <section className={styles.main}>
        <div className={styles.container}>
          
          {/* Progress Steps */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressSteps}>
              <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 1 ? <i className="fas fa-check"></i> : '1'}
                </div>
                <span className={styles.stepLabel}>Upload PDF</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 1 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}>
                <div className={styles.stepNumber}>
                  {currentStep > 2 ? <i className="fas fa-check"></i> : '2'}
                </div>
                <span className={styles.stepLabel}>Design Watermark</span>
              </div>
              <div className={`${styles.progressLine} ${currentStep > 2 ? styles.active : ''}`}></div>
              <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span className={styles.stepLabel}>Download PDF</span>
              </div>
            </div>
            
            {pdfFile && (
              <button onClick={resetProcessor} className={styles.resetButton}>
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
                multiple={false}
                acceptedFormats={['application/pdf']}
              />
              <div className={styles.uploadInfo}>
                <div className={styles.formatSupport}>
                  <span>Supported: PDF files only</span>
                  <span>Max: 25MB per file</span>
                  <span>🔒 Private & Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {currentStep >= 2 && pdfFile && (
            <div className={styles.processingStep}>
              
              {/* Watermark Design Section */}
              <div className={styles.watermarkSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.fileName}>{pdfDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change File
                  </button>
                </div>
                
                <div className={styles.watermarkDesigner}>
                  {/* Watermark Type */}
                  <div className={styles.typeSelector}>
                    <label>Watermark Type:</label>
                    <div className={styles.typeOptions}>
                      <button
                        className={`${styles.typeOption} ${watermarkOptions.watermarkType === 'text' ? styles.active : ''}`}
                        onClick={() => setWatermarkOptions(prev => ({ ...prev, watermarkType: 'text' }))}
                      >
                        <i className="fas fa-font"></i>
                        Text
                      </button>
                      <button
                        className={`${styles.typeOption} ${watermarkOptions.watermarkType === 'image' ? styles.active : ''}`}
                        onClick={() => setWatermarkOptions(prev => ({ ...prev, watermarkType: 'image' }))}
                      >
                        <i className="fas fa-image"></i>
                        Image
                      </button>
                    </div>
                  </div>

                  {/* Watermark Content */}
                  <div className={styles.contentSection}>
                    {watermarkOptions.watermarkType === 'text' ? (
                      <div className={styles.textWatermark}>
                        <div className={styles.inputGroup}>
                          <label>Watermark Text:</label>
                          <input
                            type="text"
                            value={watermarkOptions.watermarkText}
                            onChange={(e) => setWatermarkOptions(prev => ({
                              ...prev,
                              watermarkText: e.target.value
                            }))}
                            placeholder="Enter watermark text"
                            className={styles.textInput}
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Text Color:</label>
                          <div className={styles.colorInput}>
                            <input
                              type="color"
                              value={watermarkOptions.color}
                              onChange={(e) => setWatermarkOptions(prev => ({
                                ...prev,
                                color: e.target.value
                              }))}
                            />
                            <span>{watermarkOptions.color}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.imageWatermark}>
                        {watermarkOptions.watermarkImage ? (
                          <div className={styles.imagePreview}>
                            <img
                              src={URL.createObjectURL(watermarkOptions.watermarkImage)}
                              alt="Watermark preview"
                            />
                            <button
                              onClick={() => setWatermarkOptions(prev => ({
                                ...prev,
                                watermarkImage: null
                              }))}
                              className={styles.removeBtn}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ) : (
                          <div className={styles.imageUpload}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e.target.files[0])}
                              id="imageUpload"
                              style={{ display: 'none' }}
                            />
                            <label htmlFor="imageUpload" className={styles.uploadBtn}>
                              <i className="fas fa-upload"></i>
                              Upload Image
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Watermark Preview */}
                  <div className={styles.watermarkPreview}>
                    <div className={styles.previewTitle}>Preview:</div>
                    <div className={styles.previewBox}>
                      {watermarkOptions.watermarkType === 'text' ? (
                        <span 
                          style={{ 
                            color: watermarkOptions.color, 
                            opacity: watermarkOptions.opacity / 100,
                            transform: `rotate(${watermarkOptions.rotation}deg)`,
                            fontSize: `${Math.min(watermarkOptions.fontSize / 4, 16)}px`
                          }}
                        >
                          {watermarkOptions.watermarkText || 'CONFIDENTIAL'}
                        </span>
                      ) : watermarkOptions.watermarkImage ? (
                        <img 
                          src={URL.createObjectURL(watermarkOptions.watermarkImage)} 
                          alt="Preview"
                          style={{ 
                            opacity: watermarkOptions.opacity / 100,
                            transform: `rotate(${watermarkOptions.rotation}deg)`,
                            maxWidth: '80px',
                            maxHeight: '80px'
                          }}
                        />
                      ) : (
                        <span className={styles.placeholderText}>Image Preview</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <div className={styles.settingsPanel}>
                
                {/* File Info */}
                <div className={styles.fileDetails}>
                  <div className={styles.detailItem}>
                    <span>File:</span>
                    <span>{pdfFile.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Size:</span>
                    <span>{pdfDetails.size}</span>
                  </div>
                </div>

                {/* Watermark Settings */}
                <div className={styles.optionGroup}>
                  <label>Position:</label>
                  <select
                    value={watermarkOptions.position}
                    onChange={(e) => setWatermarkOptions(prev => ({
                      ...prev,
                      position: e.target.value
                    }))}
                    className={styles.selectInput}
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="center">Center</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div className={styles.optionGroup}>
                  <label>Opacity: {watermarkOptions.opacity}%</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={watermarkOptions.opacity}
                    onChange={(e) => setWatermarkOptions(prev => ({
                      ...prev,
                      opacity: Number(e.target.value)
                    }))}
                    className={styles.rangeInput}
                  />
                </div>

                <div className={styles.optionGroup}>
                  <label>Rotation: {watermarkOptions.rotation}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={watermarkOptions.rotation}
                    onChange={(e) => setWatermarkOptions(prev => ({
                      ...prev,
                      rotation: Number(e.target.value)
                    }))}
                    className={styles.rangeInput}
                  />
                </div>

                {watermarkOptions.watermarkType === 'text' && (
                  <div className={styles.optionGroup}>
                    <label>Font Size: {watermarkOptions.fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={watermarkOptions.fontSize}
                      onChange={(e) => setWatermarkOptions(prev => ({
                        ...prev,
                        fontSize: parseInt(e.target.value)
                      }))}
                      className={styles.rangeInput}
                    />
                  </div>
                )}

                {/* Size Comparison */}
                {originalSize && (
                  <div className={styles.sizeComparison}>
                    <div className={styles.sizeInfo}>
                      <span>Original: {originalSize} KB</span>
                      <span>→</span>
                      {watermarkedSize ? (
                        <>
                          <span>Watermarked: {watermarkedSize} KB</span>
                          {sizeReduction && (
                            <span className={parseFloat(sizeReduction) < 0 ? styles.reduction : styles.increase}>
                              ({parseFloat(sizeReduction) < 0 ? '' : '+'}{sizeReduction}%)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.calculating}>Ready to watermark</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Watermark Button */}
                <button 
                  onClick={handleWatermarkAndDownload} 
                  className={styles.watermarkButton}
                  disabled={isProcessing || !pdfFile || (watermarkOptions.watermarkType === 'image' && !watermarkOptions.watermarkImage)}
                >
                  {isProcessing ? (
                    <>
                      <div className={styles.spinner}></div>
                      Adding Watermark...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shield-alt"></i>
                      Add Watermark & Download
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
        <div className={styles.usefulContent}>
          <UsefulLinks currentTool="watermark-pdf" />
          <QuickTips currentTool="watermark-pdf" />
        </div>
      </section>
    </div>
  );
};

export default WatermarkPDF;