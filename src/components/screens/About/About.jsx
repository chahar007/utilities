import React from "react";

const About = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>About Utilix Pro</h1>
        <p style={styles.tagline}>Your Free Online Toolkit for Smarter File Management</p>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.paragraph}>
            At <strong>Utilix Pro</strong>, we transform complex file processing into simple, one-click solutions. 
            Designed for students, professionals, and businesses, our platform helps <strong>over 100,000 users monthly</strong> 
            optimize their document workflows.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Core Features</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>PDF Power Tools</h3>
              <ul style={styles.featureList}>
                <li>Compress PDFs (up to 90% size reduction)</li>
                <li>Merge/Split documents seamlessly</li>
                <li>Add/remove watermarks</li>
                <li>Edit metadata & permissions</li>
              </ul>
            </div>

            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Image Optimization</h3>
              <ul style={styles.featureList}>
                <li>Compress JPG, PNG, WEBP</li>
                <li>Batch convert formats</li>
                <li>Resize & rotate images</li>
                <li>Quality adjustment</li>
              </ul>
            </div>

            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>Security & Privacy</h3>
              <ul style={styles.featureList}>
                <li>All processing in your browser</li>
                <li>No file uploads to servers</li>
                <li>Military-grade encryption</li>
                <li>Automatic file deletion</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
          <div style={styles.benefits}>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>🚀</span>
              <h3 style={styles.benefitTitle}>Instant Processing</h3>
              <p>Files process in under 5 seconds – no waiting queues</p>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>💰</span>
              <h3 style={styles.benefitTitle}>100% Free</h3>
              <p>No hidden costs or premium paywalls</p>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.benefitIcon}>🌐</span>
              <h3 style={styles.benefitTitle}>Browser-Based</h3>
              <p>Works on all devices without installation</p>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Ready to Simplify Your Workflow?</h2>
          <div style={styles.buttonGroup}>
            <a href="/" style={styles.primaryButton}>Explore All Tools</a>
            <a href="/contact-us" style={styles.secondaryButton}>Contact Our Team</a>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    lineHeight: 1.6,
    color: "#c9d1d9",
    backgroundColor: "#0d1117",
    minHeight: "100vh"
  },
  header: {
    // background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    color: "#fff",
    padding: "2rem 1rem",
    textAlign: "center"
  },
  heading: {
    fontSize: "2.5rem",
    margin: "0 0 0.5rem",
    fontWeight: "700",
    background: "linear-gradient(90deg, #58a6ff 0%, #1f6feb 100%)",
    backgroundClip: "text",
    color: "transparent",
  },
  tagline: {
    fontSize: "1.25rem",
    opacity: 0.85,
    margin: 0
  },
  main: {
    maxWidth: "1200px",
    margin: "1rem auto",
    padding: "0 1rem"
  },
  section: {
    backgroundColor: "#161b22",
    borderRadius: "8px",
    padding: "2rem",
    marginBottom: "2rem"
  },
  sectionTitle: {
    color: "#58a6ff",
    fontSize: "1.5rem",
    marginTop: 0,
    marginBottom: "1.5rem",
    fontWeight: "600"
  },
  paragraph: {
    fontSize: "1.1rem",
    margin: "0 0 1.5rem"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem"
  },
  featureCard: {
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "1.5rem",
    backgroundColor: "#0d1117"
  },
  featureTitle: {
    color: "#79c0ff",
    fontSize: "1.25rem",
    marginTop: 0,
    marginBottom: "1rem"
  },
  featureList: {
    paddingLeft: "1.25rem",
    margin: 0
  },
  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem"
  },
  benefitItem: {
    textAlign: "center",
    padding: "1rem"
  },
  benefitIcon: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    display: "block"
  },
  benefitTitle: {
    color: "#58a6ff",
    margin: "0.5rem 0"
  },
  ctaSection: {
    textAlign: "center",
    padding: "3rem 1rem",
    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    color: "#fff",
    borderRadius: "8px"
  },
  ctaTitle: {
    fontSize: "1.75rem",
    margin: "0 0 1.5rem"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap"
  },
  primaryButton: {
    backgroundColor: "#58a6ff",
    color: "#0d1117",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600"
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600"
  },
  footer: {
    backgroundColor: "#161b22",
    color: "#8b949e",
    padding: "1.5rem",
    textAlign: "center"
  },
  footerText: {
    margin: 0
  },
  footerLinks: {
    marginLeft: "1rem"
  },
  footerLink: {
    color: "#58a6ff",
    textDecoration: "none",
    margin: "0 0.5rem"
  }
};

export default About;
