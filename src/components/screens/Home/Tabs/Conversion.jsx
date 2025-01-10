import React, { useState, useEffect } from "react";
import styles from "./styles/Conversion.module.scss";
import UploadFileHandling from "../components/UploadFileHandling";
import { ConversionHelmet } from "../seo/TabsHelment";

const Conversion = () => {
  const [selectedFormat, setSelectedFormat] = useState("jpg");
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const [sizeReduction, setSizeReduction] = useState(null);
  const [imageDetails, setImageDetails] = useState({
    name: "",
    dimensions: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (originalSize !== null) {
      calculateConvertedSize();
    }
  }, [quality, selectedFormat, originalSize]);

  const calculateConvertedSize = async () => {
    if (previewUrl && selectedFormat) {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = previewUrl;

      img.onload = async () => {
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let imageDataUrl;
        if (selectedFormat === "jpg" || selectedFormat === "jpeg") {
          imageDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        } else if (selectedFormat === "png") {
          imageDataUrl = canvas.toDataURL('image/png');
        } else if (selectedFormat === "webp") {
          imageDataUrl = canvas.toDataURL('image/webp', quality / 100);
        }

        const byteString = atob(imageDataUrl.split(',')[1]);
        const length = byteString.length;
        const sizeInKB = (length / 1024).toFixed(2);

        setConvertedSize(sizeInKB);
        calculateSizeReduction();
      };

      img.onerror = () => {
        setError("Error loading image for size calculation.");
      };
    }
  };

  const calculateSizeReduction = () => {
    if (originalSize && convertedSize) {
      const reduction = ((originalSize - convertedSize) / originalSize) * 100;
      setSizeReduction(reduction.toFixed(2));
    }
  };

  const handleFileUpload = (file) => {
    setError(null);
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
        setError("Error loading image.");
      };
      img.src = URL.createObjectURL(file);

      setPreviewUrl(URL.createObjectURL(file));
      calculateConvertedSize();
    }
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  const handleDownload = () => {
    if (!previewUrl) {
      setError("No image selected for conversion.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = previewUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let imageDataUrl;
      if (selectedFormat === "jpg") {
        imageDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      } else if (selectedFormat === "png") {
        imageDataUrl = canvas.toDataURL("image/png");
      } else if (selectedFormat === "webp") {
        imageDataUrl = canvas.toDataURL("image/webp", quality / 100);
      }

      const link = document.createElement("a");
      link.href = imageDataUrl;
      link.download = `${imageDetails.name.split('.')[0]}_converted.${selectedFormat}`;
      link.click();
    };
    img.onerror = () => {
      setError("Error loading image for download.");
    };
  };

  return (
    <div className={styles.conversion}>

     <ConversionHelmet />


      <UploadFileHandling onFileUpload={handleFileUpload} />

      {previewUrl && (
        <div className={styles.previewContainer}>
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          {originalSize && (
            <div className={styles.imageDetails}>
              <p className={styles.imageName}>{imageDetails.name}</p>
              <p className={styles.detailsItem}>
                <span>Original Size: </span>
                <span className={styles.highlight}>{originalSize} KB</span>
              </p>
              <p className={styles.detailsItem}>
                <span>Dimensions: </span>
                {imageDetails.dimensions}
              </p>
              {convertedSize && (
                <p className={styles.detailsItem}>
                  <span>Converted Size: </span>
                  <span className={styles.highlight}>{convertedSize} KB</span>
                </p>
              )}
              {sizeReduction && (
                <p className={styles.detailsItem}>
                  <span>Size Reduction: </span>
                  <span className={styles.highlight}>{sizeReduction}%</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.convertSection}>
        <div className={styles.selectBox}>
          <label htmlFor="format">Conversion Format</label>
          <select
            id="format"
            value={selectedFormat}
            onChange={handleFormatChange}
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        <div className={styles.qualitySlider}>
          <label htmlFor="quality">Quality: {quality}%</label>
          <input
            id="quality"
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={handleQualityChange}
          />
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}


      <button className={styles.downloadButton} onClick={handleDownload}>
        Convert & Download
      </button>
    </div>
  );
};

export default Conversion;
