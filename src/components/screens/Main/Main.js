import { Link } from 'react-router-dom';
import styles from './Main.module.scss';
import { Helmet } from 'react-helmet';
import { useState } from "react";

const FeatureCard = ({ title, description, link, icon }) => {
    return (
        <div className={styles.featureCard}>
            <i className={icon}></i>
            <h3>{title}</h3>
            <p>{description}</p>
            <Link to={link} className={styles.featureLink}>Try Now</Link>
        </div>
    );
};

const MainHelmet = () => {
    return (
        <Helmet>
            <title>All-in-One Image Editing Tools | Compress, Resize, Convert Images Online</title>
            <meta
                name="description"
                content="Optimize and edit images online with our free tools. Compress, resize, convert, and enhance images for web and social media. Fast, secure, and easy to use."
            />
        </Helmet>
    )
}

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.faqItem} onClick={() => setIsOpen(!isOpen)}>
            <h3>{question} <span>{isOpen ? "−" : "+"}</span></h3>
            {isOpen && <p>{answer}</p>}
        </div>
    );
};

const FAQSection = () => {
    const faqs = [
        {
            question: "How does image compression work?",
            answer: "Our tool reduces file size by optimizing image data without significantly affecting quality.",
        },
        {
            question: "Is this tool free to use?",
            answer: "Yes! All our tools are completely free with no sign-up required.",
        },
        {
            question: "What formats do you support?",
            answer: "We support JPG, PNG, and WebP formats for conversion and optimization.",
        },
        {
            question: "What is the best image format for websites?",
            answer: "WebP is the best format for websites as it offers superior compression and quality compared to JPG and PNG. Our tools support WebP conversion for optimal performance.",
        },
    ];

    return (
        <section className={styles.faqSection}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqContainer}>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} {...faq} />
                ))}
            </div>
        </section>
    );
};

const HowToUseSection = () => {
    return (
        <section className={styles.howToUseSection}>
            <h2>How to Use Our Image Tools</h2>

            <div className={styles.howToUseGrid}>
                <div className={styles.howToItem}>
                    <h3>Image Compression</h3>
                    <p>Reduce file size without losing quality:</p>
                    <ul>
                        <li>Upload an image or drag & drop.</li>
                        <li>Set compression level (auto or manual).</li>
                        <li>Click "Compress" and download the optimized file.</li>
                    </ul>
                </div>

                <div className={styles.howToItem}>
                    <h3>Image Resizing</h3>
                    <p>Resize images without quality loss:</p>
                    <ul>
                        <li>Upload an image.</li>
                        <li>Enter new dimensions or maintain aspect ratio.</li>
                        <li>Click "Resize" and download the updated image.</li>
                    </ul>
                </div>

                <div className={styles.howToItem}>
                    <h3>Image Cropping</h3>
                    <p>Remove unwanted areas easily:</p>
                    <ul>
                        <li>Upload an image.</li>
                        <li>Select the crop area using the drag tool.</li>
                        <li>Click "Crop" and download your adjusted image.</li>
                    </ul>
                </div>

                <div className={styles.howToItem}>
                    <h3>Rotate Image</h3>
                    <p>Adjust image orientation:</p>
                    <ul>
                        <li>Upload an image.</li>
                        <li>Select a rotation angle (90°, 180°, 270°).</li>
                        <li>Click "Rotate" and download your modified image.</li>
                    </ul>
                </div>

                <div className={styles.howToItem}>
                    <h3>Image Conversion</h3>
                    <p>Convert images to different formats:</p>
                    <ul>
                        <li>Upload an image.</li>
                        <li>Select the output format (JPG, PNG, WebP).</li>
                        <li>Click "Convert" and download the new file.</li>
                    </ul>
                </div>

                <div className={styles.howToItem}>
                    <h3>Base64 Conversion</h3>
                    <p>Encode images into Base64 format:</p>
                    <ul>
                        <li>Upload an image.</li>
                        <li>Click "Convert to Base64".</li>
                        <li>Copy the Base64 code for use in HTML, CSS, or emails.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};


const Main = () => {
    return (
        <div className={styles.mainContainer}>
            
            <MainHelmet />

            <header className={styles.heroSection}>
                <h1>All-in-One Image Editing & Optimization Tools</h1>
                <p>
                    Compress, resize, convert, and optimize images effortlessly. Enhance image quality while reducing file size – perfect for web and social media!
                </p>
            </header>

            <section className={styles.featuresGrid}>
                <FeatureCard
                    title="Compress Images"
                    description="Reduce image file size without losing quality. Perfect for faster website loading, saving storage space, and improving SEO. Supports JPG, PNG, and WebP formats."
                    link="/image-compression"
                    icon="fas fa-compress"
                />
                <FeatureCard
                    title="Resize Images"
                    description="Resize and scale images effortlessly for websites, social media, and printing. Maintain aspect ratio and quality while adjusting dimensions to fit your needs."
                    link="/image-resizer"
                    icon="fas fa-expand-arrows-alt"
                />
                <FeatureCard
                    title="Convert Images"
                    description="Easily convert image formats (JPG, PNG, WebP) with just one click. Ideal for compatibility across platforms and optimizing images for specific use cases."
                    link="/image-conversion"
                    icon="fas fa-exchange-alt"
                />
                <FeatureCard
                    title="Optimize Images"
                    description="Make images load faster on websites without sacrificing quality. Reduce file size and improve performance for better user experience and SEO rankings."
                    link="/image-optimization"
                    icon="fas fa-magic"
                />
                <FeatureCard
                    title="Base64 Conversion"
                    description="Convert images to Base64 format for easy embedding in web applications, emails, and CSS. Simplify your workflow with this powerful encoding tool."
                    link="/image-base64-converter"
                    icon="fas fa-code"
                />
                <FeatureCard
                    title="Crop Images"
                    description="Crop images to the perfect size for social media, websites, and more. Remove unwanted areas and focus on the most important parts of your image."
                    link="/crop-image"
                    icon="fas fa-crop"
                />
                <FeatureCard
                    title="Rotate Images"
                    description="Adjust image orientation with ease. Rotate images 90°, 180°, or 270° to correct alignment or create unique visual effects."
                    link="/rotate-image"
                    icon="fas fa-sync-alt"
                />
            </section>


            <HowToUseSection />


            {/* SEO & Content Enhancement */}
            <section className={styles.aboutSection}>
                <h2>Why Choose Our Image Editing Tools?</h2>
                <p>
                    Our online image tools provide high-quality processing with advanced algorithms to ensure fast and reliable image transformation. Whether you’re a designer, developer, or content creator, our tools help optimize your images for the best performance.
                </p>
                <ul>
                    <li><strong>Advanced Algorithms:</strong> Ensure high-quality output with minimal effort.</li>
                    <li><strong>User-Friendly Interface:</strong> Designed for both beginners and professionals.</li>
                    <li><strong>No Watermarks:</strong> Get clean, professional results every time.</li>
                </ul>
            </section>

            <section className={styles.benefitsSection}>
                <h2>Benefits of Using Our Tools</h2>
                <ul>
                    <li><strong>Fast Processing:</strong> Get instant results with our optimized tools.</li>
                    <li><strong>Secure:</strong> All processing is done locally on your device.</li>
                    <li><strong>Free to Use:</strong> No hidden charges, use all features for free.</li>
                    <li><strong>SEO-Friendly:</strong> Optimize images for better website performance.</li>
                    <li><strong>Cross-Platform:</strong> Works on all browsers and devices.</li>
                </ul>
            </section>


            <FAQSection />

        </div>
    );
};

export default Main;
