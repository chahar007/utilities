import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss'; // Import the SCSS module

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (slug) => {
    console.log('slug', slug);
    // Ensure that navigate does not call setState or any state change logic that would cause a re-render
    navigate(slug);
  };

  return (
    <footer className={styles.footerStrip}>
      <div className={styles.footerContent}>
        {/* Project Description for SEO */}
        <section className={styles.footerProject}>
          <h2>About the Project</h2>
          <p>Our Image Utility Tool provides users with a fast and easy way to compress, resize, and convert images online.</p>
        </section>

        {/* Image Tools for SEO */}
        <section className={styles.footerTools}>
          <h2>Image Tools</h2>
          <ul>
            <li><a>Compression</a></li>
            <li><a>Resizing</a></li>
            <li><a>Conversion</a></li>
          </ul>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
