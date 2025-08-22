import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from './About.module.scss';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.about}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>About Utilix Pro</h1>
          <p className={styles.heroSubtitle}>Your Free Online Toolkit for Smarter File Management</p>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Mission Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Our Mission</h2>
            <p>Transforming complex file processing into simple, accessible solutions</p>
          </div>
          <p className={styles.paragraph}>
            At <strong>Utilix Pro</strong>, we transform complex file processing into simple, one-click solutions. 
            Designed for students, professionals, and businesses, our platform helps <strong>over 100,000 users monthly</strong> 
            optimize their document workflows with professional-grade tools that are completely free to use.
          </p>
        </section>

        {/* Core Features Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Core Features</h2>
            <p>Professional-grade tools designed for every file processing need</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>PDF Power Tools</h3>
              <ul>
                <li>Compress PDFs (up to 90% size reduction)</li>
                <li>Merge/Split documents seamlessly</li>
                <li>Add/remove watermarks</li>
                <li>Edit metadata & permissions</li>
                <li>Rotate and reorder pages</li>
                <li>Extract text and images</li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <h3>Image Optimization</h3>
              <ul>
                <li>Compress JPG, PNG, WEBP formats</li>
                <li>Batch convert between formats</li>
                <li>Resize & rotate images</li>
                <li>Quality adjustment controls</li>
                <li>Base64 encoding/decoding</li>
                <li>Crop and edit images</li>
              </ul>
            </div>

            <div className={styles.featureCard}>
              <h3>Security & Privacy</h3>
              <ul>
                <li>All processing in your browser</li>
                <li>No file uploads to servers</li>
                <li>Military-grade encryption</li>
                <li>Automatic file deletion</li>
                <li>No registration required</li>
                <li>GDPR compliant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose Utilix Pro?</h2>
            <p>Discover the advantages that make our tools the preferred choice worldwide</p>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>🚀</span>
              <h3 className={styles.benefitTitle}>Instant Processing</h3>
              <p className={styles.benefitDescription}>Files process in under 5 seconds with our optimized algorithms. No waiting queues or processing delays.</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>💰</span>
              <h3 className={styles.benefitTitle}>100% Free</h3>
              <p className={styles.benefitDescription}>No hidden costs, subscriptions, or premium paywalls. All features available to everyone, always.</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>🌐</span>
              <h3 className={styles.benefitTitle}>Universal Access</h3>
              <p className={styles.benefitDescription}>Works on all devices and operating systems. Access from any modern browser without installation.</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>🔒</span>
              <h3 className={styles.benefitTitle}>Privacy First</h3>
              <p className={styles.benefitDescription}>Your files never leave your device. All processing happens locally with advanced client-side technology.</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>⚡</span>
              <h3 className={styles.benefitTitle}>Lightning Fast</h3>
              <p className={styles.benefitDescription}>Experience instant conversions with our browser-based technology. Handle files of any size efficiently.</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>🎯</span>
              <h3 className={styles.benefitTitle}>User-Friendly</h3>
              <p className={styles.benefitDescription}>Intuitive interface designed for simplicity. No technical knowledge required - just upload, convert, and download.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Simplify Your Workflow?</h2>
            <p className={styles.ctaDescription}>
              Join millions of users who trust our tools for their daily file processing needs. 
              Start converting and optimizing your files today!
            </p>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.primaryButton}
                onClick={() => navigate('/all-tools')}
              >
                Explore All Tools <i className="fas fa-arrow-right"></i>
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => navigate('/contact')}
              >
                Contact Our Team <i className="fas fa-envelope"></i>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
