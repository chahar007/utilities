import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.scss";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Image Utility Tools */}
        <div className={styles.footerSection}>
          <h2>Image Tools</h2>
          <ul className={styles.footerLinks}>
            <li onClick={() => navigate("/image/conversion")}>Image Conversion</li>
            <li onClick={() => navigate("/image/compression")}>Image Compression</li>
            <li onClick={() => navigate("/image/resizing")}>Image Resizing</li>
            <li onClick={() => navigate("/image/base64-converter")}>Base64 Converter</li>
            <li onClick={() => navigate("/image/crop-image")}>Crop Image</li>
            <li onClick={() => navigate("/image/rotate-image")}>Rotate Image</li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h2>PDF Tools</h2>
          <ul className={styles.footerLinks}>
            <li onClick={() => navigate("/pdf/merge-pdf")}>Merge PDF</li>
            <li onClick={() => navigate("/pdf/split-pdf")}>Split PDF</li>
            <li onClick={() => navigate("/pdf/image-to-pdf")}>Image to PDF</li>
            <li onClick={() => navigate("/pdf/watermark-pdf")}>Watermark PDF</li>
            <li onClick={() => navigate("/pdf/edit-meta-data-pdf")}>Edit Meta Data PDF</li>
            <li onClick={() => navigate("/pdf/reorder-pdf")}>Reorder PDF</li>
            <li onClick={() => navigate("/pdf/rotate-pdf")}>Rotate PDF</li>
          </ul>
        </div>

        {/* Other External Tools */}
        <div className={styles.footerSection}>
          <h2>More Tools</h2>
          <a href="https://gameplay.in.net/" target="_blank" rel="noopener noreferrer">
            GameInfo & Game Hub
          </a>
        </div>

        {/* Legal & Copyright */}
        <div className={styles.footerSection}>
          <h2>Legal</h2>
          <ul className={styles.footerLinks}>
            <li onClick={() => navigate("/about-us")}>About Us</li>
            <li onClick={() => navigate("/contact-us")}>Contact Us</li>
            <li onClick={() => navigate("/privacy-policy")}>Privacy Policy</li>
            <li onClick={() => navigate("/terms-of-service")}>Terms of Service</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Image Utility Tool. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
