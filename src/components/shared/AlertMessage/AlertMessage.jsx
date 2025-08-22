import React from 'react';
import styles from './AlertMessage.module.scss';

const AlertMessage = ({ 
  type = 'info', // 'error', 'success', 'warning', 'info'
  message, 
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  showIcon = true,
  closeable = true
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(() => onClose(), 300); // Wait for animation
    }
  };

  const getIcon = () => {
    const icons = {
      error: 'fas fa-exclamation-triangle',
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
  };

  if (!message || !isVisible) {
    return null;
  }

  return (
    <div className={styles.alertMessage}>
      <div className={`${styles.alert} ${styles[type]}`}>
        {showIcon && <i className={getIcon()}></i>}
        <span className={styles.message} dangerouslySetInnerHTML={{ __html: message }}></span>
        {closeable && (
          <button onClick={handleClose} className={styles.alertClose}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
