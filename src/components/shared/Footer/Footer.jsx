import React from 'react';
import styles from './Footer.module.scss'; // Make sure this is correct
import { Helmet } from "react-helmet";

const Footer = () => {


  const openUrl = () => {
    window.open('', '_blank')
  }


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
            <h3>Other Tools</h3>
            <a href="https://utilix.pro/" target="_blank" rel="noopener noreferrer">
              Optimize Your Images
            </a>
          </div>
        </div>

        {/* SEO Schema Markup */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Utilix | Image Optimize Tool",
              "url": "https://utilix.pro/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://utilix.pro/search?q={search_term}",
                "query-input": "required name=search_term",
              },
            })}
          </script>
        </Helmet>
      </footer>
    </>
  );
};

export default Footer;
