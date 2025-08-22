import React from 'react';
import styles from './SizeComparison.module.scss';

const SizeComparison = ({ 
  originalSize,
  processedSize,
  sizeReduction,
  isCalculating = false,
  showPercentage = true,
  customLabel = null,
  unit = 'KB'
}) => {
  const formatSize = (size) => {
    if (!size) return 'Unknown';
    const sizeNum = parseFloat(size);
    if (unit === 'KB' && sizeNum >= 1024) {
      return (sizeNum / 1024).toFixed(2) + ' MB';
    }
    return sizeNum + ' ' + unit;
  };

  const getReductionClass = () => {
    if (!sizeReduction || isCalculating) return '';
    const reduction = parseFloat(sizeReduction);
    if (reduction > 0) return styles.reduction;
    if (reduction < 0) return styles.increase;
    return styles.noChange;
  };

  const getReductionIcon = () => {
    if (!sizeReduction || isCalculating) return 'fas fa-calculator';
    const reduction = parseFloat(sizeReduction);
    if (reduction > 0) return 'fas fa-arrow-down';
    if (reduction < 0) return 'fas fa-arrow-up';
    return 'fas fa-equals';
  };

  const getReductionText = () => {
    if (isCalculating) return 'Calculating...';
    if (!sizeReduction) return 'Processing...';
    
    const reduction = parseFloat(sizeReduction);
    if (reduction > 0) return `${reduction.toFixed(2)}% smaller`;
    if (reduction < 0) return `${Math.abs(reduction).toFixed(2)}% larger`;
    return 'Same size';
  };

  if (!originalSize) {
    return null;
  }

  return (
    <div className={styles.sizeComparison}>
      <div className={styles.comparisonHeader}>
        <i className="fas fa-balance-scale"></i>
        {customLabel || 'Size Comparison'}
      </div>
      
      <div className={styles.sizeInfo}>
        <div className={styles.sizeItem}>
          <div className={styles.sizeLabel}>Original</div>
          <div className={styles.sizeValue}>
            <i className="fas fa-file"></i>
            {formatSize(originalSize)}
          </div>
        </div>

        <div className={styles.arrow}>
          <i className="fas fa-arrow-right"></i>
        </div>

        <div className={styles.sizeItem}>
          <div className={styles.sizeLabel}>
            {processedSize ? 'Processed' : 'Processing'}
          </div>
          <div className={styles.sizeValue}>
            {processedSize ? (
              <>
                <i className="fas fa-file-check"></i>
                {formatSize(processedSize)}
              </>
            ) : (
              <>
                <div className={styles.spinner}></div>
                Processing...
              </>
            )}
          </div>
        </div>
      </div>

      {showPercentage && (originalSize && processedSize) && (
        <div className={`${styles.reductionInfo} ${getReductionClass()}`}>
          <i className={getReductionIcon()}></i>
          <span>{getReductionText()}</span>
        </div>
      )}

      {isCalculating && (
        <div className={styles.calculatingInfo}>
          <div className={styles.spinner}></div>
          <span>Calculating size difference...</span>
        </div>
      )}
    </div>
  );
};

export default SizeComparison;
