import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import UploadFileHandling from "../Home/components/UploadFileHandling";
import styles from "./CropImage.module.scss";
import { CropImageHelmet } from "../seo/TabsHelment";

const CropImage = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 50, height: 50 });
  const [croppedImage, setCroppedImage] = useState(null);
  const imageRef = useRef(null);

  /** Handle file upload */
  const handleFileUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  /** Crop the image and get the cropped area */
  const getCroppedImage = async () => {
    if (!imageRef.current) return;
    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedBase64 = canvas.toDataURL("image/jpeg");
    setCroppedImage(croppedBase64);
  };

  /** Download the cropped image */
  const downloadCroppedImage = () => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = "cropped-image.jpg";
    link.click();
  };

  return (
    <div className={styles.cropImgPage}>

      <CropImageHelmet />

      <h2 className={styles.headingTool} >Effortless Image Resizing</h2>
      <p className={styles.instructions}>
        Easily crop images to the perfect size for social media, websites, 
        <br /> or personal use. Upload, adjust, and download in seconds!
      </p>

      <UploadFileHandling onFileUpload={handleFileUpload} />



      {!imageSrc && <p className={styles.noFileMessage}>No image uploaded yet. Please upload an image to crop.</p>}

      {imageSrc && (
        <>
          <div className={styles.imageRow}>
            <div className={styles.imageContainer}>
              <h4>Original Image</h4>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={NaN} // Allows free selection
              >
                <img ref={imageRef} src={imageSrc} alt="To Crop" className={styles.image} />
              </ReactCrop>
            </div>

            {croppedImage && (
              <div className={styles.imageContainer}>
                <h4>Cropped Image</h4>
                <img src={croppedImage} alt="Cropped" className={styles.croppedImage} />
              </div>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.cropButton} onClick={getCroppedImage}>
              Crop Image
            </button>
            {croppedImage && (
              <button className={styles.downloadButton} onClick={downloadCroppedImage}>
                Download Cropped Image
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CropImage;
