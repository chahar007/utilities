import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './CropImage.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import UsefulLinks from '../../../shared/UsefulLinks/UsefulLinks';
import QuickTips from '../../../shared/QuickTips/QuickTips';
import ProgressIndicator from '../../../shared/ProgressIndicator/ProgressIndicator';
import AlertMessage from '../../../shared/AlertMessage/AlertMessage';
import ImagePreviewPanel from '../../../shared/ImagePreviewPanel/ImagePreviewPanel';
import SizeComparison from '../../../shared/SizeComparison/SizeComparison';
import ProcessingButton from '../../../shared/ProcessingButton/ProcessingButton';
import useImageProcessor from '../../../../hooks/useImageProcessor';
import { CropImageHelmet } from '../../seo/TabsHelment';

const CropImage = () => {
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
    setIsCalculating
  } = useImageProcessor();
  
  // Crop-specific states
  const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  
  // Refs
  const imageRef = useRef(null);

  const handleFileUpload = useCallback((file) => {
    baseHandleFileUpload(file);
    // Reset crop-specific states
    setCroppedImageUrl(null);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  }, [baseHandleFileUpload]);

  // Custom reset processor for Crop specific states
  const resetProcessor = useCallback(() => {
    baseResetProcessor(); // Call shared reset
    
    // Reset crop-specific states
    setCroppedImageUrl(null);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setAspectRatio(null);
  }, [baseResetProcessor]);

  const getCroppedImage = useCallback(async () => {
    if (!imageRef.current || !crop.width || !crop.height) return;
    
    setIsCalculating(true);
    
    try {
    const image = imageRef.current;
      const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
      
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

      const croppedImageData = canvas.toDataURL('image/jpeg', 0.9);
      setCroppedImageUrl(croppedImageData);
      
      // Calculate size
      const byteString = atob(croppedImageData.split(',')[1]);
      const newSizeKB = (byteString.length / 1024).toFixed(2);
      
      setProcessedSize(newSizeKB);
      
      // Calculate percentage change
      const original = parseFloat(originalSize);
      const processed = parseFloat(newSizeKB);
      const reduction = ((original - processed) / original) * 100;
      setSizeReduction(reduction.toFixed(2));
      
      setIsCalculating(false);
    } catch (error) {
      setIsCalculating(false);
      setError("Error cropping image. Please try again.");
    }
  }, [crop, originalSize]);

  const handleDownload = useCallback(() => {
    if (!croppedImageUrl) {
      setError("Please crop the image first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCurrentStep(3);

    const link = document.createElement("a");
    link.href = croppedImageUrl;
    link.download = `${imageDetails.name.split('.')[0]}_cropped.jpg`;
    link.click();
    
    setSuccessMessage(`🎉 Successfully cropped your image!`);
    setIsProcessing(false);
  }, [croppedImageUrl, imageDetails.name]);



  const setAspectRatioPreset = useCallback((ratio) => {
    setAspectRatio(ratio);
    // Reset crop to center when aspect ratio changes
    if (ratio) {
      setCrop({ unit: '%', width: 50, height: 50 / ratio, x: 25, y: 25 });
    } else {
      setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    }
  }, []);

  // Auto-trigger processing when crop changes
  useEffect(() => {
    if (previewUrl && originalSize && crop.width && crop.height) {
      const timeoutId = setTimeout(() => {
        getCroppedImage();
      }, 500); // Debounce to avoid too many calculations
      
      return () => clearTimeout(timeoutId);
    }
  }, [crop, previewUrl, originalSize, getCroppedImage]);

  return (
    <div className={styles.cropImage}>
      <CropImageHelmet />

      {/* 1. COMPACT HEADER */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <i className="fas fa-crop"></i>
            Image Cropping Tool
          </h1>
          <p className={styles.pageDescription}>
            Crop images to perfect size • 100% Private • Fast & Secure
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
              { number: 2, label: 'Crop' },
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
              {/* Crop Interface Panel */}
              <div className={styles.cropInterface}>
                <div className={styles.cropHeader}>
                  <span className={styles.fileName}>{imageDetails.name}</span>
                  <button onClick={resetProcessor} className={styles.changeBtn}>
                    <i className="fas fa-upload"></i> Change
                  </button>
                </div>
                <div className={styles.cropContainer}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                    aspect={aspectRatio}
                    className={styles.reactCrop}
                  >
                    <img 
                      ref={imageRef} 
                      src={previewUrl} 
                      alt="Crop" 
                      className={styles.cropImage} 
                    />
              </ReactCrop>
            </div>
                <div className={styles.imageDetails}>
                  <span>{imageDetails.dimensions}</span>
                  <span>{originalSize >= 1024 ? (originalSize / 1024).toFixed(2) + ' MB' : originalSize + ' KB'}</span>
                  <span>{imageDetails.type}</span>
                </div>
              </div>

              {/* Settings & Preview Panel */}
              <div className={styles.settingsPanel}>
                {/* Aspect Ratio Controls */}
                <div className={styles.aspectRatioSection}>
                  <label>Aspect Ratio:</label>
                  <div className={styles.aspectRatioButtons}>
                    <button 
                      onClick={() => setAspectRatioPreset(null)}
                      className={aspectRatio === null ? styles.active : ''}
                    >
                      Free
                    </button>
                    <button 
                      onClick={() => setAspectRatioPreset(1)}
                      className={aspectRatio === 1 ? styles.active : ''}
                    >
                      1:1
                    </button>
                    <button 
                      onClick={() => setAspectRatioPreset(16/9)}
                      className={aspectRatio === 16/9 ? styles.active : ''}
                    >
                      16:9
                    </button>
                    <button 
                      onClick={() => setAspectRatioPreset(4/3)}
                      className={aspectRatio === 4/3 ? styles.active : ''}
                    >
                      4:3
                    </button>
                  </div>
                </div>

                {/* Crop Preview */}
                {croppedImageUrl && (
                  <div className={styles.cropPreview}>
                    <label>Crop Preview:</label>
                    <div className={styles.previewContainer}>
                      <img src={croppedImageUrl} alt="Cropped Preview" className={styles.previewImage} />
                    </div>
                  </div>
                )}

                {/* Size Comparison */}
                <SizeComparison
                  originalSize={originalSize}
                  processedSize={processedSize}
                  sizeReduction={sizeReduction}
                  isCalculating={isCalculating}
                  customLabel="Crop Impact"
                  processedLabel="Cropped"
                />

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button 
                    onClick={getCroppedImage} 
                    className={styles.cropButton}
                    disabled={!crop.width || !crop.height || isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <div className={styles.spinner}></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-crop"></i>
                        Update Crop
                      </>
                    )}
            </button>
                  
                  <ProcessingButton
                    onClick={handleDownload}
                    isProcessing={isProcessing}
                    disabled={!croppedImageUrl}
                    defaultText="Download Cropped Image"
                    processingText="Processing..."
                    icon="fas fa-download"
                    variant="download"
                    size="medium"
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
          <UsefulLinks currentTool="crop-image" />
          <QuickTips currentTool="crop-image" />
        </div>
      </section>
    </div>
  );
};

export default CropImage;