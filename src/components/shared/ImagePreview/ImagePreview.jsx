import React from 'react';
import styles from './ImagePreview.module.scss';

const ImagePreview = ({ 
  image, 
  title, 
  details, 
  variant = 'default',
  className = '',
  onImageClick
}) => {
  if (!image) return null;

  return (
    <div className={`${styles.imagePreview} ${styles[variant]} ${className}`}>
      <div className={styles.imageContainer}>
        <h4 className={styles.imageTitle}>{title}</h4>
        <div className={styles.imageWrapper} onClick={onImageClick}>
          <img 
            src={image} 
            alt={title} 
            className={styles.image}
          />
        </div>
        {details && (
          <div className={styles.imageDetails}>
            {details.map((detail, index) => (
              <div key={index} className={styles.detailItem}>
                <span className={styles.detailLabel}>{detail.label}:</span>
                <span className={styles.detailValue}>{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
