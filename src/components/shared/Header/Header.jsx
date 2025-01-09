// src/components/Header.js
import React, {useState} from 'react';
import styles from   './Header.module.scss'; // Import the CSS for the header

const Header = () => {
  const [activeTab, setActiveTab] = useState('conversion');
  
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <i className="fas fa-image"></i>
        <span>Image Utility Tool</span>
      </div>
      <nav>
        <a href="#" className={activeTab === 'conversion' ? styles.active : ''} onClick={() => setActiveTab('conversion')}>Conversion</a>
        <a href="#" className={activeTab === 'compression' ? styles.active : ''} onClick={() => setActiveTab('compression')}>Compression</a>
        <a href="#" className={activeTab === 'resizing' ? styles.active : ''} onClick={() => setActiveTab('resizing')}>Resizing</a>
        <a href="#">Help</a>
      </nav>
    </header>
  );
};

export default Header;
