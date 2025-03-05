// src/components/Header.js
import React, {useState} from 'react';
import styles from   './Header.module.scss'; // Import the CSS for the header
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [activeTab, setActiveTab] = useState('conversion');

  const navigate = useNavigate();


  const handleNavigation= () => {
    navigate('/image-optimisation');
  }


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <i className="fas fa-image"></i>
        <span>Image Utility Tool</span>
      </div>
      <nav>
        {/* <a className={activeTab === 'conversion' ? styles.active : ''} onClick={() => handleNavigation}>Image Optimization</a> */}
        {/* <a>Help</a> */}
      </nav>
    </header>
  );
};

export default Header;
