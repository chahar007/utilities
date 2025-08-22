import React from 'react';
import styles from './ProcessingButton.module.scss';

const ProcessingButton = ({ 
  onClick,
  isProcessing = false,
  disabled = false,
  processingText = 'Processing...',
  defaultText = 'Process',
  icon = 'fas fa-cogs',
  processingIcon = null,
  variant = 'primary', // 'primary', 'secondary', 'download', 'success'
  size = 'medium', // 'small', 'medium', 'large'
  fullWidth = false,
  showSpinner = true,
  className = ''
}) => {
  const getButtonClass = () => {
    let classes = [styles.processingButton];
    
    if (variant) classes.push(styles[variant]);
    if (size) classes.push(styles[size]);
    if (fullWidth) classes.push(styles.fullWidth);
    if (isProcessing) classes.push(styles.processing);
    if (disabled || isProcessing) classes.push(styles.disabled);
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  const getIcon = () => {
    if (isProcessing) {
      return processingIcon || (showSpinner ? null : 'fas fa-spinner');
    }
    return icon;
  };

  const getText = () => {
    return isProcessing ? processingText : defaultText;
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={getButtonClass()}
      type="button"
    >
      {isProcessing && showSpinner && (
        <div className={styles.spinner}></div>
      )}
      
      {getIcon() && !showSpinner && (
        <i className={getIcon()}></i>
      )}
      
      {!showSpinner && isProcessing && processingIcon === null && (
        <i className="fas fa-spinner fa-spin"></i>
      )}
      
      <span>{getText()}</span>
    </button>
  );
};

export default ProcessingButton;
