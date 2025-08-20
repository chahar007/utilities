import React from 'react';
import styles from './ImageToolLayout.module.scss';

const ImageToolLayout = ({ 
  title, 
  description, 
  children,
  className = '',
  helmet 
}) => {
  return (
    <div className={`${styles.imageToolLayout} ${className}`}>
      {helmet}
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          {children}
        </div>
      </section>
    </div>
  );
};

export default ImageToolLayout;
