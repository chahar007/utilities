import React from "react";
import styles from './Contact.module.scss';

const Contact = () => {
  return (
    <div className={styles.contact}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSubtitle}>Let's connect – we'd love to hear from you</p>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Help Section */}
        <section className={styles.section}>
          <div className={styles.contentCard}>
            <h2 className={styles.cardTitle}>
              <i className="fas fa-headset"></i>
              We're Here to Help
            </h2>
            <div className={styles.cardContent}>
              <p>
                Whether you have a question about a feature, found a bug, or just want to collaborate, 
                our dedicated team is here and happy to assist you with any inquiries.
              </p>
              <p>
                <strong>Support Hours:</strong> Monday to Friday, 10:00 AM – 6:00 PM IST
              </p>
              <div className={styles.responseTime}>
                <i className="fas fa-clock"></i>
                <span>Most queries are answered within 24–48 hours</span>
              </div>
              <p>
                Feel free to drop us a line – we truly appreciate your feedback, suggestions, and ideas! 
                Your input helps us improve and grow our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Get In Touch</h2>
            <p>Ready to reach out? Here's how you can contact our team</p>
          </div>
          
          <div className={styles.contactInfo}>
            <a href="mailto:utilix.pro@gmail.com" className={styles.contactMethod}>
              <div className={styles.contactIcon}>
                <i className="fas fa-envelope"></i>
              </div>
              <div className={styles.contactDetails}>
                <p className={styles.contactLabel}>Email us at</p>
                <p className={styles.contactValue}>utilix.pro@gmail.com</p>
              </div>
            </a>
          </div>
        </section>

        {/* Reasons to Contact */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Why Reach Out to Us?</h2>
            <p>Here are some great reasons to get in touch with our team</p>
          </div>
          
          <div className={styles.reasonsGrid}>
            <div className={styles.reasonCard}>
              <div className={styles.reasonIcon}>💡</div>
              <div className={styles.reasonContent}>
                <h4>Feature Suggestions</h4>
                <p>Got an idea for a new tool or feature? We'd love to hear your suggestions and feedback!</p>
              </div>
            </div>
            
            <div className={styles.reasonCard}>
              <div className={styles.reasonIcon}>🐞</div>
              <div className={styles.reasonContent}>
                <h4>Bug Reports</h4>
                <p>Spotted an error or bug on the platform? Help us improve by reporting any issues you encounter.</p>
              </div>
            </div>
            
            <div className={styles.reasonCard}>
              <div className={styles.reasonIcon}>🤝</div>
              <div className={styles.reasonContent}>
                <h4>Partnerships</h4>
                <p>Interested in collaborating or partnering with us? Let's explore opportunities together.</p>
              </div>
            </div>
            
            <div className={styles.reasonCard}>
              <div className={styles.reasonIcon}>📣</div>
              <div className={styles.reasonContent}>
                <h4>Business Inquiries</h4>
                <p>Want to promote your product or service through Utilix Pro? Get in touch for business opportunities.</p>
              </div>
            </div>
            
            <div className={styles.reasonCard}>
              <div className={styles.reasonIcon}>❓</div>
              <div className={styles.reasonContent}>
                <h4>General Questions</h4>
                <p>Have questions about our tools or just want to say hi? We're all ears and love hearing from users!</p>
              </div>
            </div>
            
            <div className={styles.reasonCard}>
              <div className={styles.reasonIcon}>🌟</div>
              <div className={styles.reasonContent}>
                <h4>Feedback & Reviews</h4>
                <p>Share your experience using our tools. Your feedback helps us improve and serve you better.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <div className={styles.teamContent}>
            <h2 className={styles.teamTitle}>Our Commitment to You</h2>
            <p className={styles.teamDescription}>
              We're passionate about providing the best file processing experience. 
              Our team is dedicated to helping you succeed with our tools.
            </p>
            
            <div className={styles.teamFeatures}>
              <div className={styles.teamFeature}>
                <i className="fas fa-reply"></i>
                <span>Quick Response</span>
              </div>
              <div className={styles.teamFeature}>
                <i className="fas fa-users"></i>
                <span>Friendly Team</span>
              </div>
              <div className={styles.teamFeature}>
                <i className="fas fa-lightbulb"></i>
                <span>Expert Solutions</span>
              </div>
              <div className={styles.teamFeature}>
                <i className="fas fa-heart"></i>
                <span>User-Focused</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
