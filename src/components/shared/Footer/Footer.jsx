

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
  const navigate = useNavigate();
  const [showFooter, setShowFooter] = useState(false);

  const handleNavigation = (slug) => {
    navigate(slug);
  };

  useEffect(() => {
    let _timer = setTimeout(() => {
      let _element = document.getElementById('footerIndex');
      if (_element) {
        _element.remove();
      }
      setShowFooter(true)
      clearTimeout(_timer);
    }, 5000);
  }, [])

  return (
    <>
      {showFooter ?
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            {/* About Section */}
            <div className={styles.footerAbout}>
              <h2>About Game Hub</h2>
              <p>
                Game Hub is your ultimate gaming destination, offering the latest news, reviews, trailers, and system requirements for your favorite games.
              </p>
              <p>Stay connected with us and explore the world of gaming!</p>
            </div>

            {/* Quick Links */}
            <div className={styles.footerLinks}>
              <h2>Quick Links</h2>
              <ul>
                <li onClick={() => handleNavigation('/about')}>About Us</li>
                <li onClick={() => handleNavigation('/games')}>All Games</li>
                <li onClick={() => handleNavigation('/reviews')}>Reviews</li>
                <li onClick={() => handleNavigation('/trailers')}>Trailers</li>
                <li onClick={() => handleNavigation('/contact')}>Contact Us</li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className={styles.footerNewsletter}>
              <h2>Stay Updated</h2>
              <p>Subscribe to our newsletter for the latest gaming news and updates.</p>
              <form>
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>

            {/* Social Media Links */}
            <div className={styles.footerSocial}>
              <h2>Follow Us</h2>
              <div className={styles.socialIcons}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/facebook.svg" alt="Facebook" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/twitter.svg" alt="Twitter" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/instagram.svg" alt="Instagram" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/youtube.svg" alt="YouTube" />
                </a>
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div className={styles.footerLegal}>
            <p>&copy; 2025 Game Hub. All Rights Reserved.</p>
            <ul>
              <li onClick={() => handleNavigation('/terms')}>Terms of Service</li>
              <li onClick={() => handleNavigation('/privacy')}>Privacy Policy</li>
            </ul>
          </div>
        </footer>
        : null}
    </>
  );
};

export default Footer;
