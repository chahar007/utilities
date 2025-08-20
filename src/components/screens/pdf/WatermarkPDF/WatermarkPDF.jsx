import React, { useState, useEffect } from 'react';
import styles from './WatermarkPDF.module.scss';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import UploadFileHandling from "../../../shared/UploadFileHandling/UploadFileHandling";
import useWatermark from './useWatermarkPDF';
import { WatermarkPDFHelmet } from "../../seo/PdfHelmet";


const WatermarkPDF = () => {
  // [Previous state declarations remain the same...]
  const [pdfFile, setPdfFile] = useState(null);
  const [originalPdfUrl, setOriginalPdfUrl] = useState(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Watermark state
  const [watermarkOptions, setWatermarkOptions] = useState({
    watermarkType: 'text',
    watermarkText: 'CONFIDENTIAL',
    watermarkImage: null,
    opacity: 50,
    rotation: 0,
    position: 'center',
    size: 'medium',
    color: '#000000',
    fontSize: 32
  });

  // Watermark hook
  const {
    applyWatermark,
    modifiedPdfUrl,
    isApplying,
    applyError
  } = useWatermark();

  // Handle PDF file upload
  const handlePdfUpload = (file) => {
    if (!file) return;
    setError(null);
    setPdfFile(file);
    // Create preview URL
    const url = URL.createObjectURL(file);
    setOriginalPdfUrl(url);
    setPreviewPdfUrl(url);
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }
    setWatermarkOptions(prev => ({
      ...prev,
      watermarkImage: file
    }));
  };

  // Clear all selections
  const resetForm = () => {
    setPdfFile(null);
    setOriginalPdfUrl(null);
    setPreviewPdfUrl(null);
    setWatermarkOptions({
      watermarkType: 'text',
      watermarkText: 'CONFIDENTIAL',
      watermarkImage: null,
      opacity: 50,
      rotation: 45,
      position: 'center',
      size: 'medium',
      color: '#ffffff',
      fontSize: 48
    });
    setError(null);
  };

  // Preview watermark changes
  const previewWatermark = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first');
      return;
    }

    if (watermarkOptions.watermarkType === 'image' && !watermarkOptions.watermarkImage) {
      setError('Please upload a watermark image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await applyWatermark(pdfFile, watermarkOptions);
      if (blob) {
        setPreviewPdfUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error('Error previewing watermark:', err);
      setError('Failed to preview watermark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download watermarked PDF
  const downloadWatermarkedPdf = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first');
      return;
    }

    if (watermarkOptions.watermarkType === 'image' && !watermarkOptions.watermarkImage) {
      setError('Please upload a watermark image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await applyWatermark(pdfFile, watermarkOptions);
      if (blob) {
        saveAs(blob, `watermarked_${pdfFile.name}`);
      }
    } catch (err) {
      console.error('Error downloading watermarked PDF:', err);
      setError('Failed to download watermarked PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop for PDF
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handlePdfUpload(file);
    } else {
      setError('Please drop a valid PDF file');
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalPdfUrl) URL.revokeObjectURL(originalPdfUrl);
      if (previewPdfUrl) URL.revokeObjectURL(previewPdfUrl);
      if (watermarkOptions.watermarkImage) URL.revokeObjectURL(URL.createObjectURL(watermarkOptions.watermarkImage));
    };
  }, [originalPdfUrl, previewPdfUrl, watermarkOptions.watermarkImage]);


  return (
    <div className={styles.watermarkContainer}>
      <WatermarkPDFHelmet />
      <div className={styles.header}>
        <h1>Add Watermark in you PDF's</h1>
        <p>Upload a PDF file and add text or image to the pdf pages</p>

      </div>

      <div className={styles.content}>
        {/* Left Panel - Controls */}
        <div className={styles.leftPanel}>

          <div className={styles.uploadSection}>
            <div className={styles.sectionHeader}>
              <h3>Upload PDF</h3>
              {pdfFile && (
                <button
                  onClick={resetForm}
                  className={styles.clearButton}
                  disabled={isLoading}
                >
                  Clear
                </button>
              )}
            </div>
            <div
              className={styles.dropArea}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <UploadFileHandling
                acceptedFormats={['application/pdf']}
                onFileUpload={handlePdfUpload}
              />
              {pdfFile && (
                <div className={styles.fileInfo}>
                  <span>{pdfFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.watermarkOptions}>
            <h3>Watermark Settings</h3>

            <div className={styles.optionRow}>
              <div className={styles.optionGroup}>
                <label>Watermark Type</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="watermarkType"
                      checked={watermarkOptions.watermarkType === 'text'}
                      onChange={() => setWatermarkOptions(prev => ({
                        ...prev,
                        watermarkType: 'text'
                      }))}
                      disabled={isLoading || !pdfFile}
                    />
                    <span>Text</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="watermarkType"
                      checked={watermarkOptions.watermarkType === 'image'}
                      onChange={() => setWatermarkOptions(prev => ({
                        ...prev,
                        watermarkType: 'image'
                      }))}
                      disabled={isLoading || !pdfFile}
                    />
                    <span>Image</span>
                  </label>
                </div>
              </div>

              <div className={styles.optionGroup}>
                <label>Position</label>
                <select
                  value={watermarkOptions.position}
                  onChange={(e) => setWatermarkOptions(prev => ({
                    ...prev,
                    position: e.target.value
                  }))}
                  disabled={isLoading || !pdfFile}
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="center">Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>

            {watermarkOptions.watermarkType === 'text' ? (
              <div className={styles.optionRow}>
                <div className={styles.optionGroup}>
                  <label>Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkOptions.watermarkText}
                    onChange={(e) => setWatermarkOptions(prev => ({
                      ...prev,
                      watermarkText: e.target.value
                    }))}
                    placeholder="Enter text"
                    disabled={isLoading || !pdfFile}
                  />
                </div>
                <div className={styles.optionGroup}>
                  <label>Text Color</label>
                  <div className={styles.colorPicker}>
                    <input
                      type="color"
                      value={watermarkOptions.color}
                      onChange={(e) => setWatermarkOptions(prev => ({
                        ...prev,
                        color: e.target.value
                      }))}
                      disabled={isLoading || !pdfFile}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.optionGroup}>
                <label>Watermark Image</label>
                <div className={styles.imageUpload}>
                  {watermarkOptions.watermarkImage ? (
                    <div className={styles.imagePreviewRow}>
                      <div className={styles.imagePreviewContainer}>
                        <img
                          src={URL.createObjectURL(watermarkOptions.watermarkImage)}
                          alt="Watermark preview"
                          className={styles.imagePreview}
                        />
                      </div>
                      <button
                        onClick={() => setWatermarkOptions(prev => ({
                          ...prev,
                          watermarkImage: null
                        }))}
                        className={styles.removeButton}
                        disabled={isLoading || !pdfFile}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className={styles.uploadArea}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        disabled={isLoading || !pdfFile}
                        id="fileupload"
                        className={styles.fileInput}
                      />
                      <label htmlFor="fileupload" className={styles.fileLabel}>
                        Upload watermark image
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.optionRow}>
              <div className={styles.optionGroup}>
                <label>Opacity: {watermarkOptions.opacity}%</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={watermarkOptions.opacity}
                  onChange={(e) => setWatermarkOptions(prev => ({
                    ...prev,
                    opacity: Number(e.target.value)
                  }))}
                  disabled={isLoading || !pdfFile}
                />
              </div>

              <div className={styles.optionGroup}>
                <label>Rotation: {watermarkOptions.rotation}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={watermarkOptions.rotation}
                  onChange={(e) => setWatermarkOptions(prev => ({
                    ...prev,
                    rotation: Number(e.target.value)
                  }))}
                  disabled={isLoading || !pdfFile}
                />
              </div>
            </div>

            {watermarkOptions.watermarkType === 'text' && (

              <div className={styles.optionRow}>
                <div className={styles.optionGroup}>
                  <label>Font Size: {watermarkOptions.fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={watermarkOptions.fontSize}
                    onChange={(e) => setWatermarkOptions(prev => ({
                      ...prev,
                      fontSize: parseInt(e.target.value)
                    }))}
                    disabled={isLoading || !pdfFile || watermarkOptions.watermarkType === 'image'}
                  />
                </div>

                <div className={styles.optionGroup}>
                  <label>Size</label>
                  <select
                    value={watermarkOptions.size}
                    onChange={(e) => setWatermarkOptions(prev => ({
                      ...prev,
                      size: e.target.value
                    }))}
                    disabled={isLoading || !pdfFile}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="cover">Cover</option>
                  </select>
                </div>
              </div>

            )}
          </div>

          <div className={styles.actionRow}>
            <button
              className={styles.previewButton}
              onClick={previewWatermark}
              disabled={isLoading || !pdfFile ||
                (watermarkOptions.watermarkType === 'image' && !watermarkOptions.watermarkImage)}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Previewing...
                </span>
              ) : (
                'Preview'
              )}
            </button>
            <button
              className={styles.downloadButton}
              onClick={downloadWatermarkedPdf}
              disabled={isLoading || !pdfFile ||
                (watermarkOptions.watermarkType === 'image' && !watermarkOptions.watermarkImage)}
            >
              Download
            </button>
          </div>
          {(error || applyError) && <div className={styles.error}>{error || applyError}</div>}
        </div>

        {/* Right Panel - Preview */}
        <div className={styles.rightPanel}>
          {previewPdfUrl ? (
            <div className={styles.previewContainer}>
              <iframe
                src={previewPdfUrl}
                title="PDF Preview"
                className={styles.pdfPreview}
              />
              <div className={styles.previewOverlay}>
                <p>Preview of your watermarked PDF</p>
                {previewPdfUrl !== originalPdfUrl && (
                  <button
                    className={styles.resetPreviewButton}
                    onClick={() => setPreviewPdfUrl(originalPdfUrl)}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderContent}>
                <svg viewBox="0 0 24 24" className={styles.placeholderIcon}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <h3>No PDF Selected</h3>
                <p>Upload a PDF file to preview and add watermark</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatermarkPDF;