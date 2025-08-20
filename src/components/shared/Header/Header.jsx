import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.scss';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { imageKeyMappings } from '../../../assets/images/imageKeyMapping';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeAll = () => {
    setMenuOpen(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const outletElement = document.querySelector(".outlet");
      if (outletElement) {
        const scrollTop = outletElement.scrollTop;
        setIsScrolled(scrollTop > 50);
      }
    };

    const outletElement = document.querySelector(".outlet");
    if (outletElement) {
      outletElement.addEventListener('scroll', handleScroll);
      return () => outletElement.removeEventListener('scroll', handleScroll);
    }
  }, []);



  return (
    <header ref={headerRef} className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
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
          <li className={styles.navItem}>
            <Link to="/all-tools" onClick={handleLinkClick} className={location.pathname === '/all-tools' ? styles.active : ''}>
              All Tools
            </Link>
          </li>
          
          <li className={styles.navItem}>
            <Link to="/about-us" onClick={handleLinkClick} className={location.pathname.includes('/about-us') ? styles.active : ''}>
              About Us
            </Link>
          </li>
          
          <li className={styles.navItem}>
            <Link to="/contact-us" onClick={handleLinkClick} className={location.pathname.includes('/contact-us') ? styles.active : ''}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;