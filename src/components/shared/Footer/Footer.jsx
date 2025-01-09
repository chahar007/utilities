// src/components/Footer.js
import React from 'react';
import styles from './Footer.module.scss';  // Import the SCSS module

const Footer = () => {
  return (
    <footer className={styles.footerStrip}>
      <div className={styles.footerContent}>
        <p>&copy; 2023 Image Utility Tool | All rights reserved</p>
        <div className={styles.socialIcons}>
          <a href="#" className={styles.socialLink}><i className="fab fa-facebook-f"></i></a>
          <a href="#" className={styles.socialLink}><i className="fab fa-twitter"></i></a>
          <a href="#" className={styles.socialLink}><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
