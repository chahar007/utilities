import { Helmet } from "react-helmet"

const HomeHelmet = () => {

    return (
        <Helmet>
        <title>Image Optimization Tool | Compress, Resize, and Convert Images Online</title>
        <meta name="description" content="Optimize your images effortlessly with our all-in-one tool. Compress, resize, and convert images into multiple formats while maintaining quality." />
        <meta name="keywords" content="image optimization, image compression, resize images, convert images, online image tool, JPG, PNG, WebP" />
        <meta name="author" content="YourName" />
        <meta property="og:title" content="Image Optimization Tool" />
        <meta property="og:description" content="Optimize your images with ease. Compress, resize, and convert images online in various formats like JPG, PNG, and WebP." />
        {/* <meta property="og:image" content="URL-to-home-thumbnail.jpg" /> */}
        <meta property="og:url" content={window.location.origin} />
        <link rel="canonical" href={window.location.origin} />
        <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Image Optimization Tool",
              "url": `${window.location.origin}`,
              "description":
                "Compress, resize, and convert your images online with our powerful and user-friendly tool.",
              "mainEntity": {
                "@type": "WebApplication",
                "name": "Image Optimization Tool",
                "url": `${window.location.origin}`,
                "potentialAction": {
                  "@type": "SearchAction",
                //   "target": "https://yourwebsite.com/?q={search_term}",
                //   "query-input": "required name=search_term"
                }
              },
            })}
          </script>
      </Helmet>
    )
}


export default HomeHelmet