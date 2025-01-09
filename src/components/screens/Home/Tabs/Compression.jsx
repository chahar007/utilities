import React, { useState } from 'react';
import styles from './styles/Compression.module.scss';
import UploadFileHandling from '../components/UploadFileHandling';
import imageCompression from 'browser-image-compression'; // Assuming you're using this library for compression

const Compression = () => {
  const [error, setError] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [imageDetails, setImageDetails] = useState({
    name: "",
    dimensions: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState(null);

  const handleFileUpload = (file) => {
    setError(null);
    setCompressedPreviewUrl(null);
    setOriginalSize(null);
    setCompressedSize(null);

    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setError("Please upload a valid image file.");
        return;
      }

      const fileSizeInKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeInKB);

      const img = new Image();
      img.onload = () => {
        setImageDetails({
          name: file.name,
          dimensions: `${img.width}x${img.height}px`,
        });
      };
      img.onerror = () => {
        setError("Error loading image.");
      };
      img.src = URL.createObjectURL(file);

      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setError("Please upload an image first.");
    }
  };

  const handleCompression = async () => {
    if (!previewUrl) {
      setError("Please upload an image first.");
      return;
    }

    try {
      // Set compression options
      const options = {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 800, // Maximum width or height (in px)
        useWebWorker: true, // Enable Web Worker for better performance
      };

      const file = await fetch(previewUrl).then(res => res.blob());
      const compressedFile = await imageCompression(file, options);

      const compressedFileSizeInKB = (compressedFile.size / 1024).toFixed(2);
      setCompressedSize(compressedFileSizeInKB);

      setCompressedPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (err) {
      setError("Error compressing the image.");
    }
  };

  const handleDownloadCompressedImage = () => {
    if (!compressedPreviewUrl) {
      setError("No compressed image to download.");
      return;
    }

    const link = document.createElement("a");
    link.href = compressedPreviewUrl;
    link.download = "compressed_image.jpg"; // Name of the downloaded image
    link.click();
  };

  return (
    // <div className={styles.compression}>

    //   {/* Error Message */}
    //   {error && <div className={styles.errorMessage}>{error}</div>}

    //   {/* File Upload Component */}
    //   <UploadFileHandling onFileUpload={handleFileUpload} />

    //   {/* No File Uploaded */}
    //   {!previewUrl && <div className={styles.noFileMessage}>No image uploaded yet. Please upload an image to compress.</div>}

    //   <div className={styles.imageContainer}>
    //     {/* Original Image Section */}
    //     {previewUrl && (
    //       <div>
    //         <img src={previewUrl} alt="Original" />
    //         <div className={styles.imageDetails}>
    //           <p><strong>Name:</strong> {imageDetails.name}</p>
    //           <p><strong>Dimensions:</strong> {imageDetails.dimensions}</p>
    //           <p><strong>Size:</strong> {originalSize} KB</p>
    //         </div>
    //       </div>
    //     )}

    //     {/* Compressed Image Section */}
    //     {compressedPreviewUrl && (
    //       <div>
    //         <img src={compressedPreviewUrl} alt="Compressed" />
    //         <div className={styles.imageDetails}>
    //           <p><strong>Size:</strong> {compressedSize} KB</p>
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   {/* Compression Info */}
    //   {compressedPreviewUrl && (
    //     <div className={styles.compressionInfo}>
    //       <p>Compression Successful!</p>
    //       <p>Original Size: {originalSize} KB</p>
    //       <p>Compressed Size: {compressedSize} KB</p>
    //     </div>
    //   )}

    //   {/* Compression Controls */}
    //   <div className={styles.compressionControls}>
    //     <button onClick={handleCompression} className={styles.uploadButton}>
    //       Compress Image
    //     </button>
    //     {compressedPreviewUrl && (
    //       <button onClick={handleDownloadCompressedImage} className={styles.downloadButton}>
    //         Download Compressed Image
    //       </button>
    //     )}
    //   </div>
    // </div>

    <div className={styles.compression}>

  {/* Error Message */}
  {error && <div className={styles.errorMessage}>{error}</div>}

  {/* File Upload Component */}
  <UploadFileHandling onFileUpload={handleFileUpload} />

  {/* No File Uploaded */}
  {!previewUrl && <div className={styles.noFileMessage}>No image uploaded yet. Please upload an image to compress.</div>}

  <div className={styles.imageContainer}>
    {/* Original Image Section */}
    {previewUrl && (
      <div className={styles.originalImage}>
        <img src={previewUrl} alt="Original" />
        <div className={styles.imageDetails}>
          <p><strong>Original Size:</strong> {originalSize} KB</p>
        </div>
      </div>
    )}

    {/* Compressed Image Section */}
    {compressedPreviewUrl && (
      <div className={styles.compressedImage}>
        <img src={compressedPreviewUrl} alt="Compressed" />
        <div className={styles.imageDetails}>
          <p><strong>Compressed Size:</strong> {compressedSize} KB</p>
        </div>
      </div>
    )}
  </div>

  {/* Compression Controls */}
  <div className={styles.compressionControls}>
    <button onClick={handleCompression} className={styles.uploadButton}>
      Compress Image
    </button>
    {compressedPreviewUrl && (
      <button onClick={handleDownloadCompressedImage} className={styles.downloadButton}>
        Download Compressed Image
      </button>
    )}
  </div>
</div>

  );
};

export default Compression;
