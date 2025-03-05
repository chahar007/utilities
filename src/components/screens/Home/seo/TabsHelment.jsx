import { Helmet } from "react-helmet";


export const CompressionHelmet = () => {
    return (
        <Helmet>
            <title>Image Compression Tool | Reduce Image File Size Online</title>
            <meta name="description" content="Compress your images to reduce file size without compromising quality. Perfect for optimizing images for web use and storage." />
            <meta name="keywords" content="image compression, reduce image size, online image compressor, optimize images, compress JPG, PNG, WebP" />
            <meta property="og:title" content="Image Compression Tool" />
            <meta property="og:description" content="Reduce your image file size while preserving quality. Compress images online in seconds." />
            {/* <meta property="og:image" content="URL-to-compression-thumbnail.jpg" /> */}
            <meta property="og:url" content={window.location.origin} />
            <link rel="canonical" href={window.location.origin + '/image-compression'} />
        </Helmet>

    )
}


export const ConversionHelmet = () => {
    return (
        <Helmet>
            <title>Image Conversion Tool | Convert Images to JPG, PNG, WebP</title>
            <meta name="description" content="Convert your images to multiple formats like JPG, PNG, and WebP. Maintain quality while switching formats effortlessly." />
            <meta name="keywords" content="image conversion, convert images, online image converter, convert to JPG, PNG, WebP, image formats" />
            <meta property="og:title" content="Image Conversion Tool" />
            <meta property="og:description" content="Convert your images to popular formats such as JPG, PNG, and WebP online." />
            {/* <meta property="og:image" content="URL-to-conversion-thumbnail.jpg" /> */}
            <meta property="og:url" content={window.location.origin} />
            <link rel="canonical" href={window.location.origin + '/image-optimisation'} />
        </Helmet>
    )
}


export const ResizingHelment = () => {
    return (

        <Helmet>
            <title>Image Resizing Tool | Resize Images Online</title>
            <meta name="description" content="Easily resize your images to fit your needs. Adjust dimensions while maintaining aspect ratio and image quality." />
            <meta name="keywords" content="image resizing, resize images, online image resizer, adjust image dimensions, resize JPG, PNG, WebP" />
            <meta property="og:title" content="Image Resizing Tool" />
            <meta property="og:description" content="Resize images online with ease. Adjust dimensions to fit your needs while preserving quality." />
            {/* <meta property="og:image" content="URL-to-resizing-thumbnail.jpg" /> */}
            <meta property="og:url" content={window.location.origin} />
            <link rel="canonical" href={window.location.origin+'/image-resizer'} />
        </Helmet>
    )
}


export const Base64Helmet = () => {
    return (
        <Helmet>
            <title>Image to Base64 Converter | Convert Images to Base64 Online</title>
            <meta 
                name="description" 
                content="Convert images to Base64 encoding quickly and easily. Generate Base64 strings for JPG, PNG, and WebP formats for web and app development." 
            />
            <meta 
                name="keywords" 
                content="image to base64, base64 converter, convert image to base64 online, png to base64, jpg to base64, webp to base64, base64 encoding" 
            />
            <meta property="og:title" content="Image to Base64 Converter" />
            <meta 
                property="og:description" 
                content="Easily convert images to Base64 format online. Perfect for embedding images in HTML, CSS, or JSON data." 
            />
            <meta property="og:url" content={window.location.origin + '/image-resizer'} />
            <link rel="canonical" href={window.location.origin + '/image-resizer'} />
        </Helmet>
    );
};

