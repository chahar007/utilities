import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss'; // Make sure this is correct

const Footer = () => {
  const navigate = useNavigate();
  const [showFooter, setShowFooter] = useState(false);

  const handleNavigation = (slug) => {
    navigate(slug);
  };

  useEffect(() => {
    // Additional logic if needed
  }, []);

  return (
    <>
      <footer id="footerIndex" className={styles.footer}> {/* Use styles.footer here */}
        <div className={styles.footerContainer}> {/* Use styles.footerContainer here */}
          <div className={styles.footerAbout}>
            <h3>About Game Hub</h3>
            <p>
              Game Hub is your one-stop destination for everything gaming. Explore the latest news, watch trailers, read reviews, and discover system requirements for your favorite games.
            </p>
            <p>Stay connected and dive into the world of gaming with us!</p>
          </div>
  
          <div className={styles.footerLinks}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/games">All Games</a></li>
              <li><a href="/reviews">Reviews</a></li>
              <li><a href="/trailers">Trailers</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
  
          <div className={styles.footerNewsletter}>
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for the latest gaming news and updates.</p>
            <form>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        {/* <div className="footer-legal">
          <p>&copy; 2025 Game Hub. All Rights Reserved.</p>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div> */}
      </footer>
    </>
  );
};

export default Footer;
