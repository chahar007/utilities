import { Helmet } from "react-helmet";

export const MainPageHelmet = () => {
    return (
        <Helmet>
              {/* Primary Meta Tags */}
            <title>Utilix Pro - Free PDF & Image Toolkit | Compress, Convert, Edit</title>
            <meta 
                name="description" 
                content="Utilix Pro - The ultimate free online toolkit for PDF and image processing. Split, merge, rotate, watermark, edit metadata, compress, convert, and optimize files effortlessly." 
            />
            <meta 
                name="keywords" 
                content="Utilix Pro, free PDF tools, split PDF, merge PDF, rotate PDF, PDF watermark, edit PDF metadata, reorder PDF pages, compress images, convert files, online document editor" 
            />

            {/* Open Graph / Social Media */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.origin} />
            <meta property="og:title" content="Utilix Pro - Advanced PDF & Image Editor | Free Online Toolkit" />
            <meta 
                property="og:description" 
                content="Utilix Pro offers free, powerful tools to split, merge, rotate, watermark PDFs, and optimize images. A complete browser-based solution with no installation required." 
            />
            {/* <meta property="og:image" content={`${window.location.origin}/preview-image.jpg`} /> */}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Utilix Pro - Professional PDF & Image Tools Online" />
            <meta 
                name="twitter:description" 
                content="Edit, compress, split, merge PDFs & images effortlessly. Utilix Pro provides free, high-quality tools for document and image optimization in your browser." 
            />
            {/* <meta name="twitter:image" content={`${window.location.origin}/twitter-preview.jpg`} /> */}

            {/* Canonical */}
            <link rel="canonical" href={window.location.origin} />

            {/* Schema.org Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "Utilix Pro - PDF & Image Toolkit",
                    "url": window.location.origin,
                    "description": "Utilix Pro is a free online toolkit for PDF and image manipulation, offering tools to compress, convert, split, merge, watermark, and optimize files.",
                    "applicationCategory": ["BusinessApplication", "UtilitiesApplication"],
                    "operatingSystem": "Any",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "featureList": {
                        "@type": "ItemList",
                        "itemListElement": [
                            {"@type": "ListItem", "position": 1, "name": "Split PDF (Custom Range)"},
                            {"@type": "ListItem", "position": 2, "name": "Merge PDF Files"},
                            {"@type": "ListItem", "position": 3, "name": "Rotate PDF Pages"},
                            {"@type": "ListItem", "position": 4, "name": "Reorder PDF Pages"},
                            {"@type": "ListItem", "position": 5, "name": "Add Watermark to PDF"},
                            {"@type": "ListItem", "position": 6, "name": "Edit PDF Metadata"},
                            {"@type": "ListItem", "position": 7, "name": "Custom Split PDF (Advanced)"},
                            {"@type": "ListItem", "position": 8, "name": "Batch PDF Processing"},
                            {"@type": "ListItem", "position": 9, "name": "Convert Images (JPG, PNG, WebP)"},
                            {"@type": "ListItem", "position": 10, "name": "Compress Images"},
                            {"@type": "ListItem", "position": 11, "name": "Base64 Image Encoding"},
                            {"@type": "ListItem", "position": 12, "name": "Rotate Image"},
                            {"@type": "ListItem", "position": 13, "name": "Crop Image"},
                            {"@type": "ListItem", "position": 14, "name": "Optimize Image"}
                        ]
                    },
                    "fileFormatSupport": ["PDF", "JPG", "JPEG", "SVG", "PNG", "WebP"]
                })}
            </script>
        </Helmet>
    );
};