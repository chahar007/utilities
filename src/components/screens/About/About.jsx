import React from 'react';
import styles from './About.module.scss';

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Game Hub</h1>
          <p>
            Your ultimate destination for everything gaming. Explore the latest updates, reviews, and guides across PC, mobile, and other gaming platforms.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <h2>Who We Are</h2>
        <p>
          Game Hub is a one-stop platform for gaming enthusiasts. Whether you're a casual gamer or a hardcore player, we've got you covered with comprehensive guides, reviews, and updates about your favorite games.
        </p>
        <p>
          Our mission is to provide gamers with the most accurate and up-to-date information about PC, mobile, console, and other gaming platforms.
        </p>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2>What We Offer</h2>
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>PC Games</h3>
            <p>
              Stay updated with the latest releases, reviews, system requirements, and guides for the best PC games.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Mobile Games</h3>
            <p>
              Discover trending mobile games, in-depth reviews, and tips to enhance your gaming experience on the go.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Other Platforms</h3>
            <p>
              Explore games on consoles, VR, and other platforms. We bring you news and updates from every corner of the gaming world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <h2>Our Mission</h2>
        <p>
          At Game Hub, we believe in creating a thriving community of gamers. Our mission is to connect gamers worldwide with accurate information, engaging content, and a shared passion for games.
        </p>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <h2>Join the Community</h2>
        <p>
          Be a part of our ever-growing gaming community. Subscribe to our newsletter for updates, tips, and exclusive content!
        </p>
        <button className={styles.subscribeButton}>Subscribe Now</button>
      </section>
    </div>
  );
};

export default AboutUs;
