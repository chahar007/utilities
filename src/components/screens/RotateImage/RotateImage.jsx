import React, { useState, useRef } from "react";
import styles from "./RotateImage.module.scss";
import UploadFileHandling from "../Home/components/UploadFileHandling";

const RotateImage = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [rotation, setRotation] = useState(0);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    /** Handle file upload */
    const handleFileUpload = (file) => {
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(file);
        setRotation(0);
    };

    /** Rotate Image */
    const rotateImage = (angle) => {
        setRotation((prevRotation) => prevRotation + angle);
    };

    /** Set Rotation to Specific Degree */
    const setRotationToDegree = (degree) => {
        setRotation(degree);
    };

    /** Download Rotated Image */
    const downloadRotatedImage = () => {
        if (!imageRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imageRef.current;
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (rotation % 180 !== 0) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "rotated-image.png";
        link.click();
    };

    return (
        <div className={styles.container}>
            {/* Left Section - Action Buttons */}
            <div className={styles.leftSection}>
                {/* <h2>Image Editor</h2>
                <p className={styles.description}>
                    This tool allows you to upload an image and apply various transformations such as rotating
                    it to a specific angle. Use the buttons below to manipulate your image with ease. */}
                {/* </p> */}

                <div className={styles.actions}>
                    <h2 className={styles.sectionTitle}>Rotate Image</h2>
                    <p className={styles.description}>
                        Use the buttons below to rotate the image left or right by 90 degrees.
                    </p>
                    <button onClick={() => rotateImage(-90)}>↺ Rotate Left</button>
                    <button onClick={() => rotateImage(90)}>↻ Rotate Right</button>
                    <hr className={styles.divider} />
                    <p className={styles.sectionTitle}>Set a Specific Rotation Angle</p>
                    <div className={styles.degreeButtons}>
                        <button onClick={() => setRotationToDegree(0)}>0°</button>
                        <button onClick={() => setRotationToDegree(90)}>90°</button>
                        <button onClick={() => setRotationToDegree(180)}>180°</button>
                        <button onClick={() => setRotationToDegree(270)}>270°</button>
                        <button onClick={() => setRotationToDegree(360)}>360°</button>
                    </div>

                    <hr className={styles.divider} />

                    <p className={styles.sectionTitle}>Download Your Image</p>
                    <p className={styles.description}>
                        Once you're happy with the rotation, download the final image.
                    </p>
                    <button className={styles.downloadBtn} onClick={downloadRotatedImage}>
                        ⬇ Download Rotated Image
                    </button>
                </div>

            </div>

            {/* Right Section - Image Upload and Preview */}
            <div className={styles.rightSection}>
            <h2 className={styles.sectionTitle}>Rotate Image Instantly</h2>

                <p className={styles.description}>
                    
                Quickly rotate your image left or right or set it to a fixed angle. Adjust with a click and download the perfect orientation!
                </p>
                <UploadFileHandling onFileUpload={handleFileUpload} />

                <div className={styles.previewArea}>
                    <h3 className={styles.outputTitle}>Output Preview</h3>
                    {imageSrc ? (
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt="Rotated Preview"
                            className={styles.rotatedImage}
                            style={{ transform: `rotate(${rotation}deg)` }}
                        />
                    ) : (
                        <p className={styles.placeholderText}>Upload an image to edit</p>
                    )}
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default RotateImage;
