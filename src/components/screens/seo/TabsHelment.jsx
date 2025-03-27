import { Helmet } from "react-helmet";

export const CompressionHelmet = () => {
    return (
        <Helmet>
            <title>Image Compression Tool - Reduce Image Size Online | Utilix Pro</title>
            <meta name="description" content="Compress images online with Utilix Pro. Reduce file sizes while maintaining quality—ideal for web, social media, and storage optimization." />
            <meta name="keywords" content="image compression, reduce image size, online image compressor, optimize images, compress JPG, PNG, WebP" />
            <meta property="og:title" content="Compress Images Online - Utilix Pro" />
            <meta property="og:description" content="Reduce image file size without losing quality. Optimize your images online for free with Utilix Pro." />
            <meta property="og:url" content={window.location.origin + '/image-compression'} />
            <link rel="canonical" href={window.location.origin + '/image-compression'} />
        </Helmet>
    );
};

export const ConversionHelmet = () => {
    return (
        <Helmet>
            <title>Image Converter - Convert Images to JPG, PNG, WebP | Utilix Pro</title>
            <meta name="description" content="Easily convert images to JPG, PNG, and WebP formats with Utilix Pro. Maintain quality while switching formats effortlessly." />
            <meta name="keywords" content="image conversion, convert images, online image converter, convert to JPG, PNG, WebP, image formats" />
            <meta property="og:title" content="Convert Images Online - Utilix Pro" />
            <meta property="og:description" content="Convert your images to multiple formats like JPG, PNG, and WebP instantly. Try Utilix Pro now!" />
            <meta property="og:url" content={window.location.origin + '/image-conversion'} />
            <link rel="canonical" href={window.location.origin + '/image-conversion'} />
        </Helmet>
    );
};

export const ResizingHelmet = () => {
    return (
        <Helmet>
            <title>Image Resizer - Resize Images Online for Free | Utilix Pro</title>
            <meta name="description" content="Resize images online with Utilix Pro. Adjust dimensions while keeping aspect ratio and image quality intact." />
            <meta name="keywords" content="image resizing, resize images, online image resizer, adjust image dimensions, resize JPG, PNG, WebP" />
            <meta property="og:title" content="Resize Images Online - Utilix Pro" />
            <meta property="og:description" content="Easily resize images online for social media, websites, and more. Quick and free!" />
            <meta property="og:url" content={window.location.origin + '/image-resizer'} />
            <link rel="canonical" href={window.location.origin + '/image-resizer'} />
        </Helmet>
    );
};

export const Base64Helmet = () => {
    return (
        <Helmet>
            <title>Convert Image to Base64 Online - JPG, PNG, WebP | Utilix Pro</title>
            <meta name="description" content="Use Utilix Pro to convert images to Base64 encoding online. Generate Base64 strings for JPG, PNG, and WebP formats easily." />
            <meta name="keywords" content="image to base64, base64 converter, convert image to base64, png to base64, jpg to base64, webp to base64" />
            <meta property="og:title" content="Convert Image to Base64 - Utilix Pro" />
            <meta property="og:description" content="Convert images to Base64 format quickly. Ideal for embedding images in HTML, CSS, or JSON." />
            <meta property="og:url" content={window.location.origin + '/image-to-base64'} />
            <link rel="canonical" href={window.location.origin + '/image-to-base64'} />
        </Helmet>
    );
};

export const CropImageHelmet = () => {
    return (
        <Helmet>
            <title>Crop Image Online - Free Image Cropping Tool | Utilix Pro</title>
            <meta name="description" content="Crop images online easily with Utilix Pro. Adjust and resize images for social media, websites, and app development." />
            <meta name="keywords" content="crop image, image cropping tool, online image cropper, free crop image tool, photo crop, resize and crop, crop jpg, crop png, crop webp" />
            <meta property="og:title" content="Crop Images Online - Utilix Pro" />
            <meta property="og:description" content="Use our simple and fast image cropper to crop and resize images online. Perfect for social media and web use." />
            <meta property="og:url" content={window.location.origin + '/crop-image'} />
            <link rel="canonical" href={window.location.origin + '/crop-image'} />
        </Helmet>
    );
};

export const RotateImageHelmet = () => {
    return (
        <Helmet>
            <title>Rotate Image Online - Free Image Rotation Tool | Utilix Pro</title>
            <meta name="description" content="Rotate images online instantly with Utilix Pro. Adjust orientation for social media, websites, and more." />
            <meta name="keywords" content="rotate image, image rotator, online image rotation, free rotate image tool, rotate jpg, rotate png, rotate webp, flip image, adjust image orientation" />
            <meta property="og:title" content="Rotate Images Online - Utilix Pro" />
            <meta property="og:description" content="Quickly rotate images online for free. Adjust orientation for better visibility on social media and web platforms." />
            <meta property="og:url" content={window.location.origin + '/rotate-image'} />
            <link rel="canonical" href={window.location.origin + '/rotate-image'} />
        </Helmet>
    );
};
