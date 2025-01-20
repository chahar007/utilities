// src/components/Header.js
import React, {useState} from 'react';
import styles from   './Header.module.scss'; // Import the CSS for the header
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [activeTab, setActiveTab] = useState('conversion');

  const navigate = useNavigate();


  const handleNavigation= (slug='/') => {
    navigate(slug);
  }


  return (
    <header className={styles.header}>
      <div className={styles.logo} >
        <i className="fas fa-image"></i>
        <span onClick={() => handleNavigation('/')} >Gamers Zone</span>
      </div>
      <nav>
        <a onClick={() => handleNavigation('/about-us')} >About Us</a>
        <a>Help</a>
      </nav>
    </header>
  );
};

export default Header;
