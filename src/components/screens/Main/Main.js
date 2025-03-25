import { Link } from 'react-router-dom';
import styles from './Main.module.scss';
import { useState } from "react";
import { MainHelmet } from '../Home/seo/TabsHelment';
import { IMAGE_FEATURES, PDF_FEATURES, FAQs, HOW_TO_USE_DATA } from '../../../assets/constants/app.constant';

const FeatureCard = ({ title, description, link, icon, category }) => {
    return (
        <Link to={link} className={styles.featureLink}>
            <div className={`${styles.featureCard} ${styles[category]}`}>
                <div className={styles.featureIcon}>
                    <i className={icon}></i>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className={styles.featureTag}>{category}</span>
            </div>
        </Link>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.faqItem} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.faqQuestion}>
                <h3>{question}</h3>
                <span>{isOpen ? "−" : "+"}</span>
            </div>
            {isOpen && <p className={styles.faqAnswer}>{answer}</p>}
        </div>
    );
};

const FAQSection = () => {
    return (
        <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqContainer}>
                {FAQs.map((faq, index) => (
                    <FAQItem key={index} {...faq} />
                ))}
            </div>
        </section>
    );
};

const HowToUseSection = () => {
    return (
        <section className={styles.howToUseSection}>
            <h2>How To Use Our Tools</h2>
            <div className={styles.howToColumns}>
                {HOW_TO_USE_DATA.map((category, index) => (
                    <div key={index} className={styles.howToColumn}>
                        <h3>{category.category}</h3>
                        {category.tools.map((tool, toolIndex) => (
                            <div key={toolIndex} className={styles.howToItem}>
                                <h4>{tool.title}</h4>
                                <ol>
                                    {tool.steps.map((step, stepIndex) => (
                                        <li key={stepIndex}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

const Main = () => {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className={styles.mainContainer}>
            <MainHelmet />

            <header className={styles.heroSection}>
                <h1>Streamline Your Documents & Images</h1>
                <p>
                    Professional-grade tools for optimizing, converting, and editing PDFs and images - completely free and secure.
                </p>
                <div className={styles.toolsNavigation}>
                    <button 
                        className={`${styles.navButton} ${activeTab === 'all' ? styles.active : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Tools
                    </button>
                    <button 
                        className={`${styles.navButton} ${activeTab === 'image' ? styles.active : ''}`}
                        onClick={() => setActiveTab('image')}
                    >
                        Image Tools
                    </button>
                    <button 
                        className={`${styles.navButton} ${activeTab === 'pdf' ? styles.active : ''}`}
                        onClick={() => setActiveTab('pdf')}
                    >
                        PDF Tools
                    </button>
                </div>
            </header>

            <section className={styles.featuresGrid}>
                {(activeTab === 'all' || activeTab === 'image') && 
                    IMAGE_FEATURES?.map((feature, index) => (
                        <FeatureCard
                            key={`img-${index}`}
                            title={feature.title}
                            description={feature.description}
                            link={feature.link}
                            icon={feature.icon}
                            category="Image"
                        />
                    ))
                }
                
                {(activeTab === 'all' || activeTab === 'pdf') && 
                    PDF_FEATURES?.map((feature, index) => (
                        <FeatureCard
                            key={`pdf-${index}`}
                            title={feature.title}
                            description={feature.description}
                            link={feature.link}
                            icon={feature.icon}
                            category="PDF"
                        />
                    ))
                }
            </section>

            <HowToUseSection />

            <section className={styles.benefitsSection}>
                <h2>Why Choose Our Tools?</h2>
                <div className={styles.benefitsGrid}>
                    <div className={styles.benefitCard}>
                        <i className="fas fa-bolt"></i>
                        <h3>Lightning Fast</h3>
                        <p>Process files directly in your browser with no waiting time</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <i className="fas fa-lock"></i>
                        <h3>100% Secure</h3>
                        <p>Your files never leave your device - no server uploads</p>
                    </div>
                    <div className={styles.benefitCard}>
                        <i className="fas fa-infinity"></i>
                        <h3>No Limits</h3>
                        <p>Unlimited usage with no watermarks or restrictions</p>
                    </div>
                </div>
            </section>

            <FAQSection />

            <section className={styles.ctaSection}>
                <h2>Ready to Optimize Your Workflow?</h2>
                <p>Start using our tools today and experience the difference</p>
                <div className={styles.ctaButtons}>
                    <Link to="/image-tools" className={styles.primaryButton}>Try Image Tools</Link>
                    <Link to="/pdf-tools" className={styles.secondaryButton}>Try PDF Tools</Link>
                </div>
            </section>
        </div>
    );
};

export default Main;