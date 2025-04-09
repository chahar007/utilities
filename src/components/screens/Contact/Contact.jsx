import React from "react";

const Contact = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.heading}>Contact Us</h1>
        <p style={styles.tagline}>Let’s connect – we’d love to hear from you</p>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>We’re Here to Help</h2>
          <p style={styles.paragraph}>
            Whether you have a question about a feature, found a bug, or just want to collaborate, our team is here and happy to assist.
          </p>
          <p style={styles.paragraph}>
            <strong>Support Hours:</strong> Monday to Friday, 10:00 AM – 6:00 PM IST
          </p>
          <p style={styles.paragraph}>
            Most queries are answered within 24–48 hours. Feel free to drop us a line – we truly appreciate your feedback and ideas!
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Reasons to Contact Us</h2>
          <ul style={styles.bulletList}>
            <li>💡 Got a suggestion for a new tool or feature?</li>
            <li>🐞 Spotted a bug or error on the platform?</li>
            <li>🤝 Want to partner or collaborate with us?</li>
            <li>📣 Interested in promoting your product through Utilix Pro?</li>
            <li>❓ Just want to say hi or give feedback? We’re all ears!</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Email</h2>
          <p style={styles.paragraph}>
            📧 Email us at: <a href="mailto:utilix.pro@gmail.com" style={styles.emailLink}>utilix.pro@gmail.com</a>
          </p>
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
    // backgroundColor: "#1f6feb",
    color: "#fff",
    padding: "2rem 1rem",
    textAlign: "center",
    // background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
    background: "linear-gradient(90deg, #58a6ff 0%, #1f6feb 100%)",
    backgroundClip: "text",
    color: "transparent",
  },
  heading: {
    fontSize: "2.5rem",
    margin: "0 0 0.5rem",
    fontWeight: "700"
  },
  tagline: {
    fontSize: "1.25rem",
    color: "#8b949e",
  },
  main: {
    maxWidth: "800px",
    margin: "1rem auto",
    padding: "0 1rem"
  },
  section: {
    backgroundColor: "#161b22",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    padding: "2rem",
    marginBottom: "2rem"
  },
  sectionTitle: {
    color: "#58a6ff",
    fontSize: "1.5rem",
    marginTop: 0,
    marginBottom: "1rem",
    fontWeight: "600"
  },
  paragraph: {
    fontSize: "1.1rem",
    margin: "0 0 1rem"
  },
  emailLink: {
    color: "#58a6ff",
    textDecoration: "none"
  },
  bulletList: {
    fontSize: "1.05rem",
    paddingLeft: "1.2rem",
    listStyle: "none",
    lineHeight: 1.8
  },
  socialList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  socialLink: {
    display: "inline-block",
    marginBottom: "0.5rem",
    color: "#58a6ff",
    textDecoration: "none",
    fontSize: "1.1rem"
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

export default Contact;
