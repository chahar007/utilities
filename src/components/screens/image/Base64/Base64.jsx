import React, { useState } from 'react';
import styles from './Base64.module.scss';
import UploadFileHandling from '../../../shared/UploadFileHandling/UploadFileHandling';
import ImageToolLayout from '../../../shared/ImageToolLayout/ImageToolLayout';
import ImagePreview from '../../../shared/ImagePreview/ImagePreview';
import ActionButton from '../../../shared/ActionButton/ActionButton';
import StatusMessage from '../../../shared/StatusMessage/StatusMessage';
import EmptyState from '../../../shared/EmptyState/EmptyState';
import { Base64Helmet } from '../../seo/TabsHelment';

const Base64 = () => {
  const [error, setError] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64String, setBase64String] = useState(null);
  const [imageDetails, setImageDetails] = useState({ name: '', dimensions: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileUpload = (file) => {
    setError(null);
    setSuccessMessage(null);
    setOriginalSize(null);
    setBase64String(null);

    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setError("Please upload a valid image file.");
        return;
      }

      const fileSizeInKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeInKB);

      const img = new Image();
      img.onload = () => {
        setImageDetails({
          name: file.name,
          dimensions: `${img.width}x${img.height}px`,
        });
      };
      img.onerror = () => {
        setError("Error loading image.");
      };
      img.src = URL.createObjectURL(file);

      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setError("Please upload an image first.");
    }
  };

  const handleGenerateBase64 = () => {
    if (!previewUrl) {
      setError("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    fetch(previewUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64String(reader.result);
          setSuccessMessage("Base64 string generated successfully!");
          setIsGenerating(false);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        setError("Error converting image to Base64.");
        setIsGenerating(false);
      });
  };


  const copyBase64 = () => {
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
  };


  const imagePreviewDetails = originalSize ? [
    { label: 'File Name', value: imageDetails.name },
    { label: 'Original Size', value: `${originalSize} KB` },
    { label: 'Dimensions', value: imageDetails.dimensions }
  ] : null;

  return (
    <ImageToolLayout
      title="Base64 Image Converter"
      description="Convert images to Base64 format for web optimization and seamless integration. Enhance loading speed, reduce server requests, and ensure smooth data handling."
      helmet={<Base64Helmet />}
    >
      <div className={styles.base64}>
        {/* Upload Section */}
        <div className={styles.uploadSection}>
          <UploadFileHandling onFileUpload={handleFileUpload} />
        </div>

        {/* Status Messages */}
        {error && (
          <StatusMessage 
            message={error} 
            type="error" 
            onClose={() => setError(null)} 
          />
        )}
        
        {successMessage && (
          <StatusMessage 
            message={successMessage} 
            type="success" 
            onClose={() => setSuccessMessage(null)} 
          />
        )}

        {/* Empty State */}
        {!previewUrl && (
          <EmptyState
            icon="fas fa-code"
            title="No image uploaded yet"
            description="Please upload an image to convert to Base64 string. Supports JPEG, PNG, GIF, and WebP formats."
          />
        )}

        {/* Content */}
        {previewUrl && (
          <div className={styles.content}>
            <div className={styles.imageSection}>
              <ImagePreview
                image={previewUrl}
                title="Original Image"
                details={imagePreviewDetails}
                variant="original"
              />
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <ActionButton
                onClick={handleGenerateBase64}
                variant="primary"
                size="large"
                loading={isGenerating}
                icon="fas fa-code"
                disabled={!previewUrl}
              >
                {isGenerating ? 'Generating...' : 'Generate Base64'}
              </ActionButton>
            </div>

            {/* Base64 Output */}
            {base64String && (
              <div className={styles.outputSection}>
                <div className={styles.outputHeader}>
                  <h3>Base64 Output</h3>
                  <ActionButton
                    onClick={copyBase64}
                    variant="outline"
                    size="medium"
                    icon="fas fa-copy"
                  >
                    Copy to Clipboard
                  </ActionButton>
                </div>
                <div className={styles.base64Container}>
                  <textarea
                    className={styles.base64Output}
                    value={base64String}
                    readOnly
                    rows="12"
                    placeholder="Base64 string will appear here..."
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ImageToolLayout>
  );
};

export default Base64;
