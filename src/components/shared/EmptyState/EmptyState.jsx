import React from 'react';
import styles from './EmptyState.module.scss';

const EmptyState = ({ 
  icon = 'fas fa-cloud-upload-alt',
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <i className={`${icon} ${styles.icon}`}></i>
        </div>
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
