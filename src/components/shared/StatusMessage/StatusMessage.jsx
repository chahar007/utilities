import React from 'react';
import styles from './StatusMessage.module.scss';

const StatusMessage = ({ 
  message, 
  type = 'info', 
  onClose,
  className = '',
  showIcon = true 
}) => {
  if (!message) return null;

  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  return (
    <div className={`${styles.statusMessage} ${styles[type]} ${className}`}>
      {showIcon && <i className={`${icons[type]} ${styles.icon}`}></i>}
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default StatusMessage;
