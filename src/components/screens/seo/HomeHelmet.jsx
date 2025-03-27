import { Helmet } from "react-helmet";

const HomeHelmet = () => {
    return (
        <Helmet>
            <title>Image Optimization | Compress, Resize, Convert Formats and Base64 Encode & Decode Images</title>
            <meta 
                name="description" 
                content="Optimize your images effortlessly with our all-in-one tool. Compress, resize, and convert images into multiple formats, including Base64 encoding." 
            />
            <meta 
                name="keywords" 
                content="image optimization, image compression, resize images, convert images, online image tool, JPG, PNG, WebP, Base64 converter, image to Base64, encode images" 
            />
            <meta name="author" content="YourName" />
            <meta property="og:title" content="Image Optimization & Base64 Converter" />
            <meta 
                property="og:description" 
                content="Optimize and convert your images easily. Compress, resize, and encode images to Base64 format online in various formats like JPG, PNG, and WebP." 
            />
            <meta property="og:url" content={window.location.origin} />
            <link rel="canonical" href={window.location.origin} />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Image Optimization & Base64 Converter",
                    "url": `${window.location.origin}`,
                    "description": "Compress, resize, convert, and encode images to Base64 format online with our powerful and user-friendly tool.",
                    "mainEntity": {
                        "@type": "WebApplication",
                        "name": "Image Optimization & Base64 Converter",
                        "url": `${window.location.origin}`,
                        "potentialAction": {
                            "@type": "SearchAction",
                            // "target": "https://yourwebsite.com/?q={search_term}",
                            // "query-input": "required name=search_term"
                        }
                    }
                })}
            </script>
        </Helmet>
    );
};

export default HomeHelmet;
