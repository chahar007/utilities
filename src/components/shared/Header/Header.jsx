import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss'; // Importing SCSS file
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const Header = () => {
  const [dropdown, setDropdown] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => setDropdown(menu);
  const handleMouseLeave = () => setDropdown(null);
  
  useEffect(() => {
    const outletElement = document.querySelector(".outlet");
    if (outletElement) {
      outletElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]); // Runs when route changes


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
                <li><Link to="/image-compression">Compress JPG</Link></li>
                <li><Link to="/image-compression">Compress PNG</Link></li>
                <li><Link to="/image-compression">Compress WebP</Link></li>
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
                <li><Link to="/image-resizer">Resize JPG</Link></li>
                <li><Link to="/image-resizer">Resize PNG</Link></li>
                <li><Link to="/image-resizer">Resize WebP</Link></li>
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
                <li><Link to="/image-conversion">Convert to JPG</Link></li>
                <li><Link to="/image-conversion">Convert to PNG</Link></li>
                <li><Link to="/image-conversion">Convert to WebP</Link></li>
                <li><Link to="/image-base64-converter">Convert to Base64</Link></li>
              </ul>
            )}
          </li>


          {/* Image Convert Dropdown */}
          <li 
            className={styles.navItem}
            onMouseEnter={() => handleMouseEnter("convert")}
            onMouseLeave={handleMouseLeave}
          >
            <span>More Tools <i className="fas fa-chevron-down"></i></span>
            {dropdown === "convert" && (
              <ul className={styles.dropdown}>
                <li><Link to="/crop-image">Crop Image</Link></li>
                <li> <Link to="/rotate-image">Rotate Image</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
