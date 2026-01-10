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

        {/* Technology Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Our Technology</h2>
            <p>Built with cutting-edge web technologies for reliability and performance</p>
          </div>
          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <h3>Client-Side Processing</h3>
              <p>All file processing happens directly in your browser using advanced JavaScript libraries. This ensures maximum privacy, security, and speed without relying on external servers.</p>
            </div>
            <div className={styles.techCard}>
              <h3>Modern Web Standards</h3>
              <p>Built using React and modern web APIs, ensuring compatibility across all devices and browsers. Our tools work seamlessly on desktop, tablet, and mobile devices.</p>
            </div>
            <div className={styles.techCard}>
              <h3>Continuous Improvement</h3>
              <p>We regularly update our tools with new features, performance improvements, and bug fixes based on user feedback and technological advancements.</p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Who Uses Utilix Pro?</h2>
            <p>Our tools serve professionals, students, and businesses across various industries</p>
          </div>
          <div className={styles.useCasesGrid}>
            <div className={styles.useCaseCard}>
              <h3>Web Developers</h3>
              <p>Optimize images for websites, convert formats, and compress files to improve page load times and Core Web Vitals scores. Essential for modern web development workflows.</p>
            </div>
            <div className={styles.useCaseCard}>
              <h3>Content Creators</h3>
              <p>Resize images for social media, compress photos for faster uploads, and convert between formats to meet platform requirements. Perfect for bloggers, photographers, and social media managers.</p>
            </div>
            <div className={styles.useCaseCard}>
              <h3>Business Professionals</h3>
              <p>Merge PDF documents, add watermarks, edit metadata, and optimize files for email distribution. Streamline document workflows and improve productivity.</p>
            </div>
            <div className={styles.useCaseCard}>
              <h3>Students & Educators</h3>
              <p>Compress assignment files, convert images for presentations, and organize PDF documents. Free tools that support academic work without breaking the budget.</p>
            </div>
            <div className={styles.useCaseCard}>
              <h3>Designers</h3>
              <p>Convert design files, optimize images for portfolios, and prepare assets for client delivery. Professional-grade tools for creative professionals.</p>
            </div>
            <div className={styles.useCaseCard}>
              <h3>Small Businesses</h3>
              <p>Process invoices, optimize product images, and manage document workflows without expensive software subscriptions. Cost-effective solutions for growing businesses.</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🔓</span>
              <h3>Free & Accessible</h3>
              <p>We believe powerful tools should be available to everyone, regardless of budget. Our platform remains completely free, with no premium tiers or hidden costs.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🔒</span>
              <h3>Privacy First</h3>
              <p>Your data never leaves your device. We've built our platform with privacy as a core principle, ensuring your files remain completely private and secure.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>⚡</span>
              <h3>Performance</h3>
              <p>We optimize every aspect of our tools for speed and efficiency. Fast processing means you can accomplish more in less time.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>💡</span>
              <h3>Innovation</h3>
              <p>We continuously improve our tools based on user feedback and emerging technologies. Innovation drives us to provide better solutions.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🤝</span>
              <h3>User-Centric</h3>
              <p>Every feature we build starts with understanding user needs. We design tools that are intuitive, powerful, and genuinely useful.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🌍</span>
              <h3>Global Reach</h3>
              <p>Our tools are available worldwide, supporting users in multiple languages and time zones. We're committed to serving a global community.</p>
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
                onClick={() => navigate('/contact-us')}
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
