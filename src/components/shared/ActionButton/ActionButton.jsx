import React from 'react';
import styles from './ActionButton.module.scss';

const ActionButton = ({ 
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props
}) => {
  const buttonClass = `
    ${styles.actionButton} 
    ${styles[variant]} 
    ${styles[size]} 
    ${disabled ? styles.disabled : ''} 
    ${loading ? styles.loading : ''} 
    ${className}
  `.trim();

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className={styles.spinner}></div>}
      {icon && !loading && <i className={`${icon} ${styles.icon}`}></i>}
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export default ActionButton;
