import React, { useState } from 'react';
import styles from './Header.module.scss'; // Importing SCSS file
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropdown, setDropdown] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => setDropdown(menu);
  const handleMouseLeave = () => setDropdown(null);

  return (
    <header className={styles.header}>
      {/* Logo Section */}
      <div className={styles.logo} onClick={() => navigate('/')}>
        <i className="fas fa-image"></i>
        <span>Utilix Pro</span>
      </div>

      {/* Navigation Section */}
      <nav className={styles.navbar}>
        <ul className={styles.navLinks}>
          
          {/* Image Compression Dropdown */}
          <li 
            className={styles.navItem}
            onMouseEnter={() => handleMouseEnter("compression")}
            onMouseLeave={handleMouseLeave}
          >
            <span>Image Compression <i className="fas fa-chevron-down"></i></span>
            {dropdown === "compression" && (
              <ul className={styles.dropdown}>
                <li><Link to="/compress/jpg">Compress JPG</Link></li>
                <li><Link to="/compress/png">Compress PNG</Link></li>
                <li><Link to="/compress/webp">Compress WebP</Link></li>
              </ul>
            )}
          </li>

          {/* Image Resize Dropdown */}
          <li 
            className={styles.navItem}
            onMouseEnter={() => handleMouseEnter("resize")}
            onMouseLeave={handleMouseLeave}
          >
            <span>Image Resize <i className="fas fa-chevron-down"></i></span>
            {dropdown === "resize" && (
              <ul className={styles.dropdown}>
                <li><Link to="/resize/jpg">Resize JPG</Link></li>
                <li><Link to="/resize/png">Resize PNG</Link></li>
                <li><Link to="/resize/webp">Resize WebP</Link></li>
              </ul>
            )}
          </li>

          {/* Image Convert Dropdown */}
          <li 
            className={styles.navItem}
            onMouseEnter={() => handleMouseEnter("convert")}
            onMouseLeave={handleMouseLeave}
          >
            <span>Image Convert <i className="fas fa-chevron-down"></i></span>
            {dropdown === "convert" && (
              <ul className={styles.dropdown}>
                <li><Link to="/convert/jpg">Convert to JPG</Link></li>
                <li><Link to="/convert/png">Convert to PNG</Link></li>
                <li><Link to="/convert/webp">Convert to WebP</Link></li>
              </ul>
            )}
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;
