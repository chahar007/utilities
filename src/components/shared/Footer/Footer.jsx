import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.scss'; // Import the SCSS module
import { Helmet } from 'react-helmet';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (slug) => {
    navigate(slug); // SPA-friendly navigation
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
            <li>
              <a onClick={() => handleNavigation('/imageOptimisation')} role="button">
                Conversion
              </a>
            </li>
            <li>
              <a onClick={() => handleNavigation('/imageCompression')} role="button">
                Compression
              </a>
            </li>
            <li>
              <a onClick={() => handleNavigation('/imageResizer')} role="button">
                Resizing
              </a>
            </li>
            <li>
              <a onClick={() => handleNavigation('/imageBase64Converter')} role="button">
                Base64 Conversion
              </a>
            </li>
          </ul>
        </section>

        {/* External Link (Already Correct) */}
        <section className={styles.footerTools}>
          <h2>Our Other Tool</h2>
          <a href="https://gameplay.in.net/" target="_blank" rel="noopener noreferrer">
            GameInfo and Game Hub
          </a>
        </section>
      </div>

      {/* SEO Schema Markup */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "GameInfo & Game Hub",
            "url": "https://gameplay.in.net/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://your-game-app.com/search?q={search_term}",
              "query-input": "required name=search_term",
            },
            "description": "Find the latest game information and play mini-games online.",
          })}
        </script>
      </Helmet>
    </footer>
  );
};

export default Footer;
