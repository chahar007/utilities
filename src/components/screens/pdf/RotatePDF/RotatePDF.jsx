import React, { useState, useCallback } from "react";
import { _rotatePDF } from "./useRotatePDF";
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import styles from './RotatePDF.module.scss';
import { RotatePDFHelmet } from "../../seo/PdfHelmet";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Detect Mobile

const RotatePDF = () => {
    const [file, setFile] = useState(null);
    const [rotation, setRotation] = useState(90);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [processedUrl, setProcessedUrl] = useState(null);

    const handleFileUpload = (uploadedFile) => {
        setFile(uploadedFile);
        setPreviewUrl(URL.createObjectURL(uploadedFile));
        setProcessedUrl(null); // Reset previous result
    };

    const handleRotationChange = (degrees) => {
        setRotation(degrees);
    };

    const handleRotate = useCallback(async () => {
        if (!file) return;

        setLoading(true);
        try {
            const rotatedBlob = await _rotatePDF(file, rotation);
            const url = URL.createObjectURL(rotatedBlob);
            setProcessedUrl(url);
        } catch (error) {
            alert("Failed to rotate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [file, rotation]);

    const handleDownload = (url, filename) => {
        if (!url) return;
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleReupload = () => {
        setFile(null);
        setPreviewUrl(null);
        setProcessedUrl(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (processedUrl) URL.revokeObjectURL(processedUrl);
    };

    return (
        <div className={styles.container}>
            <RotatePDFHelmet />
            <div className={styles.sidebar}>
                <h2>PDF Rotation Tools</h2>

                <div className={styles.controlGroup}>
                    <h3>Rotation Angle</h3>
                    <div className={styles.rotationOptions}>
                        {[90, 180, 270].map(deg => (
                            <button
                                key={deg}
                                className={`${styles.rotationBtn} ${rotation === deg ? styles.active : ''}`}
                                onClick={() => handleRotationChange(deg)}
                            >
                                {deg}°
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.controlGroup}>
                    <h3>Actions</h3>
                    <button 
                        className={styles.actionBtn} 
                        onClick={handleRotate} 
                        disabled={loading || !file}
                    >
                        {loading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            <i className="fas fa-sync-alt"></i>
                        )}
                        Rotate PDF
                    </button>

                    {processedUrl && (
                        <button 
                            className={styles.actionBtn} 
                            onClick={() => handleDownload(processedUrl, `rotated_${rotation}deg.pdf`)}
                        >
                            <i className="fas fa-download"></i>
                            Download Rotated PDF
                        </button>
                    )}

                    {file && (
                        <button 
                            className={styles.reuploadBtn} 
                            onClick={handleReupload}
                        >
                            <i className="fas fa-redo"></i>
                            Re-upload PDF
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.mainContent}>
                {!file ? (
                    <div className={styles.uploadArea}>
                        <UploadFileHandling 
                            onFileUpload={handleFileUpload} 
                            acceptedFormats={["application/pdf"]}
                        />
                        <p className={styles.uploadHint}>
                            Upload a PDF file to begin rotation
                        </p>
                    </div>
                ) : (
                    <div className={styles.previewContainer}>
                        <div className={styles.previewSection}>
                            <h3>Original PDF</h3>
                            <div className={styles.pdfPreview}>
                                {isMobile ? (
                                    <div className={styles.mobileActions}>
                                        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                                            🔗 Open Original PDF
                                        </a>
                                    </div>
                                ) : (
                                    previewUrl && (
                                        <iframe 
                                            src={previewUrl} 
                                            title="Original PDF Preview"
                                            className={styles.pdfFrame}
                                        />
                                    )
                                )}
                            </div>
                        </div>

                        {processedUrl ? (
                            <div className={styles.previewSection}>
                                <h3>Rotated PDF ({rotation}°)</h3>
                                <div className={styles.pdfPreview}>
                                    {isMobile ? (
                                        <div className={styles.mobileActions}>
                                            <a href={processedUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                                                🔗 Open Rotated PDF
                                            </a>
                                        </div>
                                    ) : (
                                        <iframe 
                                            src={processedUrl} 
                                            title="Rotated PDF Preview"
                                            className={styles.pdfFrame}
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.placeholder}>
                                <i className="fas fa-arrow-right"></i>
                                <p>Click "Rotate PDF" to see the result</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RotatePDF;