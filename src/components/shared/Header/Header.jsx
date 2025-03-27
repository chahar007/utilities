import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.scss';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { imageKeyMappings } from '../../../assets/images/imageKeyMapping';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = (menu) => {
    if (window.innerWidth <= 768) {
      // On mobile, toggle dropdown without closing others
      setActiveDropdown(activeDropdown === menu ? null : menu);
    } else {
      // On desktop, close other dropdowns when opening a new one
      setActiveDropdown(activeDropdown === menu ? null : menu);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) setActiveDropdown(null);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLinkClick = () => {
    if (menuOpen) closeAll();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeAll();
      }
    };
    
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  // Close dropdown when clicking anywhere on mobile
  useEffect(() => {
    const handleMobileClick = () => {
      if (window.innerWidth <= 768 && activeDropdown) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('click', handleMobileClick);
    return () => document.removeEventListener('click', handleMobileClick);
  }, [activeDropdown]);

  return (
    <header ref={headerRef} className={styles.header}>
      {menuOpen && <div className={styles.overlay} onClick={closeAll}></div>}

      <div className={styles.logo} onClick={() => navigate('/')}>
        {/* <i className="fas fa-image"></i> */}
        <img src={imageKeyMappings.appLogo} alt="" srcset="" />
        <span>Utilix Pro</span>
      </div>

      <div className={styles.menuToggle} onClick={toggleMenu}>
        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>

      <nav className={`${styles.navbar} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.navLinks}>
          {/* Image Compression Dropdown */}
          <li 
            className={`${styles.navItem} ${activeDropdown === "compression" ? styles.active : ''}`}
            onClick={(e) => {
              if (window.innerWidth <= 768) {
                e.stopPropagation(); // Prevent immediate closing on mobile
              }
              toggleDropdown("compression");
            }}
          >
            <span>Image Compression <i className="fas fa-chevron-down"></i></span>
            <ul className={styles.dropdown}>
              <li><Link to="/image-compression" onClick={handleLinkClick} className={location.pathname.includes('/image-compression') ? styles.active : ''}>Compress JPG</Link></li>
              <li><Link to="/image-compression" onClick={handleLinkClick} className={location.pathname.includes('/image-compression') ? styles.active : ''}>Compress PNG</Link></li>
              <li><Link to="/image-compression" onClick={handleLinkClick} className={location.pathname.includes('/image-compression') ? styles.active : ''}>Compress WebP</Link></li>
            </ul>
          </li>

          {/* Image Resize Dropdown */}
          <li 
            className={`${styles.navItem} ${activeDropdown === "resize" ? styles.active : ''}`}
            onClick={(e) => {
              if (window.innerWidth <= 768) e.stopPropagation();
              toggleDropdown("resize");
            }}
          >
            <span>Image Resize <i className="fas fa-chevron-down"></i></span>
            <ul className={styles.dropdown}>
              <li><Link to="/image-resizer" onClick={handleLinkClick} className={location.pathname.includes('/image-resizer') ? styles.active : ''}>Resize JPG</Link></li>
              <li><Link to="/image-resizer" onClick={handleLinkClick} className={location.pathname.includes('/image-resizer') ? styles.active : ''}>Resize PNG</Link></li>
              <li><Link to="/image-resizer" onClick={handleLinkClick} className={location.pathname.includes('/image-resizer') ? styles.active : ''}>Resize WebP</Link></li>
            </ul>
          </li>

          {/* Image Convert Dropdown */}
          <li 
            className={`${styles.navItem} ${activeDropdown === "convert" ? styles.active : ''}`}
            onClick={(e) => {
              if (window.innerWidth <= 768) e.stopPropagation();
              toggleDropdown("convert");
            }}
          >
            <span>Image Convert <i className="fas fa-chevron-down"></i></span>
            <ul className={styles.dropdown}>
              <li><Link to="/image-conversion" onClick={handleLinkClick} className={location.pathname.includes('/image-conversion') ? styles.active : ''}>Convert to JPG</Link></li>
              <li><Link to="/image-conversion" onClick={handleLinkClick} className={location.pathname.includes('/image-conversion') ? styles.active : ''}>Convert to PNG</Link></li>
              <li><Link to="/image-conversion" onClick={handleLinkClick} className={location.pathname.includes('/image-conversion') ? styles.active : ''}>Convert to WebP</Link></li>
              <li><Link to="/image-base64-converter" onClick={handleLinkClick} className={location.pathname.includes('/image-base64-converter') ? styles.active : ''}>Convert to Base64</Link></li>
            </ul>
          </li>

          {/* Other Tools Dropdown */}
          <li 
            className={`${styles.navItem} ${activeDropdown === "other" ? styles.active : ''}`}
            onClick={(e) => {
              if (window.innerWidth <= 768) e.stopPropagation();
              toggleDropdown("other");
            }}
          >
            <span>Other Tools <i className="fas fa-chevron-down"></i></span>
            <ul className={styles.dropdown}>
              <li><Link to="/crop-image" onClick={handleLinkClick} className={location.pathname.includes('/crop-image') ? styles.active : ''}>Crop Image</Link></li>
              <li><Link to="/rotate-image" onClick={handleLinkClick} className={location.pathname.includes('/rotate-image') ? styles.active : ''}>Rotate Image</Link></li>
            </ul>
          </li>

          {/* PDF Tools Dropdown */}
          <li 
            className={`${styles.navItem} ${activeDropdown === "pdf" ? styles.active : ''}`}
            onClick={(e) => {
              if (window.innerWidth <= 768) e.stopPropagation();
              toggleDropdown("pdf");
            }}
          >
            <span>PDF Tools <i className="fas fa-chevron-down"></i></span>
            <ul className={styles.dropdown}>
              <li><Link to="/pdf-merge" onClick={handleLinkClick} className={location.pathname.includes('/pdf-merge') ? styles.active : ''}>Merge PDF</Link></li>
              <li><Link to="/pdf-split" onClick={handleLinkClick} className={location.pathname.includes('/pdf-split') ? styles.active : ''}>Split PDF</Link></li>
              <li><Link to="/pdf-edit" onClick={handleLinkClick} className={location.pathname.includes('/pdf-edit') ? styles.active : ''}>Edit PDF</Link></li>
              <li><Link to="/pdf-compress" onClick={handleLinkClick} className={location.pathname.includes('/pdf-compress') ? styles.active : ''}>Compress PDF</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;