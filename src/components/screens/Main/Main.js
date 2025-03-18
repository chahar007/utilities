import { Link } from 'react-router-dom';
import styles from './Main.module.scss';

const Main = () => {

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

    

    return (
        <div className={styles.mainContainer}>
            <div className={styles.heroSection}>
                <h1>All-in-One Image Editing & Optimization Tools</h1>
                <p>
                    Compress, resize, convert, and optimize images effortlessly.  
                    Enhance your image quality while reducing file size – perfect for web and social media!
                </p>
            </div>

            <div className={styles.featuresGrid}>
                <FeatureCard 
                    title="Compress Images" 
                    description="Reduce image file size while maintaining high quality."
                    link="/image-compression"
                    icon="fas fa-compress"
                />
                <FeatureCard 
                    title="Resize Images" 
                    description="Resize and scale images for websites, social media, and printing."
                    link="/image-resizer"
                    icon="fas fa-expand-arrows-alt"
                />
                <FeatureCard 
                    title="Convert Images" 
                    description="Easily convert image formats (JPG, PNG, WebP) with just one click."
                    link="/image-conversion"
                    icon="fas fa-exchange-alt"
                />
                <FeatureCard 
                    title="Optimize Images" 
                    description="Make images load faster on websites without sacrificing quality."
                    link="/image-conversion"
                    icon="fas fa-magic"
                />
                <FeatureCard 
                    title="Base 64 Conversion" 
                    description="Create the base 64 string from the image"
                    link="/image-base64-converter"
                    icon="fas fa-eraser"
                />
                <FeatureCard 
                    title="Crop Images" 
                    description="Crop your images to the perfect size for social media."
                    link="/crop-image"
                    icon="fas fa-crop"
                />
                <FeatureCard 
                    title="Rotate Images" 
                    description="Rotate your images to the perfect size for social media."
                    link="/rotate-image"
                    icon="fas fa-crop"
                />
            </div>
        </div>
    );
};

export default Main;
