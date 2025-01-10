import React, { useState } from 'react';
import styles from './styles/Resizing.module.scss';
import UploadFileHandling from '../components/UploadFileHandling';
import imageCompression from 'browser-image-compression'; // Assuming you're using this library for compression
import { ResizingHelment } from '../seo/TabsHelment';

const Resizing = () => {
  const [error, setError] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [imageDetails, setImageDetails] = useState({
    name: '',
    dimensions: '',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState(null);
  const [targetSize, setTargetSize] = useState(''); // Target size in KB
  const [isResized, setIsResized] = useState(false); // To track if image is resized

  const handleFileUpload = (file) => {
    setError(null);
    setCompressedPreviewUrl(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setIsResized(false); // Reset resize state when new image is uploaded

    if (file) {
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
        setError('Error loading image.');
      };
      img.src = URL.createObjectURL(file);

      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleResize = async () => {
    if (!previewUrl) {
      setError('Please upload an image first.');
      return;
    }

    // Convert targetSize to a number before the check
    const targetSizeNum = parseFloat(targetSize);

    if (isNaN(targetSizeNum) || targetSizeNum <= 0) {
      setError('Please enter a valid target size in KB.');
      return;
    }

    // Convert originalSize to a number
    const originalSizeNum = parseFloat(originalSize);

    if (targetSizeNum >= originalSizeNum) {
      setError('Target size should be smaller than the original image size.');
      return;
    }

    try {
      // Log the target size and original size for debugging
      console.log('Original Size:', originalSizeNum, 'KB');
      console.log('Target Size:', targetSizeNum, 'KB');

      // Set compression options based on target size
      const options = {
        maxSizeMB: targetSizeNum / 1024, // Convert KB to MB
        maxWidthOrHeight: 800, // Maximum width or height (in px)
        useWebWorker: true, // Enable Web Worker for better performance
      };

      // Fetch the file from the preview URL and compress it
      const file = await fetch(previewUrl).then((res) => res.blob());

      const compressedFile = await imageCompression(file, options);

      const compressedFileSizeInKB = (compressedFile.size / 1024).toFixed(2);
      setCompressedSize(compressedFileSizeInKB);

      // Display an informational message if the target size is too small
      if (targetSizeNum < compressedFileSizeInKB) {
        setInfoMessage(`The smallest possible size after compression is ${compressedFileSizeInKB} KB. You can set a larger target size.`);
      }

      // const newFileName = file.name.split('.').slice(0, -1).join('.') + '_resized.' + file.name.split('.').pop();
      setCompressedPreviewUrl(URL.createObjectURL(compressedFile));

      setIsResized(true); // Set resize status to true
    } catch (err) {
      setError('Error resizing the image.');
      console.error(err);
    }
  };


  const handleDownloadResizedImage = () => {
    if (!compressedPreviewUrl) {
      setError('No resized image to download.');
      return;
    }

    const link = document.createElement('a');
    link.href = compressedPreviewUrl;
    link.download = `resized_image.jpg`; // You can adjust this based on the new name logic
    link.click();
  };

  return (
    <div className={styles.resizing}>

   
      <ResizingHelment />

      <UploadFileHandling onFileUpload={handleFileUpload} />

      {
        previewUrl && (
          <div className={styles.imageContainer}>
            {/* Side-by-side layout for original and resized images */}
            <div className={styles.imageBox}>
              <h3>Original Image</h3>
              {previewUrl && (
                <div className={styles.imagePreviewWrapper}>
                  <img src={previewUrl} alt="Original" className={styles.imagePreview} />
                  <div className={styles.imageDetails}>
                    <p><strong>Original Size:</strong> {originalSize} KB</p>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.imageBox}>
              <h3>Resized Image</h3>
              {isResized && compressedPreviewUrl && (
                <div className={styles.imagePreviewWrapper}>
                  <img src={compressedPreviewUrl} alt="Resized" className={styles.imagePreview} />
                  <div className={styles.imageDetails}>
                    <p><strong>Compressed Size:</strong> {compressedSize} KB</p>
                  </div>
                </div>
              )}
              {!isResized && (
                <p>No resized image available. Please resize the image.</p>
              )}
            </div>
          </div>
        )
      }

      <div className={styles.inputContainer}>
        <label htmlFor="">Enter Your Size</label>
        <input
          type="number"
          placeholder="Enter target size (KB)"
          value={targetSize}
          onChange={(e) => setTargetSize(e.target.value)}
          className={styles.targetSizeInput}
        />
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {infoMessage && <div className={styles.infoMessage}>{infoMessage}</div>}

      <div className={styles.compressionControls}>
        <button onClick={handleResize} className={styles.resizeButton}>
          Resize Image
        </button>
        {isResized && (
          <button onClick={handleDownloadResizedImage} className={styles.downloadButton}>
            Download Resized Image
          </button>
        )}
      </div>
    </div>
  );
};

export default Resizing;
