import React from 'react';
import styles from './ImagePreviewPanel.module.scss';

const ImagePreviewPanel = ({ 
  previewUrl,
  originalImageUrl, // For comparison views
  imageDetails = {},
  originalSize,
  onReset,
  showComparison = false,
  comparisonTitle = "Original vs Processed"
}) => {
  const formatSize = (sizeKB) => {
    if (!sizeKB) return 'Unknown';
    const size = parseFloat(sizeKB);
    return size >= 1024 ? (size / 1024).toFixed(2) + ' MB' : size + ' KB';
  };

  if (!previewUrl) {
    return null;
  }

  return (
    <div className={styles.imagePreview}>
      <div className={styles.previewHeader}>
        <span className={styles.fileName}>
          <i className="fas fa-image"></i>
          {imageDetails.name || 'Image Preview'}
        </span>
        {onReset && (
          <button onClick={onReset} className={styles.changeBtn}>
            <i className="fas fa-upload"></i> 
            Change
          </button>
        )}
      </div>

      {showComparison && originalImageUrl ? (
        <div className={styles.comparisonContainer}>
          <h4 className={styles.comparisonTitle}>
            <i className="fas fa-balance-scale"></i>
            {comparisonTitle}
          </h4>
          <div className={styles.comparisonGrid}>
            <div className={styles.imageContainer}>
              <div className={styles.imageLabel}>Original</div>
              <img src={originalImageUrl} alt="Original" className={styles.previewImage} />
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.imageLabel}>Processed</div>
              <img src={previewUrl} alt="Processed" className={styles.previewImage} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.imageContainer}>
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
        </div>
      )}

      {(imageDetails.dimensions || originalSize || imageDetails.type) && (
        <div className={styles.imageDetails}>
          <div className={styles.detailsText}>
            {imageDetails.dimensions && <span>{imageDetails.dimensions}</span>}
            {originalSize && <span>{formatSize(originalSize)}</span>}
            {imageDetails.type && <span>{imageDetails.type}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewPanel;
