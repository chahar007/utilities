import React, { useState } from 'react';
import styles from './styles/Base64.module.scss';
import UploadFileHandling from '../components/UploadFileHandling';
import { Base64Helmet } from '../seo/TabsHelment';

const Base64 = () => {
  const [error, setError] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64String, setBase64String] = useState(null); // State for Base64 output

  const handleFileUpload = (file) => {
    setError(null);
    setOriginalSize(null);
    setBase64String(null);

    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setError("Please upload a valid image file.");
        return;
      }

      const fileSizeInKB = (file.size / 1024).toFixed(2);
      setOriginalSize(fileSizeInKB);

      // const img = new Image();
      // img.onload = () => {
      //   setImageDetails({
      //     name: file.name,
      //     dimensions: `${img.width}x${img.height}px`,
      //   });
      // };
      // img.onerror = () => {
      //   setError("Error loading image.");
      // };
      // img.src = URL.createObjectURL(file);

      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setError("Please upload an image first.");
    }
  };

  const handleGenerateBase64 = () => {
    if (!previewUrl) {
      setError("Please upload an image first.");
      return;
    }

    fetch(previewUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64String(reader.result);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        setError("Error converting image to Base64.");
      });
  };


  const copyBase64 = () => {
    if (!base64String) {
      setError("No Base64 string to copy.");
      return;
    }

    navigator.clipboard.writeText(base64String)
      .then(() => {
        alert("Base64 copied to clipboard!"); // You can replace this with a toast notification
      })
      .catch(() => {
        setError("Failed to copy Base64.");
      });
  };


  return (
    <div className={styles.base64}>
      <Base64Helmet />

      <UploadFileHandling onFileUpload={handleFileUpload} />

      {!previewUrl && (
        <div className={styles.noFileMessage}>
          <h4>No image uploaded yet. Please upload an image to convert base64 string.</h4>
        </div>
      )}

      <div className={styles.imageContainer}>
        {previewUrl && (
          <>
            <div className={styles.originalImage}>
              <img src={previewUrl} alt="Original" />
              <div className={styles.imageDetails}>
                <p><strong>Original Size:</strong> {originalSize} KB</p>
              </div>
            </div>
            {
              base64String && (
                <div className={styles.base64Container}>
                  <h5 onClick={copyBase64} className={styles.copyBase64} >Click here to copy the base64 output</h5>
                  <textarea
                    className={styles.base64Output}
                    value={base64String}
                    rows="15"
                  />
                </div>
              )
            }

          </>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.compressionControls}>
        <button onClick={handleGenerateBase64} className={styles.uploadButton}>
          Generate Base64
        </button>
      </div>
    </div>
  );
};

export default Base64;
