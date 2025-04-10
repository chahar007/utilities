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
            <a href="https://dynamiccalculator.com/" target="_blank" rel="noopener noreferrer">
              Dynamic Calculator
            </a>
          </div>
        </div>

        {/* SEO Schema Markup */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Utilix Pro - Free PDF & Image Toolkit",
              "url": "https://utilix.pro/",
              "description": "Utilix Pro is a free online toolkit for PDF and image manipulation, offering tools to compress, convert, split, merge, watermark, and optimize files.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://utilix.pro/search?q={search_term}",
                "query-input": "required name=search_term"
              },
              // "sameAs": [
              //   "https://www.facebook.com/utilixpro",
              //   "https://twitter.com/utilixpro",
              //   "https://www.linkedin.com/company/utilixpro"
              // ],
              "applicationCategory": ["BusinessApplication", "UtilitiesApplication"],
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": {
                "@type": "ItemList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Split PDF (Custom Range)" },
                  { "@type": "ListItem", "position": 2, "name": "Merge PDF Files" },
                  { "@type": "ListItem", "position": 3, "name": "Rotate PDF Pages" },
                  { "@type": "ListItem", "position": 4, "name": "Reorder PDF Pages" },
                  { "@type": "ListItem", "position": 5, "name": "Add Watermark to PDF" },
                  { "@type": "ListItem", "position": 6, "name": "Edit PDF Metadata" },
                  { "@type": "ListItem", "position": 7, "name": "Custom Split PDF (Advanced)" },
                  { "@type": "ListItem", "position": 8, "name": "Batch PDF Processing" },
                  { "@type": "ListItem", "position": 9, "name": "Convert Images (JPG, PNG, WebP)" },
                  { "@type": "ListItem", "position": 10, "name": "Compress Images" },
                  { "@type": "ListItem", "position": 11, "name": "Base64 Image Encoding" },
                  { "@type": "ListItem", "position": 12, "name": "Rotate Image" },
                  { "@type": "ListItem", "position": 13, "name": "Crop Image" },
                  { "@type": "ListItem", "position": 14, "name": "Optimize Image" }
                ]
              },
              "fileFormatSupport": ["PDF", "JPG", "JPEG", "SVG", "PNG", "WebP"]
            }
            )}

          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Dynamic Calculator",
            "url": "https://dynamiccalculator.com/",
            "description": "Dynamic Calculator brings together the most useful calculators for daily life—from finance tools like investment and loan EMI calculators, modern sip calculator, Can I Afford, Interest Calculation, No Cost EMI Calculator to everyday math, BMI checkers, and more.",
            "publisher": {
              "@type": "Organization",
              "name": "Dynamic Calculator",
              "url": "https://dynamiccalculator.com/"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://dynamiccalculator.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}

          </script>
        </Helmet>
      </footer>
    </>
  );
};

export default Footer;
