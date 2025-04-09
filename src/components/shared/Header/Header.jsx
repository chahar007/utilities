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
    setTimeout(() => {
      const outletElement = document.querySelector(".outlet");
      if (outletElement) {
          outletElement.scrollTo({ top: 0, behavior: "smooth" });
      }
  }, 100); // Delay ensures DOM updates before scrolling

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
              <li><Link to="/pdf/merge-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/merge-pdf') ? styles.active : ''}>Merge PDF</Link></li>
              <li><Link to="/pdf/split-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/split-pdf') ? styles.active : ''}>Split PDF</Link></li>
              <li><Link to="/pdf/image-to-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/image-to-pdf') ? styles.active : ''}>Image to PDF</Link></li>
              <li><Link to="/pdf/watermark-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/watermark-pdf') ? styles.active : ''}>Add Watermark PDF</Link></li>
              <li><Link to="/pdf/edit-meta-data-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/edit-meta-data-pdf') ? styles.active : ''}>Edit Meta Data PDF</Link></li>
              <li><Link to="/pdf/reorder-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/reorder-pdf') ? styles.active : ''}>Reorder PDF</Link></li>
              <li><Link to="/pdf/rotate-pdf" onClick={handleLinkClick} className={location.pathname.includes('/pdf/rotate-pdf') ? styles.active : ''}>Rotate PDF</Link></li>
            </ul>
          </li>

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

          <li  className={`${styles.singleItem} ${activeDropdown === "other" ? styles.active : ''} `} >
              <Link to="/about-us" onClick={handleLinkClick} className={location.pathname.includes('/about-us') ? styles.active : ''}>About Us</Link>
            </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;